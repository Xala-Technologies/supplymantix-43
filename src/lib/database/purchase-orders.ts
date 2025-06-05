
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { CreatePurchaseOrderRequest, UpdatePurchaseOrderRequest } from "@/types/purchaseOrder";

type Tables = Database["public"]["Tables"];

export const purchaseOrdersApi = {
  async getPurchaseOrders() {
    console.log("Fetching purchase orders...");
    const { data, error } = await supabase
      .from("purchase_orders")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching purchase orders:", error);
      throw error;
    }
    console.log("Purchase orders fetched:", data);
    return data;
  },

  async getPurchaseOrderById(id: string) {
    console.log("Fetching purchase order by ID:", id);
    const { data, error } = await supabase
      .from("purchase_orders")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      console.error("Error fetching purchase order:", error);
      throw error;
    }
    return data;
  },

  async createPurchaseOrder(request: CreatePurchaseOrderRequest) {
    console.log("Creating purchase order:", request);
    
    // Get current user's tenant_id
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("User not authenticated");

    const { data: userRecord } = await supabase
      .from("users")
      .select("tenant_id")
      .eq("id", userData.user.id)
      .single();
    
    if (!userRecord) throw new Error("User record not found");

    // Calculate total amount
    const totalAmount = request.line_items.reduce((sum, item) => 
      sum + (item.quantity * item.unit_price), 0
    );

    // Create the purchase order
    const { data: po, error: poError } = await supabase
      .from("purchase_orders")
      .insert({
        tenant_id: userRecord.tenant_id,
        vendor: request.vendor,
        po_number: request.po_number,
        notes: request.notes,
        due_date: request.due_date,
        status: 'draft',
        total_amount: totalAmount,
        requested_by: userData.user.id,
      })
      .select()
      .single();

    if (poError) {
      console.error("Error creating purchase order:", poError);
      throw poError;
    }

    // Insert line items
    for (const item of request.line_items) {
      const { error: lineError } = await supabase
        .from("purchase_order_line_items")
        .insert({
          purchase_order_id: po.id,
          inventory_item_id: item.inventory_item_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
        });

      if (lineError) {
        console.error("Error creating line item:", lineError);
        throw lineError;
      }
    }

    console.log("Purchase order created successfully:", po);
    return po;
  },

  async updatePurchaseOrder(request: UpdatePurchaseOrderRequest) {
    const { id, line_items, ...updates } = request;

    // Calculate total if line items are provided
    if (line_items) {
      const totalAmount = line_items.reduce((sum, item) => 
        sum + (item.quantity * item.unit_price), 0
      );
      (updates as any).total_amount = totalAmount;
    }

    // Update the purchase order
    const { data: po, error: poError } = await supabase
      .from("purchase_orders")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (poError) throw poError;

    // If line items are provided, replace them
    if (line_items) {
      // Delete existing line items
      const { error: deleteError } = await supabase
        .from("purchase_order_line_items")
        .delete()
        .eq("purchase_order_id", id);

      if (deleteError) throw deleteError;

      // Insert new line items
      for (const item of line_items) {
        const { error: lineError } = await supabase
          .from("purchase_order_line_items")
          .insert({
            purchase_order_id: id,
            inventory_item_id: item.inventory_item_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
          });

        if (lineError) throw lineError;
      }
    }

    return po;
  },

  async deletePurchaseOrder(id: string) {
    const { error } = await supabase
      .from("purchase_orders")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  },

  async getPurchaseOrderLineItems(purchaseOrderId: string) {
    const { data, error } = await supabase
      .from("purchase_order_line_items")
      .select(`
        *,
        inventory_items (
          id,
          name,
          sku,
          quantity
        )
      `)
      .eq("purchase_order_id", purchaseOrderId);
    
    if (error) throw error;
    return data;
  },
};
