
-- Add missing fields to procedures table
ALTER TABLE public.procedures 
ADD COLUMN IF NOT EXISTS category text DEFAULT 'maintenance',
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_global boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS template_data jsonb DEFAULT '{}';

-- Create procedure_fields table for dynamic form fields
CREATE TABLE IF NOT EXISTS public.procedure_fields (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  procedure_id uuid NOT NULL REFERENCES procedures(id) ON DELETE CASCADE,
  label text NOT NULL,
  field_type text NOT NULL DEFAULT 'text',
  is_required boolean DEFAULT false,
  field_order integer DEFAULT 0,
  options jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create procedure_executions table for tracking executions
CREATE TABLE IF NOT EXISTS public.procedure_executions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  procedure_id uuid NOT NULL REFERENCES procedures(id) ON DELETE CASCADE,
  work_order_id uuid REFERENCES work_orders(id) ON DELETE SET NULL,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  answers jsonb DEFAULT '{}',
  score integer DEFAULT 0,
  status text DEFAULT 'in_progress',
  started_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create procedure_templates table for reusable templates
CREATE TABLE IF NOT EXISTS public.procedure_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  name text NOT NULL,
  description text,
  template_data jsonb NOT NULL DEFAULT '{}',
  tags text[] DEFAULT '{}',
  is_public boolean DEFAULT false,
  created_by uuid REFERENCES users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add RLS policies for procedure_fields
ALTER TABLE public.procedure_fields ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view procedure fields from their tenant" 
  ON public.procedure_fields FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM procedures p 
      WHERE p.id = procedure_fields.procedure_id 
      AND p.tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Users can manage procedure fields from their tenant" 
  ON public.procedure_fields FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM procedures p 
      WHERE p.id = procedure_fields.procedure_id 
      AND p.tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid())
    )
  );

-- Add RLS policies for procedure_executions
ALTER TABLE public.procedure_executions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view executions from their tenant" 
  ON public.procedure_executions FOR SELECT 
  USING (tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can manage executions from their tenant" 
  ON public.procedure_executions FOR ALL 
  USING (tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid()));

-- Add RLS policies for procedure_templates
ALTER TABLE public.procedure_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view templates from their tenant or public ones" 
  ON public.procedure_templates FOR SELECT 
  USING (
    tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid()) 
    OR is_public = true
  );

CREATE POLICY "Users can manage templates from their tenant" 
  ON public.procedure_templates FOR ALL 
  USING (tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid()));

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_procedure_fields_procedure_id ON procedure_fields(procedure_id);
CREATE INDEX IF NOT EXISTS idx_procedure_fields_order ON procedure_fields(procedure_id, field_order);
CREATE INDEX IF NOT EXISTS idx_procedure_executions_procedure_id ON procedure_executions(procedure_id);
CREATE INDEX IF NOT EXISTS idx_procedure_executions_user_id ON procedure_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_procedure_executions_work_order_id ON procedure_executions(work_order_id);
CREATE INDEX IF NOT EXISTS idx_procedure_templates_tenant_id ON procedure_templates(tenant_id);
