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
    
    if (!data || data.length === 0) return [];
    
    return locationsApi.buildLocationTree(data);
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
    const breadcrumbs: LocationBreadcrumb[] = [];
    let currentId: string | null = locationId;
    let level = 0;
    
    while (currentId && level < 10) {
      const { data, error } = await supabase
        .from("locations")
        .select("id, name, parent_id")
        .eq("id", currentId)
        .single();
      
      if (error || !data) break;
      
      const crumb: LocationBreadcrumb = {
        id: data.id,
        name: data.name,
        level: level
      };
      
      breadcrumbs.unshift(crumb);
      currentId = data.parent_id;
      level++;
    }
    
    return breadcrumbs;
  },

  async getLocationStats(locationId: string): Promise<LocationStats> {
    // Use a completely type-safe approach that avoids Supabase's complex type inference
    const stats: LocationStats = {
      asset_count: 0,
      meter_count: 0,
      work_order_count: 0,
      child_location_count: 0,
    };

    try {
      // Use Promise.all with explicit any types to bypass TypeScript inference
      const [assetsResult, metersResult, workOrdersResult, childrenResult] = await Promise.all([
        (supabase as any).from("assets").select("id", { count: 'exact', head: true }).eq("location_id", locationId),
        (supabase as any).from("meters").select("id", { count: 'exact', head: true }).eq("location_id", locationId),
        (supabase as any).from("work_orders").select("id", { count: 'exact', head: true }).eq("location_id", locationId),
        (supabase as any).from("locations").select("id", { count: 'exact', head: true }).eq("parent_id", locationId).eq("is_active", true)
      ]);

      stats.asset_count = assetsResult.count || 0;
      stats.meter_count = metersResult.count || 0;
      stats.work_order_count = workOrdersResult.count || 0;
      stats.child_location_count = childrenResult.count || 0;
    } catch (error) {
      console.error("Error getting location stats:", error);
    }
    
    return stats;
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
    const { error } = await supabase
      .from("locations")
      .update({ is_active: false })
      .eq("id", id);
    
    if (error) throw error;
  },

  async moveLocation(locationId: string, newParentId: string | null): Promise<LocationRow> {
    if (newParentId) {
      const breadcrumbs = await locationsApi.getLocationBreadcrumbs(newParentId);
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
    if (!locations || locations.length === 0) {
      return [];
    }

    const nodesMap = new Map<string, LocationHierarchy>();
    
    // Create all nodes first
    for (const loc of locations) {
      const node: LocationHierarchy = {
        ...loc,
        children: [],
        level: 0,
        path: []
      };
      nodesMap.set(loc.id, node);
    }
    
    // Build hierarchy
    const rootNodes: LocationHierarchy[] = [];
    
    for (const loc of locations) {
      const node = nodesMap.get(loc.id);
      if (!node) continue;
      
      if (loc.parent_id) {
        const parent = nodesMap.get(loc.parent_id);
        if (parent) {
          node.level = parent.level + 1;
          node.path = [...parent.path, parent.name];
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(node);
        } else {
          rootNodes.push(node);
        }
      } else {
        rootNodes.push(node);
      }
    }
    
    return rootNodes;
  },
};
