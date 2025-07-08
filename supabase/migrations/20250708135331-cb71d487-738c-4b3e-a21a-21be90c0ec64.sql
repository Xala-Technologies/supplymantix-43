-- Fixed comprehensive migration - drop triggers first, then functions

-- Drop all existing triggers first
DROP TRIGGER IF EXISTS work_order_status_changes_trigger ON public.work_orders;
DROP TRIGGER IF EXISTS work_order_status_change_trigger ON public.work_orders;
DROP TRIGGER IF EXISTS notify_work_order_assignment_trigger ON public.work_orders;
DROP TRIGGER IF EXISTS notify_work_order_status_change_trigger ON public.work_orders;

-- Now drop the functions
DROP FUNCTION IF EXISTS public.track_work_order_status_changes() CASCADE;
DROP FUNCTION IF EXISTS public.notify_work_order_assignment() CASCADE;
DROP FUNCTION IF EXISTS public.notify_work_order_status_change() CASCADE;

-- Recreate the status tracking function with proper error handling
CREATE OR REPLACE FUNCTION public.track_work_order_status_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_tenant_id UUID;
BEGIN
  -- Get current user's tenant_id safely
  BEGIN
    SELECT tenant_id INTO user_tenant_id FROM public.users WHERE id = auth.uid();
  EXCEPTION
    WHEN OTHERS THEN
      user_tenant_id := NULL;
  END;
  
  -- Only track if status actually changed
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    -- Insert status history record
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
    IF NEW.status = 'in_progress' AND (OLD.status IS NULL OR OLD.status != 'in_progress') THEN
      NEW.started_at = COALESCE(NEW.started_at, now());
    ELSIF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
      NEW.completed_at = COALESCE(NEW.completed_at, now());
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Recreate just the essential trigger for now
CREATE TRIGGER work_order_status_changes_trigger
  BEFORE UPDATE ON public.work_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.track_work_order_status_changes();

-- Ensure the work_order_status_history table exists with proper structure
CREATE TABLE IF NOT EXISTS public.work_order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id UUID NOT NULL,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  tenant_id UUID NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on work_order_status_history
ALTER TABLE public.work_order_status_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for work_order_status_history if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'work_order_status_history' 
    AND policyname = 'Users can view status history for their tenant work orders'
  ) THEN
    CREATE POLICY "Users can view status history for their tenant work orders" ON public.work_order_status_history
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM public.work_orders wo 
          WHERE wo.id = work_order_status_history.work_order_id 
          AND wo.tenant_id = get_user_tenant_id()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'work_order_status_history' 
    AND policyname = 'Users can create status history for their tenant work orders'
  ) THEN
    CREATE POLICY "Users can create status history for their tenant work orders" ON public.work_order_status_history
      FOR INSERT WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.work_orders wo 
          WHERE wo.id = work_order_status_history.work_order_id 
          AND wo.tenant_id = get_user_tenant_id()
        )
      );
  END IF;
END $$;