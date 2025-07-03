import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Tables = Database["public"]["Tables"];
type InventoryItem = Tables["parts_items"]["Row"];
type InventoryItemInsert = Tables["parts_items"]["Insert"];
type InventoryItemUpdate = Tables["parts_items"]["Update"];

export interface InventoryItemWithStats extends InventoryItem {
  is_low_stock: boolean;
  needs_reorder: boolean;
  total_value: number;
}

export interface SearchParams {
  search?: string;
  location?: string;
  status?: 'low_stock' | 'in_stock' | 'out_of_stock';
  sortBy?: 'name' | 'quantity' | 'updated_at';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface LowStockAlert {
  id: string;
  item_name: string;
  sku: string;
  current_quantity: number;
  min_quantity: number;
  reorder_level: number;
  alert_type: 'out_of_stock' | 'low_stock';
  location: string;
  category: string;
}

export const inventoryEnhancedApi = {
  async getInventoryItemsWithStats(): Promise<InventoryItemWithStats[]> {
    console.log('Fetching inventory items...');
    
    const { data, error } = await supabase
      .from("parts_items")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error('Inventory query error:', error);
      throw error;
    }
    
    console.log('Raw inventory data:', data);
    
    const items = (data || []).map(item => ({
      ...item,
      is_low_stock: (item.quantity || 0) <= (item.min_quantity || 0),
      needs_reorder: (item.quantity || 0) <= (item.min_quantity || 0) * 1.5,
      total_value: (item.quantity || 0) * (item.unit_cost || 0),
    }));
    
    console.log('Processed inventory items:', items);
    return items;
  },

