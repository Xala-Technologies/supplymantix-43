
-- Add the missing organization_id column to the subscriptions table
ALTER TABLE public.subscriptions 
ADD COLUMN organization_id uuid REFERENCES public.organizations(id);

-- Update existing subscriptions to link them to organizations if needed
-- (This handles any existing data that might be orphaned)
UPDATE public.subscriptions 
SET organization_id = (
  SELECT id FROM public.organizations 
  WHERE created_by = (
    SELECT id FROM auth.users 
    WHERE email = 'test@example.com' -- This is just a fallback, adjust as needed
  )
  LIMIT 1
)
WHERE organization_id IS NULL;
