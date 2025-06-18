
-- Create priority_level enum (work_order_status already exists)
CREATE TYPE priority_level AS ENUM (
  'low',
  'medium', 
  'high',
  'urgent'
);

-- Create work order templates table
CREATE TABLE public.work_order_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority priority_level NOT NULL DEFAULT 'medium',
  default_tags TEXT[] DEFAULT '{}',
  default_assignee UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create template checklist items table
CREATE TABLE public.template_checklist_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL REFERENCES public.work_order_templates(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  note TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update work_orders table to include new fields
ALTER TABLE public.work_orders 
ADD COLUMN IF NOT EXISTS requester_id UUID REFERENCES public.users(id),
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS start_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES public.work_order_templates(id),
ADD COLUMN IF NOT EXISTS recurrence_rules JSONB;

-- First, drop the default value for priority column, then change type, then add new default
ALTER TABLE public.work_orders ALTER COLUMN priority DROP DEFAULT;
ALTER TABLE public.work_orders 
ALTER COLUMN priority TYPE priority_level USING 
  CASE 
    WHEN priority = 'low' THEN 'low'::priority_level
    WHEN priority = 'high' THEN 'high'::priority_level
    ELSE 'medium'::priority_level
  END;
ALTER TABLE public.work_orders ALTER COLUMN priority SET DEFAULT 'medium'::priority_level;

-- Create checklist items table
CREATE TABLE public.checklist_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  work_order_id UUID NOT NULL REFERENCES public.work_orders(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attachments table
CREATE TABLE public.attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  work_order_id UUID NOT NULL REFERENCES public.work_orders(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create time logs table
CREATE TABLE public.time_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  work_order_id UUID NOT NULL REFERENCES public.work_orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id),
  duration_minutes INTEGER NOT NULL,
  note TEXT,
  logged_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create comments table (extending existing chat_messages functionality)
CREATE TABLE public.work_order_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  work_order_id UUID NOT NULL REFERENCES public.work_orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for new tables
ALTER TABLE public.work_order_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_order_comments ENABLE ROW LEVEL SECURITY;

-- RLS policies for work_order_templates
CREATE POLICY "Users can view templates in their tenant" ON public.work_order_templates
  FOR SELECT USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Users can create templates in their tenant" ON public.work_order_templates
  FOR INSERT WITH CHECK (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Users can update templates in their tenant" ON public.work_order_templates
  FOR UPDATE USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Users can delete templates in their tenant" ON public.work_order_templates
  FOR DELETE USING (tenant_id = public.get_user_tenant_id());

-- RLS policies for template_checklist_items
CREATE POLICY "Users can view template checklist items" ON public.template_checklist_items
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.work_order_templates wot 
    WHERE wot.id = template_id AND wot.tenant_id = public.get_user_tenant_id()
  ));

CREATE POLICY "Users can manage template checklist items" ON public.template_checklist_items
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.work_order_templates wot 
    WHERE wot.id = template_id AND wot.tenant_id = public.get_user_tenant_id()
  ));

-- RLS policies for checklist_items
CREATE POLICY "Users can view checklist items" ON public.checklist_items
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.work_orders wo 
    WHERE wo.id = work_order_id AND wo.tenant_id = public.get_user_tenant_id()
  ));

CREATE POLICY "Users can manage checklist items" ON public.checklist_items
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.work_orders wo 
    WHERE wo.id = work_order_id AND wo.tenant_id = public.get_user_tenant_id()
  ));

-- RLS policies for attachments
CREATE POLICY "Users can view attachments" ON public.attachments
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.work_orders wo 
    WHERE wo.id = work_order_id AND wo.tenant_id = public.get_user_tenant_id()
  ));

CREATE POLICY "Users can manage attachments" ON public.attachments
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.work_orders wo 
    WHERE wo.id = work_order_id AND wo.tenant_id = public.get_user_tenant_id()
  ));

-- RLS policies for time_logs
CREATE POLICY "Users can view time logs" ON public.time_logs
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.work_orders wo 
    WHERE wo.id = work_order_id AND wo.tenant_id = public.get_user_tenant_id()
  ));

CREATE POLICY "Users can manage time logs" ON public.time_logs
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.work_orders wo 
    WHERE wo.id = work_order_id AND wo.tenant_id = public.get_user_tenant_id()
  ));

-- RLS policies for work_order_comments
CREATE POLICY "Users can view work order comments" ON public.work_order_comments
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.work_orders wo 
    WHERE wo.id = work_order_id AND wo.tenant_id = public.get_user_tenant_id()
  ));

CREATE POLICY "Users can manage work order comments" ON public.work_order_comments
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.work_orders wo 
    WHERE wo.id = work_order_id AND wo.tenant_id = public.get_user_tenant_id()
  ));

-- Add indexes for better performance
CREATE INDEX idx_work_order_templates_tenant_id ON public.work_order_templates(tenant_id);
CREATE INDEX idx_template_checklist_items_template_id ON public.template_checklist_items(template_id);
CREATE INDEX idx_checklist_items_work_order_id ON public.checklist_items(work_order_id);
CREATE INDEX idx_attachments_work_order_id ON public.attachments(work_order_id);
CREATE INDEX idx_time_logs_work_order_id ON public.time_logs(work_order_id);
CREATE INDEX idx_work_order_comments_work_order_id ON public.work_order_comments(work_order_id);

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_work_order_templates_updated_at
  BEFORE UPDATE ON public.work_order_templates
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
