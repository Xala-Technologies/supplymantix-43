-- Add missing recurrence support columns to work orders
ALTER TABLE public.work_orders 
ADD COLUMN IF NOT EXISTS recurrence_rule TEXT DEFAULT 'none',
ADD COLUMN IF NOT EXISTS recurrence_interval INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS recurrence_end_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS next_occurrence TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS parent_recurrence_id UUID REFERENCES public.work_orders(id);

-- Create recurring work orders table to track recurrence metadata
CREATE TABLE IF NOT EXISTS public.work_order_recurrences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  work_order_id UUID NOT NULL REFERENCES public.work_orders(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  recurrence_pattern JSONB NOT NULL,
  last_generated_at TIMESTAMP WITH TIME ZONE,
  next_due_at TIMESTAMP WITH TIME ZONE NOT NULL,
  total_generated INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.work_order_recurrences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view recurrences in their tenant" 
  ON public.work_order_recurrences 
  FOR SELECT 
  USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can manage recurrences in their tenant" 
  ON public.work_order_recurrences 
  FOR ALL 
  USING (tenant_id = get_user_tenant_id());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_work_order_recurrences_next_due ON public.work_order_recurrences(next_due_at) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_work_order_recurrences_tenant ON public.work_order_recurrences(tenant_id);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_work_order_recurrences_updated_at
  BEFORE UPDATE ON public.work_order_recurrences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate next work order from recurrence
CREATE OR REPLACE FUNCTION public.generate_recurring_work_order(recurrence_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  recurrence_record RECORD;
  original_wo RECORD;
  new_wo_id UUID;
  user_tenant_id UUID;
BEGIN
  -- Get user's tenant_id
  SELECT tenant_id INTO user_tenant_id FROM public.users WHERE id = auth.uid();
  
  -- Get recurrence details
  SELECT * INTO recurrence_record 
  FROM public.work_order_recurrences 
  WHERE id = recurrence_id AND tenant_id = user_tenant_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Recurrence not found or access denied';
  END IF;
  
  -- Get original work order
  SELECT * INTO original_wo 
  FROM public.work_orders 
  WHERE id = recurrence_record.work_order_id;
  
  -- Create new work order
  INSERT INTO public.work_orders (
    tenant_id, title, description, priority, status, 
    work_type, location, asset, due_date, estimated_hours,
    estimated_minutes, assigned_to, created_by, 
    parent_recurrence_id, tags
  )
  VALUES (
    original_wo.tenant_id,
    original_wo.title,
    original_wo.description,
    original_wo.priority,
    'open',
    original_wo.work_type,
    original_wo.location,
    original_wo.asset,
    recurrence_record.next_due_at,
    original_wo.estimated_hours,
    original_wo.estimated_minutes,
    original_wo.assigned_to,
    original_wo.created_by,
    recurrence_record.work_order_id,
    original_wo.tags
  )
  RETURNING id INTO new_wo_id;
  
  -- Update recurrence record
  UPDATE public.work_order_recurrences 
  SET 
    last_generated_at = now(),
    total_generated = total_generated + 1,
    next_due_at = CASE 
      WHEN (recurrence_pattern->>'rule')::text = 'daily' THEN 
        next_due_at + INTERVAL '1 day' * (recurrence_pattern->>'interval')::int
      WHEN (recurrence_pattern->>'rule')::text = 'weekly' THEN 
        next_due_at + INTERVAL '1 week' * (recurrence_pattern->>'interval')::int
      WHEN (recurrence_pattern->>'rule')::text = 'monthly' THEN 
        next_due_at + INTERVAL '1 month' * (recurrence_pattern->>'interval')::int
      WHEN (recurrence_pattern->>'rule')::text = 'yearly' THEN 
        next_due_at + INTERVAL '1 year' * (recurrence_pattern->>'interval')::int
      ELSE next_due_at
    END,
    updated_at = now()
  WHERE id = recurrence_id;
  
  RETURN new_wo_id;
END;
$$;