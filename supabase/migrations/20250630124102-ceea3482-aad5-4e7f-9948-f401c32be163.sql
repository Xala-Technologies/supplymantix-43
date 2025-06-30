
-- Add new columns to the assets table
ALTER TABLE public.assets 
ADD COLUMN IF NOT EXISTS picture_url TEXT,
ADD COLUMN IF NOT EXISTS purchase_date DATE,
ADD COLUMN IF NOT EXISTS purchase_price NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS annual_depreciation_value NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS warranty_end_date DATE,
ADD COLUMN IF NOT EXISTS vin_number VARCHAR(17),
ADD COLUMN IF NOT EXISTS replacement_date DATE,
ADD COLUMN IF NOT EXISTS serial_number TEXT,
ADD COLUMN IF NOT EXISTS model TEXT,
ADD COLUMN IF NOT EXISTS manufacturer TEXT,
ADD COLUMN IF NOT EXISTS year INTEGER,
ADD COLUMN IF NOT EXISTS teams_in_charge TEXT[],
ADD COLUMN IF NOT EXISTS qr_code TEXT,
ADD COLUMN IF NOT EXISTS barcode TEXT,
ADD COLUMN IF NOT EXISTS asset_type TEXT,
ADD COLUMN IF NOT EXISTS vendor TEXT,
ADD COLUMN IF NOT EXISTS parts JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS parent_asset_id UUID REFERENCES public.assets(id);

-- Create a storage bucket for asset images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('asset-images', 'asset-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create a storage bucket for asset documents  
INSERT INTO storage.buckets (id, name, public)
VALUES ('asset-documents', 'asset-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for asset images bucket
CREATE POLICY "Allow authenticated users to upload asset images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'asset-images' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to view asset images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'asset-images' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to update asset images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'asset-images' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to delete asset images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'asset-images' AND
  auth.role() = 'authenticated'
);

-- Create RLS policies for asset documents bucket
CREATE POLICY "Allow authenticated users to upload asset documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'asset-documents' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to view asset documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'asset-documents' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to update asset documents" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'asset-documents' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to delete asset documents" ON storage.objects
FOR DELETE USING (
  bucket_id = 'asset-documents' AND
  auth.role() = 'authenticated'
);

-- Create vendors table
CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on vendors table
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for vendors
CREATE POLICY "Users can manage vendors in their tenant" ON public.vendors
FOR ALL USING (
  tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid())
);

-- Create asset types table
CREATE TABLE IF NOT EXISTS public.asset_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on asset types table
ALTER TABLE public.asset_types ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for asset types
CREATE POLICY "Users can manage asset types in their tenant" ON public.asset_types
FOR ALL USING (
  tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid())
);

-- Create parts table
CREATE TABLE IF NOT EXISTS public.parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  part_number TEXT,
  description TEXT,
  unit_cost NUMERIC(10,2),
  vendor_id UUID REFERENCES public.vendors(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on parts table
ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for parts
CREATE POLICY "Users can manage parts in their tenant" ON public.parts
FOR ALL USING (
  tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid())
);

-- Create teams table
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on teams table
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for teams
CREATE POLICY "Users can manage teams in their tenant" ON public.teams
FOR ALL USING (
  tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid())
);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to all new tables
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON public.vendors
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_asset_types_updated_at BEFORE UPDATE ON public.asset_types
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parts_updated_at BEFORE UPDATE ON public.parts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
