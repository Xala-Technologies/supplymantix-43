// License-aware hooks for feature gating and plan management
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { TenantLicense, FeatureAccess, PlanFeature, SubscriptionStatus } from '@/types/license';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useLicenseAware = () => {
  const { user } = useAuth();
  
  const { data: license, isLoading, error } = useQuery({
    queryKey: ['tenant-license', user?.id],
    queryFn: async (): Promise<TenantLicense | null> => {
      if (!user) return null;
      
      // Get user's tenant
      const { data: userData } = await supabase
        .from('users')
        .select('tenant_id')
        .eq('id', user.id)
        .single();
      
      if (!userData) return null;
      
      // Get tenant's subscription and plan details
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select(`
          *,
          organization:organizations(*)
        `)
        .eq('organization_id', userData.tenant_id)
        .eq('status', 'active')
        .single();
      
      if (!subscription) return null;
      
      // Mock license data structure (replace with actual implementation)
      return {
        id: subscription.id,
        tenant_id: userData.tenant_id,
        plan: {
          id: subscription.plan_id,
          name: subscription.plan_name,
          type: subscription.plan_name.toLowerCase() as any,
          price_monthly: subscription.price_monthly || 0,
          price_yearly: subscription.price_yearly || 0,
          features: [], // Would be populated from plan configuration
          limits: {
            max_users: 10, // Would come from plan
            max_assets: 1000,
            max_work_orders: 500,
            max_storage_gb: 10,
            api_requests_per_month: 10000,
            integrations_allowed: ['basic']
          },
          is_active: subscription.status === 'active'
        },
        subscription_status: subscription.status as SubscriptionStatus,
        trial_end: subscription.trial_end,
        billing_cycle_end: subscription.current_period_end,
        usage: {
          current_users: 1, // Would be calculated from actual usage
          current_assets: 0,
          current_work_orders: 0,
          storage_used_gb: 0,
          api_requests_current_month: 0,
          last_updated: new Date().toISOString()
        },
        compliance_level: 'basic'
      };
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const checkFeatureAccess = (featureKey: string): FeatureAccess => {
    if (!license) {
      return { can_access: false, reason: 'No license found' };
    }

    const feature = license.plan.features.find(f => f.feature_key === featureKey);
    
    if (!feature) {
      return { can_access: false, reason: 'Feature not available in plan' };
    }

    if (!feature.enabled) {
      return { 
        can_access: false, 
        reason: 'Feature not enabled in current plan',
        upgrade_required: true 
      };
    }

    // Check usage limits if applicable
    if (feature.limit) {
      const currentUsage = getCurrentUsageForFeature(featureKey);
      if (currentUsage >= feature.limit) {
        return { 
          can_access: false, 
          reason: 'Feature usage limit reached',
          limit_reached: true 
        };
      }
    }

    return { can_access: true };
  };

  const getCurrentUsageForFeature = (featureKey: string): number => {
    if (!license) return 0;
    
    // Map feature keys to usage metrics
    const usageMap: Record<string, number> = {
      'users': license.usage.current_users,
      'assets': license.usage.current_assets,
      'work_orders': license.usage.current_work_orders,
      'storage': license.usage.storage_used_gb,
      'api_requests': license.usage.api_requests_current_month,
    };

    return usageMap[featureKey] || 0;
  };

  const isPlanActive = license?.subscription_status === 'active';
  const isTrialing = license?.subscription_status === 'trialing';
  const isExpired = license?.subscription_status === 'expired';

  return {
    license,
    isLoading,
    error,
    checkFeatureAccess,
    isPlanActive,
    isTrialing,
    isExpired,
    planName: license?.plan.name,
    planType: license?.plan.type,
    usage: license?.usage,
    limits: license?.plan.limits
  };
};

export const useFeatureAccess = (featureKey: string) => {
  const { checkFeatureAccess } = useLicenseAware();
  const [access, setAccess] = useState<FeatureAccess>({ can_access: false });

  useEffect(() => {
    setAccess(checkFeatureAccess(featureKey));
  }, [featureKey, checkFeatureAccess]);

  return access;
};

export const usePlanDetails = () => {
  const { license, isLoading } = useLicenseAware();
  
  return {
    plan: license?.plan,
    isLoading,
    features: license?.plan.features || [],
    limits: license?.plan.limits,
    subscriptionStatus: license?.subscription_status
  };
};