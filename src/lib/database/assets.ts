import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Tables = Database["public"]["Tables"];
type AssetInsert = Tables["assets"]["Insert"];
type AssetUpdate = Tables["assets"]["Update"];
type Asset = Tables["assets"]["Row"];

export const assetsApi = {
  async getAssets(filters?: {
    search?: string;
    status?: string[];
    category?: string[];
    location?: string[];
    criticality?: string[];
  }) {
    console.log('Fetching assets with filters:', filters);
    
    let query = supabase
      .from("assets")
      .select("*")
      .order("created_at", { ascending: false });

    // Apply filters if provided
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,asset_tag.ilike.%${filters.search}%`);
    }
    
    if (filters?.status && filters.status.length > 0) {
      query = query.in("status", filters.status as ("active" | "maintenance" | "out_of_service" | "retired")[]);
    }
    
    if (filters?.category && filters.category.length > 0) {
      query = query.in("category", filters.category);
    }
    
    if (filters?.location && filters.location.length > 0) {
      query = query.in("location", filters.location);
    }
    
    if (filters?.criticality && filters.criticality.length > 0) {
      query = query.in("criticality", filters.criticality);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching assets:', error);
      throw error;
    }
    
    console.log('Fetched assets:', data);
    return data || [];
  },

  async getAsset(id: string) {
    const { data, error } = await supabase
      .from("assets")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      console.error('Error fetching asset:', error);
      throw error;
    }
    return data;
  },

  async updateAsset(id: string, updates: Omit<AssetUpdate, 'tenant_id'>) {
    const { data, error } = await supabase
      .from("assets")
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating asset:', error);
      throw error;
    }
    return data;
  },

  async deleteAsset(id: string) {
    const { error } = await supabase
      .from("assets")
      .delete()
      .eq("id", id);
    
    if (error) {
      console.error('Error deleting asset:', error);
      throw error;
    }
  },

  async getAssetsByLocation(location: string) {
    const { data, error } = await supabase
      .from("assets")
      .select("*")
      .eq("location", location)
      .order("name", { ascending: true });
    
    if (error) {
      console.error('Error fetching assets by location:', error);
      throw error;
    }
    return data || [];
  },

  async getAssetsByCategory(category: string) {
    const { data, error } = await supabase
      .from("assets")
      .select("*")
      .eq("category", category)
      .order("name", { ascending: true });
    
    if (error) {
      console.error('Error fetching assets by category:', error);
      throw error;
    }
    return data || [];
  },

  async getAssetStatistics() {
    const { data, error } = await supabase
      .from("assets")
      .select("status, category, criticality");
    
    if (error) {
      console.error('Error fetching asset statistics:', error);
      throw error;
    }
    
    // Calculate statistics
    const stats = {
      total: data?.length || 0,
      byStatus: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
      byCriticality: {} as Record<string, number>
    };
    
    data?.forEach(asset => {
      stats.byStatus[asset.status] = (stats.byStatus[asset.status] || 0) + 1;
      if (asset.category) {
        stats.byCategory[asset.category] = (stats.byCategory[asset.category] || 0) + 1;
      }
      if (asset.criticality) {
        stats.byCriticality[asset.criticality] = (stats.byCriticality[asset.criticality] || 0) + 1;
      }
    });
    
    return stats;
  },

  async createAsset(asset: Omit<AssetInsert, 'tenant_id'>) {
    console.log('Creating asset with data:', asset);
    
    const { data, error } = await supabase
      .from("assets")
      .insert(asset)
      .select()
      .single();
    
    if (error) {
      console.error('Database error creating asset:', error);
      throw error;
    }
    
    console.log('Asset created successfully:', data);
    return data;
  },

  async exportAssets(format: 'csv' | 'json' = 'csv') {
    const { data, error } = await supabase
      .from("assets")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error('Error exporting assets:', error);
      throw error;
    }

    if (format === 'json') {
      return JSON.stringify(data, null, 2);
    }

    // Convert to CSV
    if (!data || data.length === 0) {
      return 'No data to export';
    }

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(asset => 
      Object.values(asset).map(value => 
        typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value
      ).join(',')
    );
    
    return [headers, ...rows].join('\n');
  }
};

export type { Asset, AssetInsert, AssetUpdate };
