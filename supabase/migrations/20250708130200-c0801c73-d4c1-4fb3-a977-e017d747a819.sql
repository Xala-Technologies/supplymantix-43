
-- Create work order status history table
CREATE TABLE public.work_order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id UUID NOT NULL REFERENCES public.work_orders(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reason TEXT,
  tenant_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.work_order_status_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view status history in their tenant"
  ON public.work_order_status_history
  FOR SELECT
  USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can create status history in their tenant"
  ON public.work_order_status_history
  FOR INSERT
  WITH CHECK (tenant_id = get_user_tenant_id());

-- Create work order assignments table for better assignment tracking
CREATE TABLE public.work_order_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id UUID NOT NULL REFERENCES public.work_orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'assigned',
  tenant_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.work_order_assignments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view assignments in their tenant"
  ON public.work_order_assignments
  FOR SELECT
  USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can manage assignments in their tenant"
  ON public.work_order_assignments
  FOR ALL
  USING (tenant_id = get_user_tenant_id());

-- Create work order parts used table for parts integration
CREATE TABLE public.work_order_parts_used (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id UUID NOT NULL REFERENCES public.work_orders(id) ON DELETE CASCADE,
  inventory_item_id UUID NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  cost_per_unit NUMERIC(10,2),
  total_cost NUMERIC(10,2),
  used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  used_by UUID REFERENCES auth.users(id),
  notes TEXT,
  tenant_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.work_order_parts_used ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view parts used in their tenant"
  ON public.work_order_parts_used
  FOR SELECT
  USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can manage parts used in their tenant"
  ON public.work_order_parts_used
  FOR ALL
  USING (tenant_id = get_user_tenant_id());

-- Create function to track work order status changes
CREATE OR REPLACE FUNCTION public.track_work_order_status_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Create trigger for status tracking
DROP TRIGGER IF EXISTS track_work_orders_status_changes ON public.work_orders;
CREATE TRIGGER track_work_orders_status_changes
  BEFORE UPDATE ON public.work_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.track_work_order_status_changes();

-- Create function to get work order with all relations
CREATE OR REPLACE FUNCTION public.get_work_order_with_relations(wo_id UUID)
RETURNS TABLE(
  work_order JSONB,
  assignments JSONB,
  procedures JSONB,
  parts_used JSONB,
  status_history JSONB,
  comments JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Add indexes for better performance
CREATE INDEX idx_work_order_status_history_work_order_id ON public.work_order_status_history(work_order_id);
CREATE INDEX idx_work_order_status_history_tenant_id ON public.work_order_status_history(tenant_id);
CREATE INDEX idx_work_order_assignments_work_order_id ON public.work_order_assignments(work_order_id); 
CREATE INDEX idx_work_order_assignments_user_id ON public.work_order_assignments(user_id);
CREATE INDEX idx_work_order_parts_used_work_order_id ON public.work_order_parts_used(work_order_id);

-- Add updated_at triggers
CREATE TRIGGER update_work_order_assignments_updated_at
  BEFORE UPDATE ON public.work_order_assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
