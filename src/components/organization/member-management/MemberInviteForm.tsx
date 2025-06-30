import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useInviteOrganizationMember } from "@/hooks/useOrganizations";
import { useSubscriptionLimits } from "@/hooks/useSubscriptionLimits";
import { InviteFormHeader } from "./InviteFormHeader";
import { InviteFormFields } from "./InviteFormFields";
import { InviteFormStatus } from "./InviteFormStatus";
import type { Database } from "@/integrations/supabase/types";

type OrganizationRole = Database["public"]["Enums"]["organization_role"];

interface MemberInviteFormProps {
  organizationId: string;
}

export const MemberInviteForm = ({ organizationId }: MemberInviteFormProps) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<OrganizationRole>("viewer");
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const inviteMutation = useInviteOrganizationMember();
  const subscriptionLimits = useSubscriptionLimits(organizationId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subscriptionLimits.canAddMember) {
      toast({
        title: "Member Limit Reached",
        description: `Your ${subscriptionLimits.currentPlan} plan allows up to ${subscriptionLimits.maxUsers} members. Please upgrade to add more team members.`,
        variant: "destructive",
      });
      return;
    }

    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter an email address to send the invitation.",
        variant: "destructive",
      });
      return;
    }

    try {
      const inviteData = {
        organization_id: organizationId,
        invited_email: email.trim(),
        role,
        invited_by: "current-user-id", // This should come from auth context
      };

      await inviteMutation.mutateAsync(inviteData);

      setIsSuccess(true);
      toast({
        title: "Invitation Sent Successfully!",
        description: `${email} will receive an invitation to join your team`,
      });

      // Reset form after success
      setTimeout(() => {
        setEmail("");
        setRole("viewer");
        setIsSuccess(false);
      }, 2000);
    } catch (error) {
      toast({
        title: "Failed to Send Invitation",
        description: "Please check the email address and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <InviteFormHeader />
        
        <InviteFormStatus 
          isSuccess={isSuccess}
          isAtLimit={subscriptionLimits.isAtLimit}
          currentPlan={subscriptionLimits.currentPlan}
          maxUsers={subscriptionLimits.maxUsers}
        />

        <InviteFormFields
          email={email}
          setEmail={setEmail}
          role={role}
          setRole={setRole}
          disabled={subscriptionLimits.isAtLimit || inviteMutation.isPending}
          onSubmit={handleSubmit}
          isLoading={inviteMutation.isPending}
        />
      </CardContent>
    </Card>
  );
};
