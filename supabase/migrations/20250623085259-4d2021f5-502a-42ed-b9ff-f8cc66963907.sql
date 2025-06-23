
-- Enable RLS on inventory_items table (if not already enabled)
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own tenant's inventory items
CREATE POLICY "Users can view inventory items in their tenant" ON public.inventory_items
FOR SELECT USING (tenant_id = get_current_user_tenant_id());

-- Create policy for users to insert inventory items in their tenant
CREATE POLICY "Users can create inventory items in their tenant" ON public.inventory_items
FOR INSERT WITH CHECK (tenant_id = get_current_user_tenant_id());

-- Create policy for users to update inventory items in their tenant
CREATE POLICY "Users can update inventory items in their tenant" ON public.inventory_items
FOR UPDATE USING (tenant_id = get_current_user_tenant_id())
WITH CHECK (tenant_id = get_current_user_tenant_id());

-- Create policy for users to delete inventory items in their tenant
CREATE POLICY "Users can delete inventory items in their tenant" ON public.inventory_items
FOR DELETE USING (tenant_id = get_current_user_tenant_id());
