
-- Create storage bucket for asset documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('asset-documents', 'asset-documents', true);

-- Create storage policies for asset documents
CREATE POLICY "Anyone can view asset documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'asset-documents');

CREATE POLICY "Authenticated users can upload asset documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'asset-documents' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own asset documents" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'asset-documents' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can delete their own asset documents" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'asset-documents' AND 
    auth.role() = 'authenticated'
  );

-- Create asset_documents table to store file metadata
CREATE TABLE public.asset_documents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id uuid NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint NOT NULL,
  file_type text NOT NULL,
  uploaded_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on asset_documents
ALTER TABLE public.asset_documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for asset_documents
CREATE POLICY "Users can view asset documents in their tenant" ON public.asset_documents
  FOR SELECT USING (
    tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert asset documents in their tenant" ON public.asset_documents
  FOR INSERT WITH CHECK (
    tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()) AND
    uploaded_by = auth.uid()
  );

CREATE POLICY "Users can update asset documents in their tenant" ON public.asset_documents
  FOR UPDATE USING (
    tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid())
  );

CREATE POLICY "Users can delete asset documents in their tenant" ON public.asset_documents
  FOR DELETE USING (
    tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid())
  );

-- Create function to get asset documents with download URLs
CREATE OR REPLACE FUNCTION public.get_asset_documents(asset_id_param uuid)
RETURNS TABLE (
  id uuid,
  file_name text,
  file_size bigint,
  file_type text,
  download_url text,
  created_at timestamp with time zone
)
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT 
    ad.id,
    ad.file_name,
    ad.file_size,
    ad.file_type,
    CONCAT('https://rtcidlsswflnmguoqwfn.supabase.co/storage/v1/object/public/asset-documents/', ad.file_path) as download_url,
    ad.created_at
  FROM public.asset_documents ad
  WHERE ad.asset_id = asset_id_param
    AND ad.tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid())
  ORDER BY ad.created_at DESC;
$$;
