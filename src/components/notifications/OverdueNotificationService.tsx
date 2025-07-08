import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const OverdueNotificationService: React.FC = () => {
  useEffect(() => {
    const checkOverdueWorkOrders = async () => {
      try {
        const { data: overdueWorkOrders, error } = await supabase
          .from('work_orders')
          .select('id, title, due_date, assigned_to, priority')
          .lt('due_date', new Date().toISOString())
          .in('status', ['open', 'in_progress']);

        if (error) throw error;

        // Create notifications for overdue work orders
        for (const workOrder of overdueWorkOrders || []) {
          if (workOrder.assigned_to && workOrder.assigned_to.length > 0) {
            for (const userId of workOrder.assigned_to) {
              await supabase.rpc('create_work_order_notification', {
                target_user_id: userId,
                notification_type: 'work_order_overdue',
                notification_title: 'Work Order Overdue',
                notification_message: `Work order "${workOrder.title}" is past its due date`,
                notification_data: {
                  work_order_id: workOrder.id,
                  work_order_title: workOrder.title,
                  due_date: workOrder.due_date,
                  priority: workOrder.priority
                }
              });
            }
          }

          // Skip tracking overdue notifications for now
          // await supabase
          //   .from('work_orders')
          //   .update({ overdue_notification_sent: new Date().toISOString() })
          //   .eq('id', workOrder.id);
        }
      } catch (error) {
        console.error('Error checking overdue work orders:', error);
      }
    };

    // Check immediately and then every hour
    checkOverdueWorkOrders();
    const interval = setInterval(checkOverdueWorkOrders, 60 * 60 * 1000); // 1 hour

    return () => clearInterval(interval);
  }, []);

  return null; // This is a service component with no UI
};