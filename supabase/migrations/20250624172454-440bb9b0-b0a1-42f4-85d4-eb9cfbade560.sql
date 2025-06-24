
-- Enable RLS on work_orders table if not already enabled
ALTER TABLE public.work_orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for work_orders table
CREATE POLICY "Users can view work orders from their tenant" 
  ON public.work_orders 
  FOR SELECT 
  USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Users can create work orders for their tenant" 
  ON public.work_orders 
  FOR INSERT 
  WITH CHECK (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Users can update work orders from their tenant" 
  ON public.work_orders 
  FOR UPDATE 
  USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Users can delete work orders from their tenant" 
  ON public.work_orders 
  FOR DELETE 
  USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

-- Also ensure other related tables have proper RLS policies
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view chat messages from their tenant" 
  ON public.chat_messages 
  FOR SELECT 
  USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Users can create chat messages for their tenant" 
  ON public.chat_messages 
  FOR INSERT 
  WITH CHECK (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));
