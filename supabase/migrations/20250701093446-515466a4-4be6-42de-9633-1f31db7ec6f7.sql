
-- Add missing tenant_id column to procedure_fields table
ALTER TABLE public.procedure_fields 
ADD COLUMN IF NOT EXISTS tenant_id uuid REFERENCES tenants(id);

-- Update existing records to have the correct tenant_id based on their procedure
UPDATE public.procedure_fields 
SET tenant_id = (
  SELECT p.tenant_id 
  FROM public.procedures p 
  WHERE p.id = procedure_fields.procedure_id
)
WHERE tenant_id IS NULL;

-- Make tenant_id NOT NULL after updating existing records
ALTER TABLE public.procedure_fields 
ALTER COLUMN tenant_id SET NOT NULL;

-- Update the RLS policies to use tenant_id directly for better performance
DROP POLICY IF EXISTS "Users can view procedure fields from their tenant" ON public.procedure_fields;
DROP POLICY IF EXISTS "Users can manage procedure fields from their tenant" ON public.procedure_fields;
DROP POLICY IF EXISTS "Users can view procedure fields for their tenant procedures" ON public.procedure_fields;
DROP POLICY IF EXISTS "Users can create procedure fields for their tenant procedures" ON public.procedure_fields;
DROP POLICY IF EXISTS "Users can update procedure fields for their tenant procedures" ON public.procedure_fields;
DROP POLICY IF EXISTS "Users can delete procedure fields for their tenant procedures" ON public.procedure_fields;

-- Create new RLS policies using tenant_id directly
CREATE POLICY "Users can view procedure fields from their tenant" 
  ON public.procedure_fields FOR SELECT 
  USING (tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can manage procedure fields from their tenant" 
  ON public.procedure_fields FOR ALL 
  USING (tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid()));
