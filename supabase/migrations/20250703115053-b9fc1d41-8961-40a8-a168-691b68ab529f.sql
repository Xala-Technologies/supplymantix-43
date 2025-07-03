-- Remove old policies (if they exist)
DROP POLICY IF EXISTS "Users can view inventory items in their tenant" ON public.parts_items;
DROP POLICY IF EXISTS "Users can create inventory items in their tenant" ON public.parts_items;
DROP POLICY IF EXISTS "Users can update inventory items in their tenant" ON public.parts_items;
DROP POLICY IF EXISTS "Users can delete inventory items in their tenant" ON public.parts_items;

-- Create policies for parts_items
CREATE POLICY "Users can view parts items in their tenant" ON public.parts_items
FOR SELECT USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can create parts items in their tenant" ON public.parts_items
FOR INSERT WITH CHECK (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can update parts items in their tenant" ON public.parts_items
FOR UPDATE USING (tenant_id = get_current_user_tenant_id())
WITH CHECK (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can delete parts items in their tenant" ON public.parts_items
FOR DELETE USING (tenant_id = get_current_user_tenant_id());