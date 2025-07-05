// License and plan types for tenant management
export type PlanType = 'trial' | 'basic' | 'professional' | 'enterprise' | 'custom';
export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'expired';

export interface Plan {
  id: string;
  name: string;
  type: PlanType;
  price_monthly: number;
  price_yearly: number;
  features: PlanFeature[];
  limits: PlanLimits;
  is_active: boolean;
}

export interface PlanFeature {
  feature_key: string;
  feature_name: string;
  description: string;
  enabled: boolean;
  limit?: number;
}

export interface PlanLimits {
  max_users: number;
  max_assets: number;
  max_work_orders: number;
  max_storage_gb: number;
  api_requests_per_month: number;
  integrations_allowed: string[];
}

export interface TenantLicense {
  id: string;
  tenant_id: string;
  plan: Plan;
  subscription_status: SubscriptionStatus;
  trial_end?: string;
  billing_cycle_end?: string;
  usage: UsageMetrics;
  compliance_level: 'basic' | 'nsm_cleared' | 'digdir_compliant';
}

export interface UsageMetrics {
  current_users: number;
  current_assets: number;
  current_work_orders: number;
  storage_used_gb: number;
  api_requests_current_month: number;
  last_updated: string;
}

export interface FeatureAccess {
  can_access: boolean;
  reason?: string;
  upgrade_required?: boolean;
  limit_reached?: boolean;
}