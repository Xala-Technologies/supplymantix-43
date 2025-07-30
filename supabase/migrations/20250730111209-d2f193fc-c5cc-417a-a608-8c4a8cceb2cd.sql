-- Security fixes for database functions
-- Add SET search_path = '' to all SECURITY DEFINER functions to prevent privilege escalation

-- Update existing functions with security parameter
CREATE OR REPLACE FUNCTION public.get_user_system_role(user_id_param uuid DEFAULT auth.uid())
RETURNS app_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT role FROM public.user_roles 
  WHERE user_id = user_id_param 
  ORDER BY 
    CASE role 
      WHEN 'super_admin' THEN 1
      WHEN 'organization_admin' THEN 2
      WHEN 'user' THEN 3
    END
  LIMIT 1;
$function$;

CREATE OR REPLACE FUNCTION public.current_user_is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'super_admin'
  );
$function$;

CREATE OR REPLACE FUNCTION public.get_user_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT tenant_id FROM public.users WHERE id = auth.uid();
$function$;

CREATE OR REPLACE FUNCTION public.get_current_user_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT tenant_id FROM public.users WHERE id = auth.uid();
$function$;

CREATE OR REPLACE FUNCTION public.user_is_org_admin(user_id_param uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members 
    WHERE user_id = user_id_param 
    AND role IN ('owner', 'admin')
    AND status = 'active'
  );
$function$;

CREATE OR REPLACE FUNCTION public.user_is_organization_member_secure(org_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members 
    WHERE organization_id = org_id 
    AND user_id = user_id 
    AND status = 'active'
  );
$function$;

CREATE OR REPLACE FUNCTION public.user_can_update_organization(org_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members 
    WHERE organization_id = org_id 
    AND user_id = user_id
    AND role IN ('owner', 'admin')
    AND status = 'active'
  );
$function$;

CREATE OR REPLACE FUNCTION public.user_has_tenant_access(tenant_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND tenant_id = tenant_uuid
  );
$function$;

CREATE OR REPLACE FUNCTION public.user_is_organization_member(org_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members 
    WHERE organization_id = org_id 
    AND user_id = user_id
    AND status = 'active'
  );
$function$;

CREATE OR REPLACE FUNCTION public.user_can_manage_organization_members(org_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members 
    WHERE organization_id = org_id 
    AND user_id = user_id 
    AND role IN ('owner', 'admin')
    AND status = 'active'
  );
$function$;

-- Add authorization check function for admin operations
CREATE OR REPLACE FUNCTION public.check_admin_authorization()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('super_admin', 'organization_admin')
  );
$function$;

-- Add function to validate tenant access with better security
CREATE OR REPLACE FUNCTION public.validate_tenant_access(target_tenant_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND tenant_id = target_tenant_id
  );
$function$;