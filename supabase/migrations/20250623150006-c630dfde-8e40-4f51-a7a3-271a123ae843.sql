
-- Add missing columns to locations table for hierarchical support
ALTER TABLE locations 
ADD COLUMN parent_id uuid REFERENCES locations(id),
ADD COLUMN location_code text,
ADD COLUMN location_type text DEFAULT 'general',
ADD COLUMN address text,
ADD COLUMN coordinates jsonb,
ADD COLUMN metadata jsonb DEFAULT '{}',
ADD COLUMN is_active boolean DEFAULT true;

-- Create index for better performance on hierarchical queries
CREATE INDEX IF NOT EXISTS idx_locations_parent_id ON locations(parent_id);
CREATE INDEX IF NOT EXISTS idx_locations_tenant_active ON locations(tenant_id, is_active);
