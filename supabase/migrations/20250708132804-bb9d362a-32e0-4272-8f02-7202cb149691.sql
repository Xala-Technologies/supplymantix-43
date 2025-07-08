-- Fix the work order status tracking trigger to handle the array_length issue
DROP TRIGGER IF EXISTS work_order_status_changes_trigger ON public.work_orders;

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

-- Recreate the trigger
CREATE TRIGGER work_order_status_changes_trigger
  BEFORE UPDATE ON public.work_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.track_work_order_status_changes();