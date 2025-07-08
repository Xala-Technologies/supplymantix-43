
-- Create file attachments table for work orders
CREATE TABLE IF NOT EXISTS public.work_order_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  work_order_id UUID NOT NULL REFERENCES public.work_orders(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  tenant_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.work_order_attachments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view work order attachments in their tenant" 
  ON public.work_order_attachments 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.work_orders wo 
      WHERE wo.id = work_order_attachments.work_order_id 
      AND wo.tenant_id = get_user_tenant_id()
    )
  );

CREATE POLICY "Users can manage work order attachments in their tenant" 
  ON public.work_order_attachments 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.work_orders wo 
      WHERE wo.id = work_order_attachments.work_order_id 
      AND wo.tenant_id = get_user_tenant_id()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_work_order_attachments_work_order_id ON public.work_order_attachments(work_order_id);
CREATE INDEX IF NOT EXISTS idx_work_order_attachments_tenant_id ON public.work_order_attachments(tenant_id);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_work_order_attachments_updated_at
  BEFORE UPDATE ON public.work_order_attachments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create work-order-files storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('work-order-files', 'work-order-files', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for work order files
CREATE POLICY "Work order files are accessible to tenant users" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'work-order-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload work order files" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'work-order-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their work order files" 
  ON storage.objects 
  FOR UPDATE 
  USING (bucket_id = 'work-order-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their work order files" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'work-order-files' AND auth.uid()::text = (storage.foldername(name))[1]);
