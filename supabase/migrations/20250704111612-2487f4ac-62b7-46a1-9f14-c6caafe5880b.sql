-- Create missing tables for enhanced meters functionality

-- First, ensure we have the meter_readings and meter_triggers tables (if not exists)
CREATE TABLE IF NOT EXISTS public.meter_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meter_id UUID NOT NULL REFERENCES public.meters(id) ON DELETE CASCADE,
  value NUMERIC NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  recorded_by UUID REFERENCES auth.users(id),
  notes TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.meter_triggers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meter_id UUID NOT NULL REFERENCES public.meters(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  trigger_condition TEXT NOT NULL CHECK (trigger_condition IN ('above', 'below', 'equals')),
  trigger_value NUMERIC NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('create_work_order', 'send_notification', 'change_asset_status')),
  action_config JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  throttle_hours INTEGER DEFAULT 24,
  last_fired_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add meter attachments table
CREATE TABLE IF NOT EXISTS public.meter_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meter_id UUID NOT NULL REFERENCES public.meters(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add work order meter readings bridge table
CREATE TABLE IF NOT EXISTS public.work_order_meter_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id UUID NOT NULL,
  meter_id UUID NOT NULL REFERENCES public.meters(id) ON DELETE CASCADE,
  reading_required BOOLEAN DEFAULT true,
  reading_completed BOOLEAN DEFAULT false,
  actual_reading_id UUID REFERENCES public.meter_readings(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.meter_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meter_triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meter_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_order_meter_readings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for meter_readings
CREATE POLICY "Users can view meter readings in their tenant" ON public.meter_readings
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.meters m 
    WHERE m.id = meter_readings.meter_id 
    AND m.tenant_id = get_user_tenant_id()
  )
);

CREATE POLICY "Users can create meter readings in their tenant" ON public.meter_readings
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.meters m 
    WHERE m.id = meter_readings.meter_id 
    AND m.tenant_id = get_user_tenant_id()
  )
);

CREATE POLICY "Users can update meter readings in their tenant" ON public.meter_readings
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.meters m 
    WHERE m.id = meter_readings.meter_id 
    AND m.tenant_id = get_user_tenant_id()
  )
);

-- Create RLS policies for meter_triggers
CREATE POLICY "Users can view meter triggers in their tenant" ON public.meter_triggers
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.meters m 
    WHERE m.id = meter_triggers.meter_id 
    AND m.tenant_id = get_user_tenant_id()
  )
);

CREATE POLICY "Users can manage meter triggers in their tenant" ON public.meter_triggers
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.meters m 
    WHERE m.id = meter_triggers.meter_id 
    AND m.tenant_id = get_user_tenant_id()
  )
);

-- Create RLS policies for meter_attachments
CREATE POLICY "Users can view meter attachments in their tenant" ON public.meter_attachments
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.meters m 
    WHERE m.id = meter_attachments.meter_id 
    AND m.tenant_id = get_user_tenant_id()
  )
);

CREATE POLICY "Users can manage meter attachments in their tenant" ON public.meter_attachments
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.meters m 
    WHERE m.id = meter_attachments.meter_id 
    AND m.tenant_id = get_user_tenant_id()
  )
);

-- Create RLS policies for work_order_meter_readings
CREATE POLICY "Users can view work order meter readings in their tenant" ON public.work_order_meter_readings
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.work_orders wo 
    WHERE wo.id = work_order_meter_readings.work_order_id 
    AND wo.tenant_id = get_user_tenant_id()
  )
);

CREATE POLICY "Users can manage work order meter readings in their tenant" ON public.work_order_meter_readings
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.work_orders wo 
    WHERE wo.id = work_order_meter_readings.work_order_id 
    AND wo.tenant_id = get_user_tenant_id()
  )
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_meter_readings_meter_id ON public.meter_readings(meter_id);
CREATE INDEX IF NOT EXISTS idx_meter_readings_recorded_at ON public.meter_readings(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_meter_triggers_meter_id ON public.meter_triggers(meter_id);
CREATE INDEX IF NOT EXISTS idx_meter_triggers_active ON public.meter_triggers(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_meter_attachments_meter_id ON public.meter_attachments(meter_id);
CREATE INDEX IF NOT EXISTS idx_work_order_meter_readings_work_order_id ON public.work_order_meter_readings(work_order_id);
CREATE INDEX IF NOT EXISTS idx_work_order_meter_readings_meter_id ON public.work_order_meter_readings(meter_id);

-- Add triggers for automatic timestamps
CREATE TRIGGER update_meter_triggers_updated_at
  BEFORE UPDATE ON public.meter_triggers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_work_order_meter_readings_updated_at
  BEFORE UPDATE ON public.work_order_meter_readings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();