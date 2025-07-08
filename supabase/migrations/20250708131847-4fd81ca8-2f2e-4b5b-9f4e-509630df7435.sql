-- Create work order assignments table for better assignment tracking (if not exists)
CREATE TABLE IF NOT EXISTS public.work_order_assignments (
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

-- Enable RLS (safe to run multiple times)
ALTER TABLE public.work_order_assignments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (with IF NOT EXISTS equivalent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'work_order_assignments' 
    AND policyname = 'Users can view assignments in their tenant'
  ) THEN
    CREATE POLICY "Users can view assignments in their tenant"
      ON public.work_order_assignments
      FOR SELECT
      USING (tenant_id = get_user_tenant_id());
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'work_order_assignments' 
    AND policyname = 'Users can manage assignments in their tenant'
  ) THEN
    CREATE POLICY "Users can manage assignments in their tenant"
      ON public.work_order_assignments
      FOR ALL
      USING (tenant_id = get_user_tenant_id());
  END IF;
END $$;

-- Create work order parts used table (if not exists)
CREATE TABLE IF NOT EXISTS public.work_order_parts_used (
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

-- Create RLS policies for parts used
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'work_order_parts_used' 
    AND policyname = 'Users can view parts used in their tenant'
  ) THEN
    CREATE POLICY "Users can view parts used in their tenant"
      ON public.work_order_parts_used
      FOR SELECT
      USING (tenant_id = get_user_tenant_id());
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'work_order_parts_used' 
    AND policyname = 'Users can manage parts used in their tenant'
  ) THEN
    CREATE POLICY "Users can manage parts used in their tenant"
      ON public.work_order_parts_used
      FOR ALL
      USING (tenant_id = get_user_tenant_id());
  END IF;
END $$;

-- Add indexes for better performance (if not exists)
CREATE INDEX IF NOT EXISTS idx_work_order_assignments_work_order_id ON public.work_order_assignments(work_order_id); 
CREATE INDEX IF NOT EXISTS idx_work_order_assignments_user_id ON public.work_order_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_work_order_parts_used_work_order_id ON public.work_order_parts_used(work_order_id);

-- Add updated_at triggers (drop first to avoid conflicts)
DROP TRIGGER IF EXISTS update_work_order_assignments_updated_at ON public.work_order_assignments;
CREATE TRIGGER update_work_order_assignments_updated_at
  BEFORE UPDATE ON public.work_order_assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();