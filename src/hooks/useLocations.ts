
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { locationsApi } from "@/lib/database/locations";
import type { Database } from "@/integrations/supabase/types";
import type { LocationHierarchy, LocationStats, LocationBreadcrumb } from "@/types/location";

type Tables = Database["public"]["Tables"];

export const useLocations = () => {
  return useQuery({
    queryKey: ["locations"],
    queryFn: locationsApi.getLocations,
  });
};

export const useLocationHierarchy = () => {
  return useQuery({
    queryKey: ["locations", "hierarchy"],
    queryFn: locationsApi.getLocationHierarchy,
  });
};

export const useLocationChildren = (parentId: string) => {
  return useQuery({
    queryKey: ["locations", "children", parentId],
    queryFn: () => locationsApi.getLocationChildren(parentId),
    enabled: !!parentId,
  });
};

export const useLocationBreadcrumbs = (locationId: string) => {
  return useQuery({
    queryKey: ["locations", "breadcrumbs", locationId],
    queryFn: () => locationsApi.getLocationBreadcrumbs(locationId),
    enabled: !!locationId,
  });
};

export const useLocationStats = (locationId: string) => {
  return useQuery({
    queryKey: ["locations", "stats", locationId],
    queryFn: () => locationsApi.getLocationStats(locationId),
    enabled: !!locationId,
  });
};

export const useLocationSearch = (query: string) => {
  return useQuery({
    queryKey: ["locations", "search", query],
    queryFn: () => locationsApi.searchLocations(query),
    enabled: query.length >= 2,
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

export const useMoveLocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ locationId, newParentId }: { locationId: string; newParentId: string | null }) =>
      locationsApi.moveLocation(locationId, newParentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
};
