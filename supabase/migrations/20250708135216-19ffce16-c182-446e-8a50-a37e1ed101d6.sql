-- Comprehensive fix for work order functionality issues

-- First, drop all existing triggers related to work orders
DROP TRIGGER IF EXISTS work_order_status_changes_trigger ON public.work_orders;
DROP TRIGGER IF EXISTS notify_work_order_assignment_trigger ON public.work_orders;
DROP TRIGGER IF EXISTS notify_work_order_status_change_trigger ON public.work_orders;

-- Drop and recreate the track_work_order_status_changes function to ensure it's clean
DROP FUNCTION IF EXISTS public.track_work_order_status_changes();

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

-- Recreate the notification functions with proper error handling
CREATE OR REPLACE FUNCTION public.notify_work_order_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  assigned_user_id UUID;
  wo_title TEXT;
BEGIN
  -- Only proceed if we have a valid work order
  IF NEW.id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Get work order title
  SELECT title INTO wo_title FROM public.work_orders WHERE id = NEW.id;
  
  -- Only notify if assigned_to is a valid UUID and not an array
  IF NEW.assigned_to IS NOT NULL AND NEW.assigned_to ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' THEN
    BEGIN
      assigned_user_id := NEW.assigned_to::UUID;
      
      -- Only notify if this is a new assignment (not on update with same assignee)
      IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND (OLD.assigned_to IS NULL OR OLD.assigned_to != NEW.assigned_to)) THEN
        PERFORM public.create_work_order_notification(
          assigned_user_id,
          'work_order_assigned',
          'New Work Order Assignment',
          'You have been assigned to work order: ' || COALESCE(wo_title, 'Unknown'),
          jsonb_build_object(
            'work_order_id', NEW.id,
            'work_order_title', wo_title,
            'priority', NEW.priority,
            'due_date', NEW.due_date
          )
        );
      END IF;
    EXCEPTION
      WHEN invalid_text_representation THEN
        -- Skip notification if assigned_to is not a valid UUID
        NULL;
      WHEN OTHERS THEN
        -- Log error but don't fail the transaction
        NULL;
    END;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_work_order_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  wo_title TEXT;
  creator_user_id UUID;
  assigned_user_id UUID;
BEGIN
  -- Only proceed if status actually changed
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    SELECT title, created_by INTO wo_title, creator_user_id 
    FROM public.work_orders 
    WHERE id = NEW.id;
    
    -- Notify the creator about status changes
    IF creator_user_id IS NOT NULL AND creator_user_id != auth.uid() THEN
      BEGIN
        PERFORM public.create_work_order_notification(
          creator_user_id,
          'work_order_status_changed',
          'Work Order Status Updated',
          'Work order "' || COALESCE(wo_title, 'Unknown') || '" status changed from ' || 
          COALESCE(OLD.status, 'none') || ' to ' || NEW.status,
          jsonb_build_object(
            'work_order_id', NEW.id,
            'work_order_title', wo_title,
            'old_status', OLD.status,
            'new_status', NEW.status,
            'changed_by', auth.uid()
          )
        );
      EXCEPTION
        WHEN OTHERS THEN
          -- Log error but don't fail the transaction
          NULL;
      END;
    END IF;
    
    -- Also notify assigned user about completion
    IF NEW.status = 'completed' AND NEW.assigned_to IS NOT NULL THEN
      BEGIN
        IF NEW.assigned_to ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' THEN
          assigned_user_id := NEW.assigned_to::UUID;
          
          IF assigned_user_id != auth.uid() THEN
            PERFORM public.create_work_order_notification(
              assigned_user_id,
              'work_order_completed',
              'Work Order Completed',
              'Work order "' || COALESCE(wo_title, 'Unknown') || '" has been marked as completed',
              jsonb_build_object(
                'work_order_id', NEW.id,
                'work_order_title', wo_title,
                'completed_by', auth.uid()
              )
            );
          END IF;
        END IF;
      EXCEPTION
        WHEN invalid_text_representation THEN
          -- Skip notification if assigned_to is not a valid UUID
          NULL;
        WHEN OTHERS THEN
          -- Log error but don't fail the transaction
          NULL;
      END;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Recreate all triggers
CREATE TRIGGER work_order_status_changes_trigger
  BEFORE UPDATE ON public.work_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.track_work_order_status_changes();

CREATE TRIGGER notify_work_order_assignment_trigger
  AFTER INSERT OR UPDATE ON public.work_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_work_order_assignment();

CREATE TRIGGER notify_work_order_status_change_trigger
  AFTER UPDATE ON public.work_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_work_order_status_change();

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

-- Enable RLS on work_order_status_history if it doesn't exist
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