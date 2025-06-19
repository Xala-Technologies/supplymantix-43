
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
  usage_history: InventoryLog[];
  location_name?: string;
  category_name?: string;
}

export interface InventoryLog {
  id: string;
  inventory_item_id: string;
  user_id: string;
  type: 'added' | 'removed' | 'transferred' | 'used' | 'adjusted';
  change_quantity: number;
  previous_quantity: number;
  new_quantity: number;
  work_order_id?: string;
  note?: string;
  created_at: string;
  user_name?: string;
}

export interface InventoryAlert {
  id: string;
  item_name: string;
  sku: string;
  current_quantity: number;
  min_quantity: number;
  reorder_level: number;
  alert_type: 'low_stock' | 'out_of_stock' | 'reorder_needed';
  location: string;
  category: string;
}

export interface StockMovement {
  inventory_item_id: string;
  change_quantity: number;
  type: 'added' | 'removed' | 'transferred' | 'used' | 'adjusted';
  note?: string;
  work_order_id?: string;
  from_location_id?: string;
  to_location_id?: string;
}

export const inventoryEnhancedApi = {
  // Get all inventory items with enhanced stats
  async getInventoryItemsWithStats(): Promise<InventoryItemWithStats[]> {
    console.log('Fetching inventory items...');
    
    try {
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
        usage_history: [],
        location_name: item.location
      }));
      
      console.log('Processed inventory items:', items);
      return items;
    } catch (error) {
      console.error('Error in getInventoryItemsWithStats:', error);
      throw error;
    }
  },

  // Get single item with detailed stats
  async getInventoryItemById(id: string): Promise<InventoryItemWithStats | null> {
    console.log('Fetching item by ID:', id);
    
    try {
      const { data, error } = await supabase
        .from("inventory_items")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      
      return {
        ...data,
        is_low_stock: (data.quantity || 0) <= (data.min_quantity || 0),
        needs_reorder: (data.quantity || 0) <= (data.min_quantity || 0) * 1.5,
        total_value: (data.quantity || 0) * (data.unit_cost || 0),
        usage_history: [],
        location_name: data.location
      };
    } catch (error) {
      console.error('Error in getInventoryItemById:', error);
      throw error;
    }
  },

  // Create new inventory item
  async createInventoryItem(item: Omit<InventoryItemInsert, 'id' | 'created_at' | 'updated_at'>): Promise<InventoryItem> {
    console.log('Creating inventory item:', item);
    
    try {
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
    } catch (error) {
      console.error('Error in createInventoryItem:', error);
      throw error;
    }
  },

  // Update inventory item
  async updateInventoryItem(id: string, updates: InventoryItemUpdate): Promise<InventoryItem> {
    console.log('Updating inventory item:', id, updates);
    
    try {
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
    } catch (error) {
      console.error('Error in updateInventoryItem:', error);
      throw error;
    }
  },

  // Delete inventory item
  async deleteInventoryItem(id: string): Promise<void> {
    console.log('Deleting inventory item:', id);
    
    try {
      const { error } = await supabase
        .from("inventory_items")
        .delete()
        .eq("id", id);
      
      if (error) {
        console.error('Delete error:', error);
        throw error;
      }
      
      console.log('Deleted item:', id);
    } catch (error) {
      console.error('Error in deleteInventoryItem:', error);
      throw error;
    }
  },

  // Stock movement operations
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

  async removeStock(inventoryId: string, quantity: number, note?: string, workOrderId?: string): Promise<void> {
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

  async transferStock(
    inventoryId: string, 
    quantity: number, 
    fromLocationId: string, 
    toLocationId: string, 
    note?: string
  ): Promise<void> {
    console.log('Transfer stock:', { inventoryId, quantity, fromLocationId, toLocationId, note });
  },

  async adjustStock(inventoryId: string, newQuantity: number, note?: string): Promise<void> {
    const { error: updateError } = await supabase
      .from("inventory_items")
      .update({ 
        quantity: Math.max(0, newQuantity),
        updated_at: new Date().toISOString()
      })
      .eq("id", inventoryId);
    
    if (updateError) throw updateError;
  },

  // Get low stock alerts
  async getLowStockAlerts(): Promise<InventoryAlert[]> {
    try {
      const { data, error } = await supabase
        .from("inventory_items")
        .select(`
          id,
          name,
          sku,
          quantity,
          min_quantity,
          location,
          description
        `);
      
      if (error) throw error;
      
      const lowStockItems = (data || []).filter(item => 
        (item.quantity || 0) <= (item.min_quantity || 0)
      );
      
      return lowStockItems.map(item => ({
        id: item.id,
        item_name: item.name,
        sku: item.sku || '',
        current_quantity: item.quantity || 0,
        min_quantity: item.min_quantity || 0,
        reorder_level: item.min_quantity || 0,
        alert_type: item.quantity === 0 ? 'out_of_stock' as const : 'low_stock' as const,
        location: item.location || '',
        category: item.description || ''
      }));
    } catch (error) {
      console.error('Error in getLowStockAlerts:', error);
      throw error;
    }
  },

  // Search and filter inventory
  async searchInventory(params: {
    search?: string;
    category?: string;
    location?: string;
    status?: 'low_stock' | 'in_stock' | 'out_of_stock';
    sortBy?: 'name' | 'quantity' | 'updated_at' | 'value';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): Promise<{ items: InventoryItemWithStats[]; total: number }> {
    console.log('Searching inventory with params:', params);
    
    try {
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
      }

      // Apply sorting
      const sortBy = params.sortBy || 'name';
      const sortOrder = params.sortOrder || 'asc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      if (params.limit) {
        query = query.limit(params.limit);
      }
      if (params.offset) {
        query = query.range(params.offset, params.offset + (params.limit || 50) - 1);
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
        usage_history: [],
        location_name: item.location
      }));

      console.log('Search results:', { items, total: count || 0 });

      return {
        items,
        total: count || 0
      };
    } catch (error) {
      console.error('Error in searchInventory:', error);
      throw error;
    }
  },

  // Inventory logs placeholder
  async getInventoryLogs(inventoryItemId: string): Promise<InventoryLog[]> {
    return [];
  },

  async createInventoryLog(log: Omit<InventoryLog, 'id' | 'created_at' | 'user_name'>): Promise<void> {
    console.log('Inventory log created:', log);
  },

  // Bulk operations
  async bulkUpdateStock(updates: Array<{ id: string; quantity: number; note?: string }>): Promise<void> {
    for (const update of updates) {
      await this.adjustStock(update.id, update.quantity, update.note);
    }
  },

  // Export functionality
  async exportInventoryToCsv(): Promise<string> {
    const items = await this.getInventoryItemsWithStats();
    
    const headers = ['Name', 'SKU', 'Description', 'Quantity', 'Unit Cost', 'Total Value', 'Location', 'Min Quantity', 'Status'];
    const rows = items.map(item => [
      item.name,
      item.sku || '',
      item.description || '',
      item.quantity?.toString() || '0',
      item.unit_cost?.toString() || '0',
      item.total_value.toString(),
      item.location || '',
      item.min_quantity?.toString() || '0',
      item.is_low_stock ? 'Low Stock' : 'In Stock'
    ]);
    
    return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  }
};
