-- Function to create work order notifications
CREATE OR REPLACE FUNCTION public.create_work_order_notification(
  target_user_id UUID,
  notification_type TEXT,
  notification_title TEXT,
  notification_message TEXT,
  notification_data JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_tenant_id UUID;
  notification_id UUID;
BEGIN
  -- Get user's tenant_id
  SELECT tenant_id INTO user_tenant_id 
  FROM public.users 
  WHERE id = target_user_id;
  
  IF user_tenant_id IS NULL THEN
    RAISE EXCEPTION 'User tenant not found';
  END IF;
  
  -- Create notification
  INSERT INTO public.notifications (
    user_id,
    tenant_id,
    type,
    title,
    message,
    data,
    expires_at
  )
  VALUES (
    target_user_id,
    user_tenant_id,
    notification_type,
    notification_title,
    notification_message,
    notification_data,
    now() + INTERVAL '30 days'
  )
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Trigger function for work order assignment notifications
CREATE OR REPLACE FUNCTION public.notify_work_order_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  assigned_user_id UUID;
  wo_title TEXT;
BEGIN
  -- Get work order title
  SELECT title INTO wo_title FROM public.work_orders WHERE id = NEW.id;
  
  -- Notify each assigned user
  IF NEW.assigned_to IS NOT NULL AND array_length(NEW.assigned_to, 1) > 0 THEN
    FOREACH assigned_user_id IN ARRAY NEW.assigned_to
    LOOP
      -- Only notify if this is a new assignment (not on update)
      IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND (OLD.assigned_to IS NULL OR NOT assigned_user_id = ANY(COALESCE(OLD.assigned_to, '{}')))) THEN
        PERFORM public.create_work_order_notification(
          assigned_user_id,
          'work_order_assigned',
          'New Work Order Assignment',
          'You have been assigned to work order: ' || wo_title,
          jsonb_build_object(
            'work_order_id', NEW.id,
            'work_order_title', wo_title,
            'priority', NEW.priority,
            'due_date', NEW.due_date
          )
        );
      END IF;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger function for work order status change notifications
CREATE OR REPLACE FUNCTION public.notify_work_order_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  wo_title TEXT;
  creator_user_id UUID;
BEGIN
  -- Only proceed if status actually changed
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    SELECT title, created_by INTO wo_title, creator_user_id 
    FROM public.work_orders 
    WHERE id = NEW.id;
    
    -- Notify the creator about status changes
    IF creator_user_id IS NOT NULL AND creator_user_id != auth.uid() THEN
      PERFORM public.create_work_order_notification(
        creator_user_id,
        'work_order_status_changed',
        'Work Order Status Updated',
        'Work order "' || wo_title || '" status changed from ' || 
        COALESCE(OLD.status, 'none') || ' to ' || NEW.status,
        jsonb_build_object(
          'work_order_id', NEW.id,
          'work_order_title', wo_title,
          'old_status', OLD.status,
          'new_status', NEW.status,
          'changed_by', auth.uid()
        )
      );
    END IF;
    
    -- Also notify assigned users about completion
    IF NEW.status = 'completed' AND NEW.assigned_to IS NOT NULL THEN
      DECLARE
        assigned_user_id UUID;
      BEGIN
        FOREACH assigned_user_id IN ARRAY NEW.assigned_to
        LOOP
          IF assigned_user_id != auth.uid() THEN
            PERFORM public.create_work_order_notification(
              assigned_user_id,
              'work_order_completed',
              'Work Order Completed',
              'Work order "' || wo_title || '" has been marked as completed',
              jsonb_build_object(
                'work_order_id', NEW.id,
                'work_order_title', wo_title,
                'completed_by', auth.uid()
              )
            );
          END IF;
        END LOOP;
      END;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS work_order_assignment_notification ON public.work_orders;
DROP TRIGGER IF EXISTS work_order_status_notification ON public.work_orders;

-- Create triggers
CREATE TRIGGER work_order_assignment_notification
  AFTER INSERT OR UPDATE ON public.work_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_work_order_assignment();

CREATE TRIGGER work_order_status_notification
  AFTER UPDATE ON public.work_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_work_order_status_change();