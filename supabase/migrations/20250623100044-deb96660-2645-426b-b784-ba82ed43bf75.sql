
-- Enable RLS on procedures table if not already enabled
ALTER TABLE public.procedures ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view procedures in their tenant
CREATE POLICY "Users can view procedures in their tenant" 
  ON public.procedures 
  FOR SELECT 
  USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

-- Create policy for users to create procedures in their tenant
CREATE POLICY "Users can create procedures in their tenant" 
  ON public.procedures 
  FOR INSERT 
  WITH CHECK (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

-- Create policy for users to update procedures in their tenant
CREATE POLICY "Users can update procedures in their tenant" 
  ON public.procedures 
  FOR UPDATE 
  USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

-- Create policy for users to delete procedures in their tenant
CREATE POLICY "Users can delete procedures in their tenant" 
  ON public.procedures 
  FOR DELETE 
  USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

-- Also add RLS policies for procedure_fields table
ALTER TABLE public.procedure_fields ENABLE ROW LEVEL SECURITY;

-- Create policies for procedure_fields based on the parent procedure's tenant
CREATE POLICY "Users can view procedure fields for their tenant procedures" 
  ON public.procedure_fields 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.procedures p 
    WHERE p.id = procedure_fields.procedure_id 
    AND p.tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid())
  ));

CREATE POLICY "Users can create procedure fields for their tenant procedures" 
  ON public.procedure_fields 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.procedures p 
    WHERE p.id = procedure_fields.procedure_id 
    AND p.tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid())
  ));

CREATE POLICY "Users can update procedure fields for their tenant procedures" 
  ON public.procedure_fields 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.procedures p 
    WHERE p.id = procedure_fields.procedure_id 
    AND p.tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid())
  ));

CREATE POLICY "Users can delete procedure fields for their tenant procedures" 
  ON public.procedure_fields 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.procedures p 
    WHERE p.id = procedure_fields.procedure_id 
    AND p.tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid())
  ));

-- Add RLS policies for procedure_executions table
ALTER TABLE public.procedure_executions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view procedure executions in their tenant" 
  ON public.procedure_executions 
  FOR SELECT 
  USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Users can create procedure executions in their tenant" 
  ON public.procedure_executions 
  FOR INSERT 
  WITH CHECK (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Users can update procedure executions in their tenant" 
  ON public.procedure_executions 
  FOR UPDATE 
  USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Users can delete procedure executions in their tenant" 
  ON public.procedure_executions 
  FOR DELETE 
  USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

-- Add RLS policies for procedure_templates table
ALTER TABLE public.procedure_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view procedure templates in their tenant or public ones" 
  ON public.procedure_templates 
  FOR SELECT 
  USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()) OR is_public = true);

CREATE POLICY "Users can create procedure templates in their tenant" 
  ON public.procedure_templates 
  FOR INSERT 
  WITH CHECK (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Users can update procedure templates in their tenant" 
  ON public.procedure_templates 
  FOR UPDATE 
  USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Users can delete procedure templates in their tenant" 
  ON public.procedure_templates 
  FOR DELETE 
  USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));
