
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { databaseApi } from "@/lib/database";
import { toast } from "sonner";

export const useOrganizationSubscription = (organizationId: string) => {
  return useQuery({
    queryKey: ["organization-subscription", organizationId],
    queryFn: () => databaseApi.getOrganizationSubscription(organizationId),
    enabled: !!organizationId,
  });
};

export const useSubscriptionTemplates = () => {
  return useQuery({
    queryKey: ["subscription-templates"],
    queryFn: () => databaseApi.getSubscriptionTemplates(),
  });
};

export const useCreateOrganizationSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => databaseApi.createOrganizationSubscription(data),
    onSuccess: (data) => {
      const orgId = data?.organization_id || 'unknown';
      queryClient.invalidateQueries({ queryKey: ["organization-subscription", orgId] });
      toast.success("Subscription created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create subscription: ${error.message}`);
    },
  });
};

export const useUpdateOrganizationSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => 
      databaseApi.updateOrganizationSubscription(id, updates),
    onSuccess: (data) => {
      const orgId = data?.organization_id || 'unknown';
      queryClient.invalidateQueries({ queryKey: ["organization-subscription", orgId] });
      toast.success("Subscription updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update subscription: ${error.message}`);
    },
  });
};

export const useCancelOrganizationSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => databaseApi.cancelOrganizationSubscription(id),
    onSuccess: (data) => {
      const orgId = data?.organization_id || 'unknown';
      queryClient.invalidateQueries({ queryKey: ["organization-subscription", orgId] });
      toast.success("Subscription cancelled successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to cancel subscription: ${error.message}`);
    },
  });
};

export const useBillingInformation = (organizationId: string) => {
  return useQuery({  
    queryKey: ["billing-information", organizationId],
    queryFn: () => databaseApi.getBillingInformation(organizationId),
    enabled: !!organizationId,
  });
};

export const useCreateBillingInformation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => databaseApi.createBillingInformation(data),
    onSuccess: (data) => {
      const orgId = data?.organization_id || 'unknown';
      queryClient.invalidateQueries({ queryKey: ["billing-information", orgId] });
      toast.success("Billing information created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create billing information: ${error.message}`);
    },
  });
};

export const useInvoices = (organizationId: string) => {
  return useQuery({
    queryKey: ["invoices", organizationId],
    queryFn: () => databaseApi.getInvoices(organizationId),
    enabled: !!organizationId,
  });
};
