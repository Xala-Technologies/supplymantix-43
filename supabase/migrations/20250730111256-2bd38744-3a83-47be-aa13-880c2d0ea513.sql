-- Fix critical security issues identified by the linter

-- 1. Enable RLS on tables that don't have it
ALTER TABLE public.documentation_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentation_settings ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.documentation_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentation_collaboration_spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentation_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users_with_role ENABLE ROW LEVEL SECURITY;

-- 2. Add RLS policies for documentation tables
CREATE POLICY "Users can view docs from their organizations" 
ON public.documentation_documents 
FOR SELECT 
USING (
  organization_id IN (
    SELECT om.organization_id 
    FROM public.organization_members om 
    WHERE om.user_id = auth.uid() AND om.status = 'active'
  )
);

CREATE POLICY "Organization admins can manage docs" 
ON public.documentation_documents 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.organization_members om 
    WHERE om.organization_id = documentation_documents.organization_id 
    AND om.user_id = auth.uid() 
    AND om.role IN ('owner', 'admin') 
    AND om.status = 'active'
  )
);

CREATE POLICY "Users can view settings from their organizations" 
ON public.documentation_settings 
FOR SELECT 
USING (
  organization_id IN (
    SELECT om.organization_id 
    FROM public.organization_members om 
    WHERE om.user_id = auth.uid() AND om.status = 'active'
  )
);

CREATE POLICY "Users can view tags from their organizations" 
ON public.documentation_tags 
FOR SELECT 
USING (
  organization_id IN (
    SELECT om.organization_id 
    FROM public.organization_members om 
    WHERE om.user_id = auth.uid() AND om.status = 'active'
  )
);

CREATE POLICY "Users can view collaboration spaces from their organizations" 
ON public.documentation_collaboration_spaces 
FOR SELECT 
USING (
  organization_id IN (
    SELECT om.organization_id 
    FROM public.organization_members om 
    WHERE om.user_id = auth.uid() AND om.status = 'active'
  )
);

CREATE POLICY "Users can view attachments from accessible docs" 
ON public.documentation_attachments 
FOR SELECT 
USING (
  document_id IN (
    SELECT dd.id FROM public.documentation_documents dd
    JOIN public.organization_members om ON om.organization_id = dd.organization_id
    WHERE om.user_id = auth.uid() AND om.status = 'active'
  )
);

-- 3. Secure the users_with_role view (only super admins can see it)
CREATE POLICY "Only super admins can view users with roles" 
ON public.users_with_role 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() AND ur.role = 'super_admin'
  )
);

-- 4. Fix remaining functions with search_path
CREATE OR REPLACE FUNCTION public.auto_assign_org_admin_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- If user becomes owner or admin of an organization, assign organization_admin system role
  IF NEW.role IN ('owner', 'admin') AND NEW.status = 'active' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.user_id, 'organization_admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  -- If user loses admin privileges, check if they should lose organization_admin role
  IF OLD.role IN ('owner', 'admin') AND (NEW.role NOT IN ('owner', 'admin') OR NEW.status != 'active') THEN
    -- Check if user is still admin/owner of any other organization
    IF NOT public.user_is_org_admin(NEW.user_id) THEN
      DELETE FROM public.user_roles 
      WHERE user_id = NEW.user_id AND role = 'organization_admin';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_single_owner_per_org()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
  IF NEW.role = 'owner' THEN
    -- Check if there's already an owner for this organization
    IF EXISTS (
      SELECT 1 FROM public.organization_members 
      WHERE organization_id = NEW.organization_id 
      AND role = 'owner' 
      AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    ) THEN
      RAISE EXCEPTION 'An organization can only have one owner';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;