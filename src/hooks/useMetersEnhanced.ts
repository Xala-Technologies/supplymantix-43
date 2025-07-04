import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MeterReading {
  id: string;
  meter_id: string;
  value: number;
  recorded_at: string;
  recorded_by?: string;
  notes?: string;
  attachments?: any[];
  created_at: string;
}

export interface MeterTrigger {
  id: string;
  meter_id: string;
  name: string;
  description?: string;
  trigger_condition: 'above' | 'below' | 'equals';
  trigger_value: number;
  action_type: 'create_work_order' | 'send_notification' | 'change_asset_status';
  action_config: any;
  is_active: boolean;
  throttle_hours: number;
  last_fired_at?: string;
  created_at: string;
  updated_at: string;
}

export interface MeterAttachment {
  id: string;
  meter_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  uploaded_by?: string;
  created_at: string;
}

// Enhanced meter detail query
export const useMeterDetail = (meterId: string) => {
  return useQuery({
    queryKey: ["meter-detail", meterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("meters")
        .select(`
          *,
          assets(id, name, location, asset_tag),
          meter_readings(*, recorded_by),
          meter_triggers(*),
          meter_attachments(*)
        `)
        .eq("id", meterId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!meterId,
  });
};

// Meter readings query
export const useMeterReadings = (meterId: string) => {
  return useQuery({
    queryKey: ["meter-readings", meterId],
    queryFn: async (): Promise<MeterReading[]> => {
      const { data, error } = await supabase
        .from("meter_readings")
        .select("*")
        .eq("meter_id", meterId)
        .order("recorded_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!meterId,
  });
};

// Create meter reading
export const useCreateMeterReading = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reading: Omit<MeterReading, 'id' | 'created_at'>) => {
      const { data: userData } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("meter_readings")
        .insert({
          ...reading,
          recorded_by: userData.user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["meter-readings"] });
      queryClient.invalidateQueries({ queryKey: ["meter-detail"] });
      queryClient.invalidateQueries({ queryKey: ["meters"] });
      toast.success("Meter reading recorded successfully");
    },
    onError: (error) => {
      console.error("Error creating meter reading:", error);
      toast.error("Failed to record meter reading");
    },
  });
};

// Meter triggers query
export const useMeterTriggers = (meterId: string) => {
  return useQuery({
    queryKey: ["meter-triggers", meterId],
    queryFn: async (): Promise<MeterTrigger[]> => {
      const { data, error } = await supabase
        .from("meter_triggers")
        .select("*")
        .eq("meter_id", meterId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as MeterTrigger[];
    },
    enabled: !!meterId,
  });
};

// Create meter trigger
export const useCreateMeterTrigger = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (trigger: Omit<MeterTrigger, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from("meter_triggers")
        .insert(trigger)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meter-triggers"] });
      queryClient.invalidateQueries({ queryKey: ["meter-detail"] });
      toast.success("Meter trigger created successfully");
    },
    onError: (error) => {
      console.error("Error creating meter trigger:", error);
      toast.error("Failed to create meter trigger");
    },
  });
};

// Update meter trigger
export const useUpdateMeterTrigger = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<MeterTrigger> }) => {
      const { data, error } = await supabase
        .from("meter_triggers")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meter-triggers"] });
      queryClient.invalidateQueries({ queryKey: ["meter-detail"] });
      toast.success("Meter trigger updated successfully");
    },
    onError: (error) => {
      console.error("Error updating meter trigger:", error);
      toast.error("Failed to update meter trigger");
    },
  });
};

// Delete meter trigger
export const useDeleteMeterTrigger = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("meter_triggers")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meter-triggers"] });
      queryClient.invalidateQueries({ queryKey: ["meter-detail"] });
      toast.success("Meter trigger deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting meter trigger:", error);
      toast.error("Failed to delete meter trigger");
    },
  });
};

// Create meter
export const useCreateMeter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (meter: any) => {
      const { data: userData } = await supabase.auth.getUser();
      
      const { data: userTenant } = await supabase
        .from("users")
        .select("tenant_id")
        .eq("id", userData.user?.id)
        .single();

      const { data, error } = await supabase
        .from("meters")
        .insert({
          ...meter,
          tenant_id: userTenant?.tenant_id,
          created_by: userData.user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meters"] });
      toast.success("Meter created successfully");
    },
    onError: (error) => {
      console.error("Error creating meter:", error);
      toast.error("Failed to create meter");
    },
  });
};

// Update meter
export const useUpdateMeter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from("meters")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meters"] });
      queryClient.invalidateQueries({ queryKey: ["meter-detail"] });
      toast.success("Meter updated successfully");
    },
    onError: (error) => {
      console.error("Error updating meter:", error);
      toast.error("Failed to update meter");
    },
  });
};

// Delete meter
export const useDeleteMeter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("meters")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meters"] });
      toast.success("Meter deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting meter:", error);
      toast.error("Failed to delete meter");
    },
  });
};

// Create work order from meter
export const useCreateMeterWorkOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ meterId, title, description, dueDate }: {
      meterId: string;
      title: string;
      description?: string;
      dueDate?: string;
    }) => {
      const { data: userData } = await supabase.auth.getUser();
      
      const { data: userTenant } = await supabase
        .from("users")
        .select("tenant_id")
        .eq("id", userData.user?.id)
        .single();

      // Create work order
      const { data: workOrder, error: woError } = await supabase
        .from("work_orders")
        .insert({
          title,
          description,
          due_date: dueDate,
          status: 'open',
          priority: 'medium',
          tenant_id: userTenant?.tenant_id,
          created_by: userData.user?.id,
        })
        .select()
        .single();

      if (woError) throw woError;

      // Link meter to work order
      const { error: linkError } = await supabase
        .from("work_order_meter_readings")
        .insert({
          work_order_id: workOrder.id,
          meter_id: meterId,
          reading_required: true,
        });

      if (linkError) throw linkError;

      return workOrder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-orders"] });
      toast.success("Meter work order created successfully");
    },
    onError: (error) => {
      console.error("Error creating meter work order:", error);
      toast.error("Failed to create meter work order");
    },
  });
};