-- Add new fields to parts_items for full part detail support
ALTER TABLE public.parts_items
  ADD COLUMN IF NOT EXISTS qr_code text,
  ADD COLUMN IF NOT EXISTS barcode text,
  ADD COLUMN IF NOT EXISTS picture_url text,
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS quantity integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS min_quantity integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS assets text[],
  ADD COLUMN IF NOT EXISTS teams text[],
  ADD COLUMN IF NOT EXISTS part_type text,
  ADD COLUMN IF NOT EXISTS area text,
  ADD COLUMN IF NOT EXISTS documents jsonb,
  ADD COLUMN IF NOT EXISTS vendor_id uuid;

-- Add foreign key for vendor_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'parts_items_vendor_id_fkey' AND table_name = 'parts_items'
  ) THEN
    ALTER TABLE public.parts_items
      ADD CONSTRAINT parts_items_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES vendors(id);
  END IF;
END $$; 