
-- Create work_order_cost_entries table
CREATE TABLE IF NOT EXISTS work_order_cost_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE work_order_cost_entries ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view cost entries for work orders in their tenant
CREATE POLICY "Users can view cost entries in their tenant" ON work_order_cost_entries
  FOR SELECT USING (
    work_order_id IN (
      SELECT id FROM work_orders 
      WHERE tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid())
    )
  );

-- Policy to allow users to create cost entries for work orders in their tenant
CREATE POLICY "Users can create cost entries in their tenant" ON work_order_cost_entries
  FOR INSERT WITH CHECK (
    work_order_id IN (
      SELECT id FROM work_orders 
      WHERE tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid())
    )
  );
