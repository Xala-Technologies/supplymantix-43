import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useOrganizationSubscription, useCreateOrganizationSubscription, useSubscriptionTemplates } from "@/hooks/useBilling";
import { useOrganizationMembers } from "@/hooks/useOrganizations";
import { CurrentSubscriptionCard } from "./subscription/CurrentSubscriptionCard";
import { UserLimitWarning } from "./subscription/UserLimitWarning";
import { SubscriptionPlansGrid } from "./subscription/SubscriptionPlansGrid";

interface OrganizationSubscriptionProps {
  organizationId: string;
}

export const OrganizationSubscription = ({ organizationId }: OrganizationSubscriptionProps) => {
  const { toast } = useToast();
  
  const { data: orgSubscription, isLoading } = useOrganizationSubscription(organizationId);
  const { data: subscriptionTemplates } = useSubscriptionTemplates();
  const { data: members } = useOrganizationMembers(organizationId);
  const createOrganizationSubscription = useCreateOrganizationSubscription();
  
  const currentSubscription = orgSubscription?.subscriptions;
  const memberCount = members?.length || 0;

  const handlePlanChange = async (planId: string) => {
    const selectedTemplate = subscriptionTemplates?.find(p => p.plan_id === planId);
    if (!selectedTemplate) return;

    // Check if downgrading would exceed user limit
    if (selectedTemplate.max_users !== -1 && memberCount > selectedTemplate.max_users) {
      toast({
        title: "Cannot Downgrade",
        description: `You have ${memberCount} members, but the ${selectedTemplate.plan_name} plan only allows ${selectedTemplate.max_users}. Please remove members first.`,
        variant: "destructive",
      });
      return;
    }

    try {
      // Create new organization subscription
      const subscriptionData = {
        organization_id: organizationId,
        subscription_id: selectedTemplate.id,
        status: 'active',
        billing_cycle: 'monthly',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      };

      await createOrganizationSubscription.mutateAsync(subscriptionData);

      toast({
        title: "Subscription Updated",
        description: `Your subscription has been updated to ${selectedTemplate.plan_name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update subscription",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading subscription...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {orgSubscription && (
        <CurrentSubscriptionCard 
          orgSubscription={orgSubscription}
          memberCount={memberCount} 
        />
      )}

      <UserLimitWarning 
        subscription={currentSubscription} 
        memberCount={memberCount} 
      />

      <SubscriptionPlansGrid
        currentSubscription={currentSubscription}
        memberCount={memberCount}
        isLoading={createOrganizationSubscription.isPending}
        onPlanSelect={handlePlanChange}
      />
    </div>
  );
};
