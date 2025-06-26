
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Meters
export const useMeters = () => {
  return useQuery({
    queryKey: ["meters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("meters")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useCreateMeter = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (meterData: any) => {
      const { data, error } = await supabase
        .from("meters")
        .insert(meterData)
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
      toast.error("Failed to create meter: " + (error instanceof Error ? error.message : "Unknown error"));
    },
  });
};

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
      toast.success("Meter updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update meter: " + (error instanceof Error ? error.message : "Unknown error"));
    },
  });
};

export const useDeleteMeter = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("meters")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meters"] });
      toast.success("Meter deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete meter: " + (error instanceof Error ? error.message : "Unknown error"));
    },
  });
};

// Meter Readings
export const useCreateMeterReading = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (readingData: { meter_id: string; value: number; comment?: string | null }) => {
      const { data, error } = await supabase
        .from("meter_readings")
        .insert({
          ...readingData,
          recorded_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["meter-readings", data.meter_id] });
      queryClient.invalidateQueries({ queryKey: ["meters"] });
      toast.success("Reading recorded successfully");
    },
    onError: (error) => {
      toast.error("Failed to record reading: " + (error instanceof Error ? error.message : "Unknown error"));
    },
  });
};

// Meter Triggers
export const useMeterTriggers = (meterId: string) => {
  return useQuery({
    queryKey: ["meter-triggers", meterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("meter_triggers")
        .select("*")
        .eq("meter_id", meterId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!meterId,
  });
};

export const useCreateMeterTrigger = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (triggerData: any) => {
      const { data, error } = await supabase
        .from("meter_triggers")
        .insert(triggerData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["meter-triggers", data.meter_id] });
      toast.success("Trigger created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create trigger: " + (error instanceof Error ? error.message : "Unknown error"));
    },
  });
};

export const useUpdateMeterTrigger = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from("meter_triggers")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["meter-triggers", data.meter_id] });
      toast.success("Trigger updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update trigger: " + (error instanceof Error ? error.message : "Unknown error"));
    },
  });
};

export const useDeleteMeterTrigger = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data: trigger, error: fetchError } = await supabase
        .from("meter_triggers")
        .select("meter_id")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      const { error } = await supabase
        .from("meter_triggers")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      return { id, meter_id: trigger.meter_id };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["meter-triggers", data.meter_id] });
      toast.success("Trigger deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete trigger: " + (error instanceof Error ? error.message : "Unknown error"));
    },
  });
};
