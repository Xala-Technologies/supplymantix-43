import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Tables = Database["public"]["Tables"];

export const metersApi = {
  async getMeters() {
    console.log("API: Getting meters...");
    try {
      const { data, error } = await supabase
        .from("meters")
        .select(`
          *,
          assets(id, name, location)
        `)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Supabase error getting meters:", error);
        throw error;
      }
      
      console.log("API: Got meters successfully:", data?.length || 0);
      return data || [];
    } catch (error) {
      console.error("Error in getMeters:", error);
      throw error;
    }
  },

  async getMeter(id: string) {
    console.log("API: Getting meter:", id);
    try {
      const { data, error } = await supabase
        .from("meters")
        .select(`
          *,
          assets(id, name, location, asset_tag),
          meter_triggers(*),
          meter_readings(
            *,
            users(id, email, first_name, last_name)
          )
        `)
        .eq("id", id)
        .single();
      
      if (error) {
        console.error("Supabase error getting meter:", error);
        throw error;
      }
      
      console.log("API: Got meter successfully:", data);
      return data;
    } catch (error) {
      console.error("Error in getMeter:", error);
      throw error;
    }
  },

  async createMeter(meter: Tables["meters"]["Insert"]) {
    console.log("API: Creating meter:", meter);
    try {
      const { data: userData } = await supabase.auth.getUser();
      console.log("Current user:", userData.user?.id);
      
      const { data: userTenant } = await supabase
        .from("users")
        .select("tenant_id")
        .eq("id", userData.user?.id)
        .single();

      console.log("User tenant:", userTenant);

      const { data, error } = await supabase
        .from("meters")
        .insert({
          ...meter,
          tenant_id: userTenant?.tenant_id,
          created_by: userData.user?.id,
        })
        .select()
        .single();
      
      if (error) {
        console.error("Supabase error creating meter:", error);
        throw error;
      }
      
      console.log("API: Created meter successfully:", data);
      return data;
    } catch (error) {
      console.error("Error in createMeter:", error);
      throw error;
    }
  },

  async updateMeter(id: string, updates: Tables["meters"]["Update"]) {
    console.log("API: Updating meter:", id, updates);
    try {
      const { data, error } = await supabase
        .from("meters")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) {
        console.error("Supabase error updating meter:", error);
        throw error;
      }
      
      console.log("API: Updated meter successfully:", data);
      return data;
    } catch (error) {
      console.error("Error in updateMeter:", error);
      throw error;
    }
  },

  async deleteMeter(id: string) {
    console.log("API: Deleting meter:", id);
    try {
      const { error } = await supabase
        .from("meters")
        .delete()
        .eq("id", id);
      
      if (error) {
        console.error("Supabase error deleting meter:", error);
        throw error;
      }
      
      console.log("API: Deleted meter successfully");
    } catch (error) {
      console.error("Error in deleteMeter:", error);
      throw error;
    }
  },

  async getMeterReadings(meterId: string) {
    console.log("API: Getting meter readings for:", meterId);
    try {
      const { data, error } = await supabase
        .from("meter_readings")
        .select(`
          *,
          users(id, email, first_name, last_name)
        `)
        .eq("meter_id", meterId)
        .order("recorded_at", { ascending: false });
      
      if (error) {
        console.error("Supabase error getting meter readings:", error);
        throw error;
      }
      
      console.log("API: Got meter readings successfully:", data?.length || 0);
      return data || [];
    } catch (error) {
      console.error("Error in getMeterReadings:", error);
      throw error;
    }
  },

  async createMeterReading(reading: Tables["meter_readings"]["Insert"]) {
    console.log("API: Creating meter reading:", reading);
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("meter_readings")
        .insert({
          ...reading,
          recorded_by: userData.user?.id,
        })
        .select()
        .single();
      
      if (error) {
        console.error("Supabase error creating meter reading:", error);
        throw error;
      }
      
      console.log("API: Created meter reading successfully:", data);
      return data;
    } catch (error) {
      console.error("Error in createMeterReading:", error);
      throw error;
    }
  },

  async getMeterTriggers(meterId: string) {
    console.log("API: Getting meter triggers for:", meterId);
    try {
      const { data, error } = await supabase
        .from("meter_triggers")
        .select("*")
        .eq("meter_id", meterId)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Supabase error getting meter triggers:", error);
        throw error;
      }
      
      console.log("API: Got meter triggers successfully:", data?.length);
      return data;
    } catch (error) {
      console.error("Error in getMeterTriggers:", error);
      throw error;
    }
  },

  async createMeterTrigger(trigger: Tables["meter_triggers"]["Insert"]) {
    console.log("API: Creating meter trigger:", trigger);
    try {
      const { data, error } = await supabase
        .from("meter_triggers")
        .insert(trigger)
        .select()
        .single();
      
      if (error) {
        console.error("Supabase error creating meter trigger:", error);
        throw error;
      }
      
      console.log("API: Created meter trigger successfully:", data);
      return data;
    } catch (error) {
      console.error("Error in createMeterTrigger:", error);
      throw error;
    }
  },

  async updateMeterTrigger(id: string, updates: Tables["meter_triggers"]["Update"]) {
    console.log("API: Updating meter trigger:", id, updates);
    try {
      const { data, error } = await supabase
        .from("meter_triggers")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) {
        console.error("Supabase error updating meter trigger:", error);
        throw error;
      }
      
      console.log("API: Updated meter trigger successfully:", data);
      return data;
    } catch (error) {
      console.error("Error in updateMeterTrigger:", error);
      throw error;
    }
  },

  async deleteMeterTrigger(id: string) {
    console.log("API: Deleting meter trigger:", id);
    try {
      const { error } = await supabase
        .from("meter_triggers")
        .delete()
        .eq("id", id);
      
      if (error) {
        console.error("Supabase error deleting meter trigger:", error);
        throw error;
      }
      
      console.log("API: Deleted meter trigger successfully");
    } catch (error) {
      console.error("Error in deleteMeterTrigger:", error);
      throw error;
    }
  },
};
