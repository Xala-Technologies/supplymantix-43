
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { LocationHierarchy, LocationStats, LocationBreadcrumb } from "@/types/location";

type Tables = Database["public"]["Tables"];

export const locationsApi = {
  async getLocations() {
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async getLocationHierarchy(): Promise<LocationHierarchy[]> {
    const { data, error } = await supabase
      .rpc('get_location_hierarchy');
    
    if (error) throw error;
    return this.buildLocationTree(data || []);
  },

  async getLocationChildren(parentId: string) {
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .eq("parent_id", parentId)
      .eq("is_active", true)
      .order("name", { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async getLocationBreadcrumbs(locationId: string): Promise<LocationBreadcrumb[]> {
    const { data, error } = await supabase
      .rpc('get_location_breadcrumbs', { location_id: locationId });
    
    if (error) throw error;
    return data || [];
  },

  async getLocationStats(locationId: string): Promise<LocationStats> {
    const { data, error } = await supabase
      .rpc('get_location_stats', { location_id: locationId });
    
    if (error) throw error;
    
    const stats = data?.[0];
    return {
      asset_count: Number(stats?.asset_count || 0),
      meter_count: Number(stats?.meter_count || 0),
      work_order_count: Number(stats?.work_order_count || 0),
      child_location_count: Number(stats?.child_location_count || 0),
    };
  },

  async searchLocations(query: string) {
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,location_code.ilike.%${query}%`)
      .eq("is_active", true)
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
    // Soft delete
    const { error } = await supabase
      .from("locations")
      .update({ is_active: false })
      .eq("id", id);
    
    if (error) throw error;
  },

  async moveLocation(locationId: string, newParentId: string | null) {
    // Validate that we're not creating a circular reference
    if (newParentId) {
      const breadcrumbs = await this.getLocationBreadcrumbs(newParentId);
      const wouldCreateCycle = breadcrumbs.some(b => b.id === locationId);
      
      if (wouldCreateCycle) {
        throw new Error("Cannot move location: would create circular reference");
      }
    }

    const { data, error } = await supabase
      .from("locations")
      .update({ parent_id: newParentId })
      .eq("id", locationId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  buildLocationTree(locations: any[]): LocationHierarchy[] {
    const locationMap = new Map();
    const rootLocations: LocationHierarchy[] = [];

    // Create a map for quick lookup
    locations.forEach(location => {
      locationMap.set(location.id, { ...location, children: [] });
    });

    // Build the tree structure
    locations.forEach(location => {
      const locationNode = locationMap.get(location.id);
      
      if (location.parent_id && locationMap.has(location.parent_id)) {
        const parent = locationMap.get(location.parent_id);
        parent.children.push(locationNode);
      } else {
        rootLocations.push(locationNode);
      }
    });

    return rootLocations;
  },
};
