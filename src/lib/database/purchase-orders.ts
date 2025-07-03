import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { CreatePurchaseOrderRequest, UpdatePurchaseOrderRequest } from "@/types/purchaseOrder";

type Tables = Database["public"]["Tables"];

export const purchaseOrdersApi = {
  async getPurchaseOrders() {
    console.log("=== getPurchaseOrders START ===");
    
    // First check if user is authenticated
    const { data: userData, error: userError } = await supabase.auth.getUser();
    console.log("Auth check:", { userData: userData?.user?.id, userError });
    
    if (userError || !userData.user) {
      console.error("User not authenticated in getPurchaseOrders");
      throw new Error("User not authenticated");
    }

    // Get user's tenant_id
    const { data: userRecord, error: userRecordError } = await supabase
      .from("users")
      .select("tenant_id")
      .eq("id", userData.user.id)
      .single();

    if (userRecordError) {
      console.error('Error fetching user record:', userRecordError);
      if (userRecordError.code === 'PGRST116') {
        console.log('User not found in users table, returning empty array');
        return [];
      }
      throw userRecordError;
    }

    if (!userRecord) {
      console.log('No user record found, returning empty array');
      return [];
    }

    console.log('User tenant_id:', userRecord.tenant_id);

    const { data, error } = await supabase
      .from("purchase_orders")
      .select("*")
      .eq("tenant_id", userRecord.tenant_id)
      .order("created_at", { ascending: false });
    
    console.log("Purchase orders query result:", { data, error, count: data?.length });
    
    if (error) {
      console.error("Error fetching purchase orders:", error);
      throw error;
    }
    
    console.log("=== getPurchaseOrders END ===");
    return data || [];
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
    console.log("=== createPurchaseOrder START ===");
    console.log("Request data:", request);
    
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      console.error("User authentication error:", userError);
      throw new Error("User not authenticated");
    }
    
    console.log("Authenticated user:", userData.user.id);

    // Get user's tenant_id
    console.log("Querying users table for tenant_id...");
    const { data: existingUser, error: userQueryError } = await supabase
      .from("users")
      .select("tenant_id")
      .eq("id", userData.user.id)
      .single();
    
    console.log("User query result:", { existingUser, userQueryError });
    
    if (userQueryError && userQueryError.code !== 'PGRST116') {
      console.error("Error querying user:", userQueryError);
      throw new Error("Failed to get user information");
    }
    
    if (!existingUser) {
      console.error("User record not found in users table");
      throw new Error("User record not found. Please contact support.");
    }

    console.log("Found user record with tenant_id:", existingUser.tenant_id);

    // Calculate total amount
    const totalAmount = request.line_items.reduce((sum, item) => 
      sum + (item.quantity * item.unit_price), 0
    );

    console.log("Calculated total amount:", totalAmount);

    // Prepare PO data
    const poData = {
      tenant_id: existingUser.tenant_id,
      vendor: request.vendor,
      po_number: request.po_number,
      notes: request.notes,
      due_date: request.due_date,
      status: 'draft' as const,
      total_amount: totalAmount,
      requested_by: userData.user.id,
    };

    console.log("Creating PO with data:", poData);

    // Create the purchase order
    const { data: po, error: poError } = await supabase
      .from("purchase_orders")
      .insert(poData)
      .select()
      .single();

    console.log("PO creation result:", { po, poError });

    if (poError) {
      console.error("Error creating purchase order:", poError);
      throw poError;
    }

    console.log("Purchase order created successfully:", po);

    // Insert line items
    console.log("Creating line items...");
    for (const item of request.line_items) {
      console.log("Creating line item:", item);
      const lineItemData = {
        purchase_order_id: po.id,
        parts_item_id: item.parts_item_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      };
      
      console.log("Line item data:", lineItemData);
      
      const { data: lineItemResult, error: lineError } = await supabase
        .from("purchase_order_line_items")
        .insert(lineItemData)
        .select();

      console.log("Line item creation result:", { lineItemResult, lineError });

      if (lineError) {
        console.error("Error creating line item:", lineError);
        throw lineError;
      }
    }

    console.log("=== createPurchaseOrder END ===");
    console.log("Final PO result:", po);
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
            parts_item_id: item.parts_item_id,
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
        parts_items (
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
