
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { databaseApi } from "@/lib/database";
import type { Database } from "@/integrations/supabase/types";

type Tables = Database["public"]["Tables"];

// Organizations
export const useOrganizations = () => {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: databaseApi.getOrganizations,
  });
};

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: databaseApi.createOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
};

export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Tables["organizations"]["Update"] }) =>
      databaseApi.updateOrganization(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
};

// Organization Members
export const useOrganizationMembers = (organizationId: string) => {
  return useQuery({
    queryKey: ["organization-members", organizationId],
    queryFn: () => databaseApi.getOrganizationMembers(organizationId),
    enabled: !!organizationId,
  });
};

export const useInviteOrganizationMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: databaseApi.inviteOrganizationMember,
    onSuccess: (data: any) => {
      if (data?.organization_id) {
        queryClient.invalidateQueries({ queryKey: ["organization-members", data.organization_id] });
      }
    },
  });
};

export const useUpdateOrganizationMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ memberId, updates }: { 
      memberId: string; 
      updates: Tables["organization_members"]["Update"] 
    }) => databaseApi.updateOrganizationMember(memberId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization-members"] });
    },
  });
};

export const useRemoveOrganizationMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (memberId: string) => databaseApi.removeOrganizationMember(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization-members"] });
    },
  });
};
