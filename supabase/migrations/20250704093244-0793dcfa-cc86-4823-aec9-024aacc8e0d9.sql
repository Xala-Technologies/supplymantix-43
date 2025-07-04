-- Work Orders Enhancement: Add missing fields and supporting tables

-- Add missing fields to work_orders table
ALTER TABLE public.work_orders 
ADD COLUMN IF NOT EXISTS work_type TEXT DEFAULT 'reactive',
ADD COLUMN IF NOT EXISTS estimated_hours INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS estimated_minutes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.work_orders(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS procedure_id UUID REFERENCES public.procedures(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS started_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS recurring_parent_id UUID REFERENCES public.work_orders(id) ON DELETE SET NULL;

-- Create work_order_procedures junction table for multiple procedures
CREATE TABLE IF NOT EXISTS public.work_order_procedures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  work_order_id UUID NOT NULL REFERENCES public.work_orders(id) ON DELETE CASCADE,
  procedure_id UUID NOT NULL REFERENCES public.procedures(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  tenant_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(work_order_id, procedure_id)
);

-- Create work_order_assignments for multiple user assignments
CREATE TABLE IF NOT EXISTS public.work_order_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  work_order_id UUID NOT NULL REFERENCES public.work_orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'assignee' CHECK (role IN ('assignee', 'reviewer', 'supervisor')),
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  assigned_by UUID REFERENCES public.users(id),
  tenant_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(work_order_id, user_id, role)
);

-- Create work_order_parts_used for parts tracking
CREATE TABLE IF NOT EXISTS public.work_order_parts_used (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  work_order_id UUID NOT NULL REFERENCES public.work_orders(id) ON DELETE CASCADE,
  inventory_item_id UUID REFERENCES public.inventory_items(id) ON DELETE SET NULL,
  part_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_cost DECIMAL(10,2),
  total_cost DECIMAL(10,2),
  notes TEXT,
  used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  used_by UUID REFERENCES public.users(id),
  tenant_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create work_order_status_history for status tracking
CREATE TABLE IF NOT EXISTS public.work_order_status_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  work_order_id UUID NOT NULL REFERENCES public.work_orders(id) ON DELETE CASCADE,
  old_status work_order_status,
  new_status work_order_status NOT NULL,
  changed_by UUID REFERENCES public.users(id),
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  tenant_id UUID NOT NULL
);

-- Enable RLS on new tables
ALTER TABLE public.work_order_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_order_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_order_parts_used ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_order_status_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for work_order_procedures
CREATE POLICY "Users can view work order procedures in their tenant" 
  ON public.work_order_procedures 
  FOR SELECT 
  USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can manage work order procedures in their tenant" 
  ON public.work_order_procedures 
  FOR ALL 
  USING (tenant_id = get_user_tenant_id());

-- RLS policies for work_order_assignments
CREATE POLICY "Users can view work order assignments in their tenant" 
  ON public.work_order_assignments 
  FOR SELECT 
  USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can manage work order assignments in their tenant" 
  ON public.work_order_assignments 
  FOR ALL 
  USING (tenant_id = get_user_tenant_id());

-- RLS policies for work_order_parts_used
CREATE POLICY "Users can view work order parts in their tenant" 
  ON public.work_order_parts_used 
  FOR SELECT 
  USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can manage work order parts in their tenant" 
  ON public.work_order_parts_used 
  FOR ALL 
  USING (tenant_id = get_user_tenant_id());

-- RLS policies for work_order_status_history
CREATE POLICY "Users can view work order status history in their tenant" 
  ON public.work_order_status_history 
  FOR SELECT 
  USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can create status history records in their tenant" 
  ON public.work_order_status_history 
  FOR INSERT 
  WITH CHECK (tenant_id = get_user_tenant_id());

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_work_order_procedures_work_order_id ON public.work_order_procedures(work_order_id);
CREATE INDEX IF NOT EXISTS idx_work_order_assignments_work_order_id ON public.work_order_assignments(work_order_id);
CREATE INDEX IF NOT EXISTS idx_work_order_assignments_user_id ON public.work_order_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_work_order_parts_used_work_order_id ON public.work_order_parts_used(work_order_id);
CREATE INDEX IF NOT EXISTS idx_work_order_status_history_work_order_id ON public.work_order_status_history(work_order_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_parent_id ON public.work_orders(parent_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_procedure_id ON public.work_orders(procedure_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_vendor_id ON public.work_orders(vendor_id);

-- Create triggers for status history tracking
CREATE OR REPLACE FUNCTION track_work_order_status_changes()
RETURNS TRIGGER AS $$
DECLARE
  user_tenant_id UUID;
BEGIN
  -- Get current user's tenant_id
  SELECT tenant_id INTO user_tenant_id FROM public.users WHERE id = auth.uid();
  
  -- Only track if status actually changed
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.work_order_status_history (
      work_order_id,
      old_status,
      new_status,
      changed_by,
      tenant_id
    ) VALUES (
      NEW.id,
      OLD.status,
      NEW.status,
      auth.uid(),
      COALESCE(user_tenant_id, NEW.tenant_id)
    );
    
    -- Update timestamps based on status
    IF NEW.status = 'in_progress' AND OLD.status != 'in_progress' THEN
      NEW.started_at = COALESCE(NEW.started_at, now());
    ELSIF NEW.status = 'completed' AND OLD.status != 'completed' THEN
      NEW.completed_at = COALESCE(NEW.completed_at, now());
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS work_order_status_change_trigger ON public.work_orders;
CREATE TRIGGER work_order_status_change_trigger
  BEFORE UPDATE ON public.work_orders
  FOR EACH ROW
  EXECUTE FUNCTION track_work_order_status_changes();

-- Create function to get work order with all relations
CREATE OR REPLACE FUNCTION get_work_order_with_relations(wo_id UUID)
RETURNS TABLE(
  work_order JSONB,
  assignments JSONB,
  procedures JSONB,
  parts_used JSONB,
  status_history JSONB,
  comments JSONB
) AS $$
DECLARE
  user_tenant_id UUID;
BEGIN
  -- Get user's tenant
  SELECT tenant_id INTO user_tenant_id FROM public.users WHERE id = auth.uid();
  
  RETURN QUERY
  SELECT 
    to_jsonb(wo.*) as work_order,
    COALESCE(json_agg(DISTINCT woa.*) FILTER (WHERE woa.id IS NOT NULL), '[]'::json)::jsonb as assignments,
    COALESCE(json_agg(DISTINCT wop.*) FILTER (WHERE wop.id IS NOT NULL), '[]'::json)::jsonb as procedures,
    COALESCE(json_agg(DISTINCT wopu.*) FILTER (WHERE wopu.id IS NOT NULL), '[]'::json)::jsonb as parts_used,
    COALESCE(json_agg(DISTINCT wosh.*) FILTER (WHERE wosh.id IS NOT NULL), '[]'::json)::jsonb as status_history,
    COALESCE(json_agg(DISTINCT woc.*) FILTER (WHERE woc.id IS NOT NULL), '[]'::json)::jsonb as comments
  FROM public.work_orders wo
  LEFT JOIN public.work_order_assignments woa ON wo.id = woa.work_order_id
  LEFT JOIN public.work_order_procedures wop ON wo.id = wop.work_order_id
  LEFT JOIN public.work_order_parts_used wopu ON wo.id = wopu.work_order_id
  LEFT JOIN public.work_order_status_history wosh ON wo.id = wosh.work_order_id
  LEFT JOIN public.work_order_comments woc ON wo.id = woc.work_order_id
  WHERE wo.id = wo_id 
    AND wo.tenant_id = user_tenant_id
  GROUP BY wo.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;