-- Add missing fields to parts_items table
ALTER TABLE public.parts_items 
ADD COLUMN IF NOT EXISTS qr_code TEXT,
ADD COLUMN IF NOT EXISTS barcode TEXT,
ADD COLUMN IF NOT EXISTS picture_url TEXT, -- using picture_url instead of 'bilde' for consistency
ADD COLUMN IF NOT EXISTS assets JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS teams TEXT[],
ADD COLUMN IF NOT EXISTS vendor_id UUID,
ADD COLUMN IF NOT EXISTS part_type TEXT DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS area TEXT,
ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb;

-- Add indexes for better performance on commonly queried fields
CREATE INDEX IF NOT EXISTS idx_parts_items_qr_code ON public.parts_items(qr_code);
CREATE INDEX IF NOT EXISTS idx_parts_items_barcode ON public.parts_items(barcode);
CREATE INDEX IF NOT EXISTS idx_parts_items_vendor_id ON public.parts_items(vendor_id);
CREATE INDEX IF NOT EXISTS idx_parts_items_part_type ON public.parts_items(part_type);
CREATE INDEX IF NOT EXISTS idx_parts_items_area ON public.parts_items(area);