  async searchInventory(params: SearchParams = {}): Promise<{ items: InventoryItemWithStats[]; total: number }> {
    console.log('Searching inventory with params:', params);
    
    let query = supabase
      .from("parts_items")
      .select("*", { count: 'exact' });

    // Apply search filter
    if (params.search && params.search.trim()) {
      const searchTerm = params.search.trim();
      console.log('Applying search filter:', searchTerm);
      query = query.or(`name.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }

    // Apply location filter
    if (params.location && params.location !== 'all') {
      console.log('Applying location filter:', params.location);
      query = query.eq("location", params.location);
    }

    // Apply sorting
    const sortBy = params.sortBy || 'name';
    const sortOrder = params.sortOrder || 'asc';
    console.log('Applying sort:', sortBy, sortOrder);
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    if (params.limit) {
      const start = params.offset || 0;
      const end = start + params.limit - 1;
      console.log('Applying pagination:', start, 'to', end);
      query = query.range(start, end);
    }

    console.log('Executing query...');
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Search query error:', error);
      throw error;
    }
    
    console.log('Search query results - data:', data, 'count:', count);
    
    const items = (data || []).map(item => ({
      ...item,
      is_low_stock: (item.quantity || 0) <= (item.min_quantity || 0),
      needs_reorder: (item.quantity || 0) <= (item.min_quantity || 0) * 1.5,
      total_value: (item.quantity || 0) * (item.unit_cost || 0),
    }));

    // Apply status filter after processing
    let filteredItems = items;
    if (params.status) {
      console.log('Applying status filter:', params.status);
      if (params.status === 'out_of_stock') {
        filteredItems = items.filter(item => item.quantity === 0);
      } else if (params.status === 'low_stock') {
        filteredItems = items.filter(item => item.is_low_stock && item.quantity > 0);
      } else if (params.status === 'in_stock') {
        filteredItems = items.filter(item => item.quantity > 0 && !item.is_low_stock);
      }
    }

    console.log('Final filtered search results:', filteredItems);

    return {
      items: filteredItems,
      total: params.status ? filteredItems.length : (count || 0)
    };
  },

  async createInventoryItem(item: Omit<InventoryItemInsert, 'id' | 'created_at' | 'updated_at'>): Promise<InventoryItem> {
    console.log('Creating inventory item:', item);
    
    const { data, error } = await supabase
      .from("parts_items")
      .insert(item)
      .select()
      .single();
    
    if (error) {
      console.error('Insert error:', error);
      throw error;
    }
    
    console.log('Created item:', data);
    return data;
  },

  async updateInventoryItem(id: string, updates: InventoryItemUpdate): Promise<InventoryItem> {
    console.log('Updating inventory item:', id, updates);
    
    const { data, error } = await supabase
      .from("parts_items")
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();
    
    if (error) {
      console.error('Update error:', error);
      throw error;
    }
    
    console.log('Updated item:', data);
    return data;
  },

  async deleteInventoryItem(id: string): Promise<void> {
    console.log('Deleting inventory item:', id);
    
    const { error } = await supabase
      .from("parts_items")
      .delete()
      .eq("id", id);
    
    if (error) {
      console.error('Delete error:', error);
      throw error;
    }
    
    console.log('Deleted item:', id);
  },

  async getLowStockAlerts(): Promise<LowStockAlert[]> {
    console.log('Fetching low stock alerts...');
    
    const { data, error } = await supabase
      .from("parts_items")
      .select("id, name, sku, quantity, min_quantity, location")
      .not("min_quantity", "is", null)
      .gt("min_quantity", 0)
      .filter("quantity", "lte", "min_quantity");
    
    if (error) {
      console.error('Low stock query error:', error);
      throw error;
    }
    
    console.log('Low stock alerts raw data:', data);
    
    const alerts = (data || []).map(item => ({
      id: item.id,
      item_name: item.name,
      sku: item.sku || '',
      current_quantity: item.quantity || 0,
      min_quantity: item.min_quantity || 0,
      reorder_level: item.min_quantity || 0,
      alert_type: item.quantity === 0 ? 'out_of_stock' as const : 'low_stock' as const,
      location: item.location || '',
      category: ''
    }));
    
    console.log('Processed low stock alerts:', alerts);
    return alerts;
  },

  async addStock(inventoryId: string, quantity: number, note?: string): Promise<void> {
    console.log('Adding stock:', inventoryId, quantity, note);
    
    const { data: item, error: fetchError } = await supabase
      .from("parts_items")
      .select("quantity")
      .eq("id", inventoryId)
      .single();
    
    if (fetchError) throw fetchError;
    
    const newQuantity = (item.quantity || 0) + quantity;
    
    const { error: updateError } = await supabase
      .from("parts_items")
      .update({ 
        quantity: newQuantity,
        updated_at: new Date().toISOString()
      })
      .eq("id", inventoryId);
    
    if (updateError) throw updateError;
  },

  async removeStock(inventoryId: string, quantity: number, note?: string): Promise<void> {
    console.log('Removing stock:', inventoryId, quantity, note);
    
    const { data: item, error: fetchError } = await supabase
      .from("parts_items")
      .select("quantity")
      .eq("id", inventoryId)
      .single();
    
    if (fetchError) throw fetchError;
    
    const currentQuantity = item.quantity || 0;
    if (currentQuantity < quantity) {
      throw new Error('Insufficient inventory quantity');
    }
    
    const newQuantity = Math.max(0, currentQuantity - quantity);
    
    const { error: updateError } = await supabase
      .from("parts_items")
      .update({ 
        quantity: newQuantity,
        updated_at: new Date().toISOString()
      })
      .eq("id", inventoryId);
    
    if (updateError) throw updateError;
  },

  async adjustStock(inventoryId: string, newQuantity: number, note?: string): Promise<void> {
    console.log('Adjusting stock:', inventoryId, newQuantity, note);
    
    const { error } = await supabase
      .from("parts_items")
      .update({ 
        quantity: Math.max(0, newQuantity),
        updated_at: new Date().toISOString()
      })
      .eq("id", inventoryId);
    
    if (error) throw error;
  }
};
