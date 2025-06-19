
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Tables = Database["public"]["Tables"];
type InventoryItem = Tables["inventory_items"]["Row"];
type InventoryItemInsert = Tables["inventory_items"]["Insert"];
type InventoryItemUpdate = Tables["inventory_items"]["Update"];

export interface InventoryItemWithStats extends InventoryItem {
  is_low_stock: boolean;
  needs_reorder: boolean;
  total_value: number;
}

export const inventoryEnhancedApi = {
  // Get all inventory items
  async getInventoryItemsWithStats(): Promise<InventoryItemWithStats[]> {
    console.log('Fetching inventory items...');
    
    const { data, error } = await supabase
      .from("inventory_items")
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

  // Search inventory with filters
  async searchInventory(params: {
    search?: string;
    location?: string;
    status?: 'low_stock' | 'in_stock' | 'out_of_stock';
    sortBy?: 'name' | 'quantity' | 'updated_at';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  } = {}): Promise<{ items: InventoryItemWithStats[]; total: number }> {
    console.log('Searching inventory with params:', params);
    
    let query = supabase
      .from("inventory_items")
      .select("*", { count: 'exact' });

    // Apply search filter
    if (params.search) {
      query = query.or(`name.ilike.%${params.search}%,sku.ilike.%${params.search}%,description.ilike.%${params.search}%`);
    }

    // Apply location filter
    if (params.location) {
      query = query.eq("location", params.location);
    }

    // Apply status filter
    if (params.status === 'out_of_stock') {
      query = query.eq("quantity", 0);
    } else if (params.status === 'low_stock') {
      query = query.not("quantity", "gt", "min_quantity");
    } else if (params.status === 'in_stock') {
      query = query.gt("quantity", 0);
    }

    // Apply sorting
    const sortBy = params.sortBy || 'name';
    const sortOrder = params.sortOrder || 'asc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    if (params.limit) {
      const start = params.offset || 0;
      const end = start + params.limit - 1;
      query = query.range(start, end);
    }

    const { data, error, count } = await query;
    
    if (error) {
      console.error('Search query error:', error);
      throw error;
    }
    
    const items = (data || []).map(item => ({
      ...item,
      is_low_stock: (item.quantity || 0) <= (item.min_quantity || 0),
      needs_reorder: (item.quantity || 0) <= (item.min_quantity || 0) * 1.5,
      total_value: (item.quantity || 0) * (item.unit_cost || 0),
    }));

    return {
      items,
      total: count || 0
    };
  },

  // Create new inventory item
  async createInventoryItem(item: Omit<InventoryItemInsert, 'id' | 'created_at' | 'updated_at'>): Promise<InventoryItem> {
    console.log('Creating inventory item:', item);
    
    const { data, error } = await supabase
      .from("inventory_items")
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

  // Update inventory item
  async updateInventoryItem(id: string, updates: InventoryItemUpdate): Promise<InventoryItem> {
    console.log('Updating inventory item:', id, updates);
    
    const { data, error } = await supabase
      .from("inventory_items")
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

  // Delete inventory item
  async deleteInventoryItem(id: string): Promise<void> {
    console.log('Deleting inventory item:', id);
    
    const { error } = await supabase
      .from("inventory_items")
      .delete()
      .eq("id", id);
    
    if (error) {
      console.error('Delete error:', error);
      throw error;
    }
    
    console.log('Deleted item:', id);
  },

  // Get low stock alerts
  async getLowStockAlerts() {
    const { data, error } = await supabase
      .from("inventory_items")
      .select("id, name, sku, quantity, min_quantity, location")
      .filter("quantity", "lte", "min_quantity");
    
    if (error) {
      console.error('Low stock query error:', error);
      throw error;
    }
    
    return (data || []).map(item => ({
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
  },

  // Stock operations
  async addStock(inventoryId: string, quantity: number, note?: string): Promise<void> {
    const { data: item, error: fetchError } = await supabase
      .from("inventory_items")
      .select("quantity")
      .eq("id", inventoryId)
      .single();
    
    if (fetchError) throw fetchError;
    
    const newQuantity = (item.quantity || 0) + quantity;
    
    const { error: updateError } = await supabase
      .from("inventory_items")
      .update({ 
        quantity: newQuantity,
        updated_at: new Date().toISOString()
      })
      .eq("id", inventoryId);
    
    if (updateError) throw updateError;
  },

  async removeStock(inventoryId: string, quantity: number, note?: string): Promise<void> {
    const { data: item, error: fetchError } = await supabase
      .from("inventory_items")
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
      .from("inventory_items")
      .update({ 
        quantity: newQuantity,
        updated_at: new Date().toISOString()
      })
      .eq("id", inventoryId);
    
    if (updateError) throw updateError;
  },

  async adjustStock(inventoryId: string, newQuantity: number, note?: string): Promise<void> {
    const { error } = await supabase
      .from("inventory_items")
      .update({ 
        quantity: Math.max(0, newQuantity),
        updated_at: new Date().toISOString()
      })
      .eq("id", inventoryId);
    
    if (error) throw error;
  }
};
