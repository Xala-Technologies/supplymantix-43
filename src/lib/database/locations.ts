
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { LocationHierarchy, LocationStats, LocationBreadcrumb } from "@/types/location";

type Tables = Database["public"]["Tables"];
type LocationRow = Tables["locations"]["Row"];
type LocationInsert = Tables["locations"]["Insert"];
type LocationUpdate = Tables["locations"]["Update"];

export const locationsApi = {
  async getLocations(): Promise<LocationRow[]> {
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getLocationHierarchy(): Promise<LocationHierarchy[]> {
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });
    
    if (error) throw error;
    return this.buildLocationTree(data || []);
  },

  async getLocationChildren(parentId: string): Promise<LocationRow[]> {
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .eq("parent_id", parentId)
      .eq("is_active", true)
      .order("name", { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getLocationBreadcrumbs(locationId: string): Promise<LocationBreadcrumb[]> {
    // Simple breadcrumb implementation - get location and traverse up
    const breadcrumbs: LocationBreadcrumb[] = [];
    let currentId: string | null = locationId;
    let level = 0;
    
    while (currentId && level < 10) { // Prevent infinite loops
      const { data, error } = await supabase
        .from("locations")
        .select("id, name, parent_id")
        .eq("id", currentId)
        .single();
      
      if (error || !data) break;
      
      breadcrumbs.unshift({
        id: data.id,
        name: data.name,
        level: level
      });
      
      currentId = data.parent_id;
      level++;
    }
    
    return breadcrumbs;
  },

  async getLocationStats(locationId: string): Promise<LocationStats> {
    // Get stats by counting related records
    const [assetsResult, metersResult, workOrdersResult, childrenResult] = await Promise.all([
      supabase.from("assets").select("id", { count: 'exact' }).eq("location_id", locationId),
      supabase.from("meters").select("id", { count: 'exact' }).eq("location_id", locationId),
      supabase.from("work_orders").select("id", { count: 'exact' }).eq("location_id", locationId),
      supabase.from("locations").select("id", { count: 'exact' }).eq("parent_id", locationId).eq("is_active", true)
    ]);
    
    return {
      asset_count: assetsResult.count || 0,
      meter_count: metersResult.count || 0,
      work_order_count: workOrdersResult.count || 0,
      child_location_count: childrenResult.count || 0,
    };
  },

  async searchLocations(query: string): Promise<LocationRow[]> {
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,location_code.ilike.%${query}%`)
      .eq("is_active", true)
      .order("name", { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async createLocation(location: LocationInsert): Promise<LocationRow> {
    const { data, error } = await supabase
      .from("locations")
      .insert(location)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateLocation(id: string, updates: LocationUpdate): Promise<LocationRow> {
    const { data, error } = await supabase
      .from("locations")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteLocation(id: string): Promise<void> {
    // Soft delete
    const { error } = await supabase
      .from("locations")
      .update({ is_active: false })
      .eq("id", id);
    
    if (error) throw error;
  },

  async moveLocation(locationId: string, newParentId: string | null): Promise<LocationRow> {
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

  buildLocationTree(locations: LocationRow[]): LocationHierarchy[] {
    const locationMap = new Map<string, LocationHierarchy>();
    const rootLocations: LocationHierarchy[] = [];

    // Create a map for quick lookup and add hierarchy properties
    locations.forEach(location => {
      locationMap.set(location.id, { 
        ...location,
        children: [],
        level: 0,
        path: [location.name]
      } as LocationHierarchy);
    });

    // Build the tree structure
    locations.forEach(location => {
      const locationNode = locationMap.get(location.id);
      if (!locationNode) return;
      
      if (location.parent_id && locationMap.has(location.parent_id)) {
        const parent = locationMap.get(location.parent_id);
        if (parent) {
          locationNode.level = parent.level + 1;
          locationNode.path = [...parent.path, location.name];
          parent.children = parent.children || [];
          parent.children.push(locationNode);
        }
      } else {
        rootLocations.push(locationNode);
      }
    });

    return rootLocations;
  },
};
