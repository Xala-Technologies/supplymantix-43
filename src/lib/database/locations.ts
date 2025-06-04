
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Tables = Database["public"]["Tables"];

export const locationsApi = {
  async getLocations() {
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .order("name", { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async createLocation(location: Tables["locations"]["Insert"]) {
    const { data, error } = await supabase
      .from("locations")
      .insert(location)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateLocation(id: string, updates: Tables["locations"]["Update"]) {
    const { data, error } = await supabase
      .from("locations")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteLocation(id: string) {
    const { error } = await supabase
      .from("locations")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  },
};
