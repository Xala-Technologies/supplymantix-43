
-- Enable RLS on assets table (if not already enabled)
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own tenant's assets
CREATE POLICY "Users can view assets in their tenant" ON public.assets
FOR SELECT USING (tenant_id = get_current_user_tenant_id());

-- Create policy for users to insert assets in their tenant
CREATE POLICY "Users can create assets in their tenant" ON public.assets
FOR INSERT WITH CHECK (tenant_id = get_current_user_tenant_id());

-- Create policy for users to update assets in their tenant
CREATE POLICY "Users can update assets in their tenant" ON public.assets
FOR UPDATE USING (tenant_id = get_current_user_tenant_id())
WITH CHECK (tenant_id = get_current_user_tenant_id());

-- Create policy for users to delete assets in their tenant
CREATE POLICY "Users can delete assets in their tenant" ON public.assets
FOR DELETE USING (tenant_id = get_current_user_tenant_id());
