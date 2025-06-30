
-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  tenant_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
CREATE POLICY "Users can view categories in their tenant" 
  ON public.categories 
  FOR SELECT 
  USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Users can create categories in their tenant" 
  ON public.categories 
  FOR INSERT 
  WITH CHECK (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Users can update categories in their tenant" 
  ON public.categories 
  FOR UPDATE 
  USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Users can delete categories in their tenant" 
  ON public.categories 
  FOR DELETE 
  USING (tenant_id = public.get_user_tenant_id());

-- Add updated_at trigger
CREATE TRIGGER categories_updated_at 
  BEFORE UPDATE ON public.categories 
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_updated_at();
