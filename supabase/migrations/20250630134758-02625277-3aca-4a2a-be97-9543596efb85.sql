
-- Add relationship columns to the procedures table
ALTER TABLE public.procedures 
ADD COLUMN asset_ids uuid[] DEFAULT '{}',
ADD COLUMN location_ids uuid[] DEFAULT '{}',
ADD COLUMN team_ids uuid[] DEFAULT '{}';
