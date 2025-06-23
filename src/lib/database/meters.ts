
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Tables = Database["public"]["Tables"];

export const metersApi = {
  async getMeters() {
    const { data, error } = await supabase
      .from("meters")
      .select(`
        *,
        assets(id, name, location),
        meter_readings(
          id,
          value,
          recorded_at,
          users(email, first_name, last_name)
        )
      `)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getMeter(id: string) {
    const { data, error } = await supabase
      .from("meters")
      .select(`
        *,
        assets(id, name, location, asset_tag),
        meter_readings(
          id,
          value,
          comment,
          recorded_at,
          users(email, first_name, last_name)
        ),
        meter_triggers(*)
      `)
      .eq("id", id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createMeter(meter: Tables["meters"]["Insert"]) {
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

  async updateMeter(id: string, updates: Tables["meters"]["Update"]) {
    const { data, error } = await supabase
      .from("meters")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteMeter(id: string) {
    const { error } = await supabase
      .from("meters")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  },

  async getMeterReadings(meterId: string) {
    const { data, error } = await supabase
      .from("meter_readings")
      .select(`
        *,
        users(email, first_name, last_name)
      `)
      .eq("meter_id", meterId)
      .order("recorded_at", { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createMeterReading(reading: Tables["meter_readings"]["Insert"]) {
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

  async getMeterTriggers(meterId: string) {
    const { data, error } = await supabase
      .from("meter_triggers")
      .select("*")
      .eq("meter_id", meterId)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createMeterTrigger(trigger: Tables["meter_triggers"]["Insert"]) {
    const { data, error } = await supabase
      .from("meter_triggers")
      .insert(trigger)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateMeterTrigger(id: string, updates: Tables["meter_triggers"]["Update"]) {
    const { data, error } = await supabase
      .from("meter_triggers")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteMeterTrigger(id: string) {
    const { error } = await supabase
      .from("meter_triggers")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  },
};
