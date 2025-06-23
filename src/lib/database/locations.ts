import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { LocationHierarchy, LocationStats, LocationBreadcrumb } from "@/types/location";

type Tables = Database["public"]["Tables"];
type LocationRow = Tables["locations"]["Row"];
type LocationInsert = Tables["locations"]["Insert"];
type LocationUpdate = Tables["locations"]["Update"];

// Simple interface to avoid deep type inference
interface SimpleNode {
  id: string;
  name: string;
  description: string | null;
  tenant_id: string;
  parent_id: string | null;
  location_code: string | null;
  location_type: string;
  address: string | null;
  coordinates: any | null;
  is_active: boolean;
  metadata: any;
  created_at: string;
  updated_at: string;
  children: SimpleNode[];
  level: number;
  path: string[];
}

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
    
    // Use simple object creation to avoid deep type inference
    if (!data || data.length === 0) return [];
    
    const result: any[] = [];
    const nodeMap = new Map<string, any>();
    
    // First pass - create all nodes with explicit simple structure
    for (const location of data) {
      const node = {
        id: location.id,
        name: location.name,
        description: location.description,
        tenant_id: location.tenant_id,
        parent_id: location.parent_id,
        location_code: location.location_code,
        location_type: location.location_type,
        address: location.address,
        coordinates: location.coordinates,
        is_active: location.is_active,
        metadata: location.metadata,
        created_at: location.created_at,
        updated_at: location.updated_at,
        children: [],
        level: 0,
        path: []
      };
      nodeMap.set(location.id, node);
    }
    
    // Second pass - build hierarchy
    for (const location of data) {
      const node = nodeMap.get(location.id);
      if (location.parent_id && nodeMap.has(location.parent_id)) {
        const parent = nodeMap.get(location.parent_id);
        node.level = parent.level + 1;
        const newPath = [];
        for (const pathItem of parent.path) {
          newPath.push(pathItem);
        }
        newPath.push(parent.name);
        node.path = newPath;
        parent.children.push(node);
      } else {
        result.push(node);
      }
    }
    
    return result as LocationHierarchy[];
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
    // Use explicit typing to avoid deep recursion
    const breadcrumbs: any[] = [];
    let currentId: string | null = locationId;
    let level = 0;
    
    while (currentId && level < 10) { // Prevent infinite loops
      const { data, error } = await supabase
        .from("locations")
        .select("id, name, parent_id")
        .eq("id", currentId)
        .single();
      
      if (error || !data) break;
      
      // Create breadcrumb object explicitly
      const crumb = {
        id: data.id,
        name: data.name,
        level: level
      };
      
      // Add to beginning of array manually
      breadcrumbs.splice(0, 0, crumb);
      
      currentId = data.parent_id;
      level++;
    }
    
    return breadcrumbs as LocationBreadcrumb[];
  },

  async getLocationStats(locationId: string): Promise<LocationStats> {
    // Simplify by using individual queries instead of Promise.all to avoid deep type inference
    const assetsResult = await supabase.from("assets").select("id", { count: 'exact' }).eq("location_id", locationId);
    const metersResult = await supabase.from("meters").select("id", { count: 'exact' }).eq("location_id", locationId);
    const workOrdersResult = await supabase.from("work_orders").select("id", { count: 'exact' }).eq("location_id", locationId);
    const childrenResult = await supabase.from("locations").select("id", { count: 'exact' }).eq("parent_id", locationId).eq("is_active", true);
    
    // Explicit return object
    const stats: LocationStats = {
      asset_count: assetsResult.count || 0,
      meter_count: metersResult.count || 0,
      work_order_count: workOrdersResult.count || 0,
      child_location_count: childrenResult.count || 0,
    };
    
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
    if (!locations || locations.length === 0) {
      return [];
    }

    // Use simple object without complex typing
    const nodesMap = new Map<string, any>();
    
    // Create all nodes first with explicit simple structure
    for (const loc of locations) {
      const simpleNode: SimpleNode = {
        id: loc.id,
        name: loc.name,
        description: loc.description,
        tenant_id: loc.tenant_id,
        parent_id: loc.parent_id,
        location_code: loc.location_code,
        location_type: loc.location_type,
        address: loc.address,
        coordinates: loc.coordinates,
        is_active: loc.is_active,
        metadata: loc.metadata,
        created_at: loc.created_at,
        updated_at: loc.updated_at,
        children: [],
        level: 0,
        path: []
      };
      nodesMap.set(loc.id, simpleNode);
    }
    
    // Build hierarchy with simple operations
    const rootNodes: SimpleNode[] = [];
    
    for (const loc of locations) {
      const node = nodesMap.get(loc.id);
      if (!node) continue;
      
      if (loc.parent_id) {
        const parent = nodesMap.get(loc.parent_id);
        if (parent) {
          node.level = parent.level + 1;
          // Simple path building
          const newPath: string[] = [];
          for (const pathItem of parent.path) {
            newPath.push(pathItem);
          }
          newPath.push(parent.name);
          node.path = newPath;
          parent.children.push(node);
        } else {
          rootNodes.push(node);
        }
      } else {
        rootNodes.push(node);
      }
    }
    
    // Convert to LocationHierarchy[] with explicit cast
    return rootNodes as LocationHierarchy[];
  },
};
