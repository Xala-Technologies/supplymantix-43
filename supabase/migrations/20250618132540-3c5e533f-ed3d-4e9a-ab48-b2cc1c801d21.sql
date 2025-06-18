
-- Create approval rules table
CREATE TABLE public.purchase_order_approval_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  min_amount NUMERIC NOT NULL DEFAULT 0,
  max_amount NUMERIC,
  required_approver_role TEXT NOT NULL DEFAULT 'admin',
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create approval history table
CREATE TABLE public.purchase_order_approvals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  purchase_order_id UUID NOT NULL,
  approver_id UUID NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  comments TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  rule_id UUID REFERENCES public.purchase_order_approval_rules(id)
);

-- Add new status values to existing enum
ALTER TYPE purchase_order_status ADD VALUE IF NOT EXISTS 'pending_approval';
ALTER TYPE purchase_order_status ADD VALUE IF NOT EXISTS 'rejected';

-- Add RLS policies
ALTER TABLE public.purchase_order_approval_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_approvals ENABLE ROW LEVEL SECURITY;

-- RLS policies for approval rules (tenant-based)
CREATE POLICY "Users can view approval rules for their tenant" 
  ON public.purchase_order_approval_rules 
  FOR SELECT 
  USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Admins can manage approval rules for their tenant" 
  ON public.purchase_order_approval_rules 
  FOR ALL 
  USING (
    tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()) 
    AND EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'organization_admin')
    )
  );

-- RLS policies for approvals
CREATE POLICY "Users can view approvals for POs in their tenant" 
  ON public.purchase_order_approvals 
  FOR SELECT 
  USING (
    purchase_order_id IN (
      SELECT id FROM public.purchase_orders 
      WHERE tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Approvers can create/update their own approvals" 
  ON public.purchase_order_approvals 
  FOR ALL 
  USING (approver_id = auth.uid());

-- Function to determine required approvals for a PO
CREATE OR REPLACE FUNCTION public.get_required_approvals(po_id UUID, po_amount NUMERIC)
RETURNS TABLE(rule_id UUID, required_role TEXT, min_amount NUMERIC, max_amount NUMERIC)
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT 
    ar.id as rule_id,
    ar.required_approver_role as required_role,
    ar.min_amount,
    ar.max_amount
  FROM public.purchase_order_approval_rules ar
  JOIN public.purchase_orders po ON po.id = po_id AND po.tenant_id = ar.tenant_id
  WHERE ar.is_active = true
    AND po_amount >= ar.min_amount
    AND (ar.max_amount IS NULL OR po_amount <= ar.max_amount)
  ORDER BY ar.order_index, ar.min_amount;
$$;

-- Function to check if PO is fully approved
CREATE OR REPLACE FUNCTION public.is_purchase_order_approved(po_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
DECLARE
  po_amount NUMERIC;
  required_count INTEGER;
  approved_count INTEGER;
BEGIN
  -- Get PO amount
  SELECT total_amount INTO po_amount
  FROM public.purchase_orders
  WHERE id = po_id;
  
  -- Count required approvals
  SELECT COUNT(*) INTO required_count
  FROM public.get_required_approvals(po_id, po_amount);
  
  -- Count completed approvals
  SELECT COUNT(*) INTO approved_count
  FROM public.purchase_order_approvals poa
  WHERE poa.purchase_order_id = po_id
    AND poa.status = 'approved'
    AND poa.rule_id IN (
      SELECT rule_id FROM public.get_required_approvals(po_id, po_amount)
    );
  
  RETURN required_count > 0 AND approved_count >= required_count;
END;
$$;

-- Trigger to auto-update PO status based on approvals
CREATE OR REPLACE FUNCTION public.update_po_status_on_approval()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- If all required approvals are complete, update PO status
  IF public.is_purchase_order_approved(NEW.purchase_order_id) THEN
    UPDATE public.purchase_orders
    SET status = 'approved', updated_at = now()
    WHERE id = NEW.purchase_order_id;
  ELSIF NEW.status = 'rejected' THEN
    UPDATE public.purchase_orders
    SET status = 'rejected', updated_at = now()
    WHERE id = NEW.purchase_order_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER update_po_status_trigger
  AFTER INSERT OR UPDATE ON public.purchase_order_approvals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_po_status_on_approval();

-- Insert default approval rules for demo
INSERT INTO public.purchase_order_approval_rules (tenant_id, name, min_amount, max_amount, required_approver_role, order_index)
SELECT 
  t.id as tenant_id,
  'Small Purchases',
  0,
  1000,
  'organization_admin',
  1
FROM public.tenants t;

INSERT INTO public.purchase_order_approval_rules (tenant_id, name, min_amount, required_approver_role, order_index)
SELECT 
  t.id as tenant_id,
  'Large Purchases',
  1000,
  'super_admin',
  2
FROM public.tenants t;
