import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface RecurrencePattern {
  rule: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: string;
}

export interface WorkOrderRecurrence {
  id: string;
  work_order_id: string;
  recurrence_pattern: any; // JSON from database
  last_generated_at?: string;
  next_due_at: string;
  total_generated: number;
  is_active: boolean;
  created_at: string;
}

export const useWorkOrderRecurrence = () => {
  const [loading, setLoading] = useState(false);

  const createRecurrence = useCallback(async (
    workOrderId: string, 
    pattern: RecurrencePattern,
    firstDueDate: string
  ): Promise<WorkOrderRecurrence | null> => {
    setLoading(true);
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('tenant_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!userData) throw new Error('User tenant not found');

      const { data, error } = await supabase
        .from('work_order_recurrences')
        .insert({
          work_order_id: workOrderId,
          tenant_id: userData.tenant_id,
          recurrence_pattern: pattern as any,
          next_due_at: firstDueDate,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      // Update the original work order to mark it as recurring
      await supabase
        .from('work_orders')
        .update({
          is_recurring: true,
          recurrence_rule: pattern.rule,
          recurrence_interval: pattern.interval,
          recurrence_end_date: pattern.endDate || null,
          next_occurrence: firstDueDate
        })
        .eq('id', workOrderId);

      toast.success('Recurrence schedule created successfully');
      return data;
    } catch (error) {
      console.error('Error creating recurrence:', error);
      toast.error('Failed to create recurrence schedule');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRecurrence = useCallback(async (
    recurrenceId: string,
    pattern: RecurrencePattern
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('work_order_recurrences')
        .update({
          recurrence_pattern: pattern as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', recurrenceId);

      if (error) throw error;

      toast.success('Recurrence schedule updated');
      return true;
    } catch (error) {
      console.error('Error updating recurrence:', error);
      toast.error('Failed to update recurrence schedule');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRecurrence = useCallback(async (recurrenceId: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('work_order_recurrences')
        .update({ is_active: false })
        .eq('id', recurrenceId);

      if (error) throw error;

      toast.success('Recurrence schedule disabled');
      return true;
    } catch (error) {
      console.error('Error disabling recurrence:', error);
      toast.error('Failed to disable recurrence schedule');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateNextWorkOrder = useCallback(async (recurrenceId: string): Promise<string | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('generate_recurring_work_order', {
        recurrence_id: recurrenceId
      });

      if (error) throw error;

      toast.success('Next work order generated successfully');
      return data;
    } catch (error) {
      console.error('Error generating work order:', error);
      toast.error('Failed to generate next work order');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRecurrencesByWorkOrder = useCallback(async (workOrderId: string): Promise<WorkOrderRecurrence[]> => {
    try {
      const { data, error } = await supabase
        .from('work_order_recurrences')
        .select('*')
        .eq('work_order_id', workOrderId)
        .eq('is_active', true);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching recurrences:', error);
      return [];
    }
  }, []);

  const getDueRecurrences = useCallback(async (): Promise<WorkOrderRecurrence[]> => {
    try {
      const { data, error } = await supabase
        .from('work_order_recurrences')
        .select('*')
        .eq('is_active', true)
        .lte('next_due_at', new Date().toISOString())
        .order('next_due_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching due recurrences:', error);
      return [];
    }
  }, []);

  return {
    loading,
    createRecurrence,
    updateRecurrence,
    deleteRecurrence,
    generateNextWorkOrder,
    getRecurrencesByWorkOrder,
    getDueRecurrences
  };
};