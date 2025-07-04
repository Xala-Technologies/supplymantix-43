-- Fix meter_triggers table structure to match the interface
ALTER TABLE public.meter_triggers 
DROP COLUMN IF EXISTS action,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS action_type TEXT NOT NULL DEFAULT 'create_work_order',
ADD COLUMN IF NOT EXISTS action_config JSONB DEFAULT '{}'::jsonb;

-- Add check constraint for action_type
ALTER TABLE public.meter_triggers 
DROP CONSTRAINT IF EXISTS meter_triggers_action_type_check;

ALTER TABLE public.meter_triggers 
ADD CONSTRAINT meter_triggers_action_type_check 
CHECK (action_type IN ('create_work_order', 'send_notification', 'change_asset_status'));