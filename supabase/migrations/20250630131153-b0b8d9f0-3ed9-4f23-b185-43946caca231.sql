
-- Create clients table
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vendors table (if it doesn't exist or needs updating)
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create client_contacts table
CREATE TABLE public.client_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  role TEXT,
  phone TEXT,
  email TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vendor_contacts table
CREATE TABLE public.vendor_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  role TEXT,
  phone TEXT,
  email TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create client_attachments table
CREATE TABLE public.client_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  uploaded_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vendor_attachments table
CREATE TABLE public.vendor_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  uploaded_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign keys to work_orders for client relationship
ALTER TABLE public.work_orders ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id);

-- Add triggers for updated_at
CREATE OR REPLACE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER update_client_contacts_updated_at
  BEFORE UPDATE ON public.client_contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER update_vendor_contacts_updated_at
  BEFORE UPDATE ON public.vendor_contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_attachments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for clients
CREATE POLICY "Users can view clients in their tenant" ON public.clients
  FOR SELECT USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can insert clients in their tenant" ON public.clients
  FOR INSERT WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can update clients in their tenant" ON public.clients
  FOR UPDATE USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can delete clients in their tenant" ON public.clients
  FOR DELETE USING (tenant_id = get_user_tenant_id());

-- Create RLS policies for client_contacts
CREATE POLICY "Users can view client contacts in their tenant" ON public.client_contacts
  FOR SELECT USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can insert client contacts in their tenant" ON public.client_contacts
  FOR INSERT WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can update client contacts in their tenant" ON public.client_contacts
  FOR UPDATE USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can delete client contacts in their tenant" ON public.client_contacts
  FOR DELETE USING (tenant_id = get_user_tenant_id());

-- Create RLS policies for vendor_contacts
CREATE POLICY "Users can view vendor contacts in their tenant" ON public.vendor_contacts
  FOR SELECT USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can insert vendor contacts in their tenant" ON public.vendor_contacts
  FOR INSERT WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can update vendor contacts in their tenant" ON public.vendor_contacts
  FOR UPDATE USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can delete vendor contacts in their tenant" ON public.vendor_contacts
  FOR DELETE USING (tenant_id = get_user_tenant_id());

-- Create RLS policies for attachments
CREATE POLICY "Users can view client attachments in their tenant" ON public.client_attachments
  FOR SELECT USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can insert client attachments in their tenant" ON public.client_attachments
  FOR INSERT WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can delete client attachments in their tenant" ON public.client_attachments
  FOR DELETE USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can view vendor attachments in their tenant" ON public.vendor_attachments
  FOR SELECT USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can insert vendor attachments in their tenant" ON public.vendor_attachments
  FOR INSERT WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can delete vendor attachments in their tenant" ON public.vendor_attachments
  FOR DELETE USING (tenant_id = get_user_tenant_id());
