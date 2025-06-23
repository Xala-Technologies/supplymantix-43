
-- Create meters table
CREATE TABLE public.meters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  asset_id UUID REFERENCES public.assets(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'manual', -- 'manual' or 'automated'
  unit TEXT NOT NULL,
  reading_frequency TEXT DEFAULT 'none', -- 'none', 'hour', 'day', 'week', 'month', 'year'
  current_value NUMERIC DEFAULT 0,
  target_min NUMERIC,
  target_max NUMERIC,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'warning', 'critical', 'inactive'
  description TEXT,
  location TEXT,
  last_reading_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create meter readings table
CREATE TABLE public.meter_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meter_id UUID NOT NULL REFERENCES public.meters(id) ON DELETE CASCADE,
  value NUMERIC NOT NULL,
  comment TEXT,
  recorded_by UUID REFERENCES auth.users(id),
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create meter triggers table
CREATE TABLE public.meter_triggers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meter_id UUID NOT NULL REFERENCES public.meters(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  trigger_condition TEXT NOT NULL, -- 'above', 'below', 'equals'
  trigger_value NUMERIC NOT NULL,
  action TEXT NOT NULL DEFAULT 'create_work_order', -- 'create_work_order', 'send_notification'
  is_active BOOLEAN NOT NULL DEFAULT true,
  throttle_hours INTEGER DEFAULT 24,
  last_fired_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX idx_meters_tenant_id ON public.meters(tenant_id);
CREATE INDEX idx_meters_asset_id ON public.meters(asset_id);
CREATE INDEX idx_meter_readings_meter_id ON public.meter_readings(meter_id);
CREATE INDEX idx_meter_readings_recorded_at ON public.meter_readings(recorded_at);
CREATE INDEX idx_meter_triggers_meter_id ON public.meter_triggers(meter_id);

-- Enable Row Level Security
ALTER TABLE public.meters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meter_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meter_triggers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for meters
CREATE POLICY "Users can view meters in their tenant" 
  ON public.meters FOR SELECT 
  USING (tenant_id IN (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Users can create meters in their tenant" 
  ON public.meters FOR INSERT 
  WITH CHECK (tenant_id IN (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Users can update meters in their tenant" 
  ON public.meters FOR UPDATE 
  USING (tenant_id IN (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Users can delete meters in their tenant" 
  ON public.meters FOR DELETE 
  USING (tenant_id IN (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

-- RLS Policies for meter readings
CREATE POLICY "Users can view readings for meters in their tenant" 
  ON public.meter_readings FOR SELECT 
  USING (meter_id IN (SELECT id FROM public.meters WHERE tenant_id IN (SELECT tenant_id FROM public.users WHERE id = auth.uid())));

CREATE POLICY "Users can create readings for meters in their tenant" 
  ON public.meter_readings FOR INSERT 
  WITH CHECK (meter_id IN (SELECT id FROM public.meters WHERE tenant_id IN (SELECT tenant_id FROM public.users WHERE id = auth.uid())));

-- RLS Policies for meter triggers
CREATE POLICY "Users can view triggers for meters in their tenant" 
  ON public.meter_triggers FOR SELECT 
  USING (meter_id IN (SELECT id FROM public.meters WHERE tenant_id IN (SELECT tenant_id FROM public.users WHERE id = auth.uid())));

CREATE POLICY "Users can create triggers for meters in their tenant" 
  ON public.meter_triggers FOR INSERT 
  WITH CHECK (meter_id IN (SELECT id FROM public.meters WHERE tenant_id IN (SELECT tenant_id FROM public.users WHERE id = auth.uid())));

CREATE POLICY "Users can update triggers for meters in their tenant" 
  ON public.meter_triggers FOR UPDATE 
  USING (meter_id IN (SELECT id FROM public.meters WHERE tenant_id IN (SELECT tenant_id FROM public.users WHERE id = auth.uid())));

CREATE POLICY "Users can delete triggers for meters in their tenant" 
  ON public.meter_triggers FOR DELETE 
  USING (meter_id IN (SELECT id FROM public.meters WHERE tenant_id IN (SELECT tenant_id FROM public.users WHERE id = auth.uid())));

-- Function to update meter status and current value when a reading is added
CREATE OR REPLACE FUNCTION update_meter_on_reading()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.meters 
  SET 
    current_value = NEW.value,
    last_reading_at = NEW.recorded_at,
    status = CASE
      WHEN (target_min IS NOT NULL AND NEW.value < target_min) OR 
           (target_max IS NOT NULL AND NEW.value > target_max) THEN 'critical'
      WHEN (target_min IS NOT NULL AND NEW.value < target_min * 1.1) OR 
           (target_max IS NOT NULL AND NEW.value > target_max * 0.9) THEN 'warning'
      ELSE 'active'
    END,
    updated_at = now()
  WHERE id = NEW.meter_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update meter when reading is added
CREATE TRIGGER trigger_update_meter_on_reading
  AFTER INSERT ON public.meter_readings
  FOR EACH ROW
  EXECUTE FUNCTION update_meter_on_reading();

-- Function to check and fire meter triggers
CREATE OR REPLACE FUNCTION check_meter_triggers()
RETURNS TRIGGER AS $$
DECLARE
  trigger_record RECORD;
  should_fire BOOLEAN;
BEGIN
  -- Check all active triggers for this meter
  FOR trigger_record IN 
    SELECT * FROM public.meter_triggers 
    WHERE meter_id = NEW.meter_id 
    AND is_active = true
    AND (last_fired_at IS NULL OR last_fired_at < now() - INTERVAL '1 hour' * throttle_hours)
  LOOP
    should_fire := false;
    
    -- Check trigger condition
    CASE trigger_record.trigger_condition
      WHEN 'above' THEN
        should_fire := NEW.value > trigger_record.trigger_value;
      WHEN 'below' THEN
        should_fire := NEW.value < trigger_record.trigger_value;
      WHEN 'equals' THEN
        should_fire := NEW.value = trigger_record.trigger_value;
    END CASE;
    
    -- If trigger should fire, update last_fired_at
    IF should_fire THEN
      UPDATE public.meter_triggers 
      SET last_fired_at = now() 
      WHERE id = trigger_record.id;
      
      -- Here you could add logic to create work orders or send notifications
      -- For now, we'll just log that the trigger fired
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to check meter triggers when a reading is added
CREATE TRIGGER trigger_check_meter_triggers
  AFTER INSERT ON public.meter_readings
  FOR EACH ROW
  EXECUTE FUNCTION check_meter_triggers();
