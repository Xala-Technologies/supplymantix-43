
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { locationsApi } from "@/lib/database/locations";
import type { Database } from "@/integrations/supabase/types";

type Tables = Database["public"]["Tables"];

export const useLocations = () => {
  return useQuery({
    queryKey: ["locations"],
    queryFn: locationsApi.getLocations,
  });
};

export const useCreateLocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: locationsApi.createLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Tables["locations"]["Update"] }) =>
      locationsApi.updateLocation(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
};

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: locationsApi.deleteLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
};
