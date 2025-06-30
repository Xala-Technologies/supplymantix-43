
-- Add order_index column to procedure_fields table
ALTER TABLE public.procedure_fields 
ADD COLUMN IF NOT EXISTS order_index integer DEFAULT 0;

-- Update existing records to have sequential order_index values
UPDATE public.procedure_fields 
SET order_index = subquery.row_number - 1
FROM (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY procedure_id ORDER BY field_order, created_at) as row_number
  FROM public.procedure_fields
) AS subquery
WHERE public.procedure_fields.id = subquery.id;

-- Update the index for better performance
DROP INDEX IF EXISTS idx_procedure_fields_order;
CREATE INDEX IF NOT EXISTS idx_procedure_fields_order_index ON procedure_fields(procedure_id, order_index);
