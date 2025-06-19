
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
  // Enhanced inventory items with statistics
  async getInventoryItemsWithStats(): Promise<InventoryItemWithStats[]> {
    const { data, error } = await supabase
      .from("inventory_items")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(item => ({
      ...item,
      is_low_stock: (item.quantity || 0) <= (item.min_quantity || 0),
      needs_reorder: (item.quantity || 0) <= (item.min_quantity || 0) * 1.5,
      total_value: (item.quantity || 0) * (item.unit_cost || 0),
      usage_history: [],
      location_name: item.location
    }));
  },

  // Get single item with detailed stats
  async getInventoryItemById(id: string): Promise<InventoryItemWithStats | null> {
    const { data, error } = await supabase
      .from("inventory_items")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    
    const usageHistory = await this.getInventoryLogs(id);
    
    return {
      ...data,
      is_low_stock: (data.quantity || 0) <= (data.min_quantity || 0),
      needs_reorder: (data.quantity || 0) <= (data.min_quantity || 0) * 1.5,
      total_value: (data.quantity || 0) * (data.unit_cost || 0),
      usage_history: usageHistory,
      location_name: data.location
    };
  },

  // Stock movement operations
  async addStock(inventoryId: string, quantity: number, note?: string): Promise<void> {
    const movement: StockMovement = {
      inventory_item_id: inventoryId,
      change_quantity: quantity,
      type: 'added',
      note
    };
    
    await this.processStockMovement(movement);
  },

  async removeStock(inventoryId: string, quantity: number, note?: string, workOrderId?: string): Promise<void> {
    const movement: StockMovement = {
      inventory_item_id: inventoryId,
      change_quantity: -quantity,
      type: 'removed',
      note,
      work_order_id: workOrderId
    };
    
    await this.processStockMovement(movement);
  },

  async transferStock(
    inventoryId: string, 
    quantity: number, 
    fromLocationId: string, 
    toLocationId: string, 
    note?: string
  ): Promise<void> {
    const movement: StockMovement = {
      inventory_item_id: inventoryId,
      change_quantity: 0, // Transfer doesn't change total quantity
      type: 'transferred',
      note,
      from_location_id: fromLocationId,
      to_location_id: toLocationId
    };
    
    await this.processStockMovement(movement);
  },

  async adjustStock(inventoryId: string, newQuantity: number, note?: string): Promise<void> {
    // Get current quantity
    const { data: item, error } = await supabase
      .from("inventory_items")
      .select("quantity")
      .eq("id", inventoryId)
      .single();
    
    if (error) throw error;
    
    const changeQuantity = newQuantity - (item.quantity || 0);
    
    const movement: StockMovement = {
      inventory_item_id: inventoryId,
      change_quantity: changeQuantity,
      type: 'adjusted',
      note
    };
    
    await this.processStockMovement(movement);
  },

  // Process stock movement with logging
  async processStockMovement(movement: StockMovement): Promise<void> {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw new Error('User not authenticated');

    // Get current item state
    const { data: currentItem, error: fetchError } = await supabase
      .from("inventory_items")
      .select("quantity")
      .eq("id", movement.inventory_item_id)
      .single();
    
    if (fetchError) throw fetchError;
    
    const previousQuantity = currentItem.quantity || 0;
    const newQuantity = Math.max(0, previousQuantity + movement.change_quantity);
    
    // Update inventory quantity (if not a transfer)
    if (movement.type !== 'transferred') {
      const { error: updateError } = await supabase
        .from("inventory_items")
        .update({ 
          quantity: newQuantity,
          updated_at: new Date().toISOString()
        })
        .eq("id", movement.inventory_item_id);
      
      if (updateError) throw updateError;
    }
    
    // Log the movement
    await this.createInventoryLog({
      inventory_item_id: movement.inventory_item_id,
      user_id: userData.user.id,
      type: movement.type,
      change_quantity: movement.change_quantity,
      previous_quantity: previousQuantity,
      new_quantity: newQuantity,
      work_order_id: movement.work_order_id,
      note: movement.note
    });
  },

  // Get low stock alerts
  async getLowStockAlerts(): Promise<InventoryAlert[]> {
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
      `)
      .filter('quantity', 'lte', 'min_quantity');
    
    if (error) throw error;
    
    return (data || []).map(item => ({
      id: item.id,
      item_name: item.name,
      sku: item.sku || '',
      current_quantity: item.quantity || 0,
      min_quantity: item.min_quantity || 0,
      reorder_level: item.min_quantity || 0,
      alert_type: item.quantity === 0 ? 'out_of_stock' : 'low_stock',
      location: item.location || '',
      category: item.description || ''
    }));
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

    // Apply status filter - simplified approach
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
    
    if (error) throw error;
    
    const items = (data || []).map(item => ({
      ...item,
      is_low_stock: (item.quantity || 0) <= (item.min_quantity || 0),
      needs_reorder: (item.quantity || 0) <= (item.min_quantity || 0) * 1.5,
      total_value: (item.quantity || 0) * (item.unit_cost || 0),
      usage_history: [],
      location_name: item.location
    }));

    return {
      items,
      total: count || 0
    };
  },

  // Inventory logs
  async getInventoryLogs(inventoryItemId: string): Promise<InventoryLog[]> {
    // Since we don't have an inventory_logs table yet, return empty array
    // This would be implemented once the logs table is created
    return [];
  },

  async createInventoryLog(log: Omit<InventoryLog, 'id' | 'created_at' | 'user_name'>): Promise<void> {
    // Since we don't have an inventory_logs table yet, this is a placeholder
    // This would be implemented once the logs table is created
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
