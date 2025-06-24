
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { locationsApi } from "@/lib/database/locations";
import { toast } from "sonner";
import type { LocationHierarchy, LocationBreadcrumb } from "@/types/location";

interface Location {
  id: string;
  name: string;
  description?: string;
  location_code?: string;
  location_type: string;
  address?: string;
  is_active: boolean;
}

export const useLocations = () => {
  return useQuery({
    queryKey: ["locations"],
    queryFn: async (): Promise<Location[]> => {
      console.log('Fetching locations...');
      
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .eq("is_active", true)
        .order("name", { ascending: true });
      
      if (error) {
        console.error('Locations query error:', error);
        throw error;
      }
      
      console.log('Locations data:', data);
      return data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};

export const useLocationHierarchy = () => {
  return useQuery({
    queryKey: ["location-hierarchy"],
    queryFn: () => locationsApi.getLocationHierarchy(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const useLocationBreadcrumbs = (locationId: string) => {
  return useQuery({
    queryKey: ["location-breadcrumbs", locationId],
    queryFn: () => locationsApi.getLocationBreadcrumbs(locationId),
    enabled: !!locationId,
  });
};

export const useLocationStats = (locationId: string) => {
  return useQuery({
    queryKey: ["location-stats", locationId],
    queryFn: () => locationsApi.getLocationStats(locationId),
    enabled: !!locationId,
  });
};

export const useCreateLocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: locationsApi.createLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      queryClient.invalidateQueries({ queryKey: ["location-hierarchy"] });
      toast.success("Location created successfully");
    },
    onError: (error) => {
      console.error("Location creation error:", error);
      toast.error("Failed to create location");
    }
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => 
      locationsApi.updateLocation(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      queryClient.invalidateQueries({ queryKey: ["location-hierarchy"] });
      toast.success("Location updated successfully");
    },
    onError: (error) => {
      console.error("Location update error:", error);
      toast.error("Failed to update location");
    }
  });
};

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: locationsApi.deleteLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      queryClient.invalidateQueries({ queryKey: ["location-hierarchy"] });
      toast.success("Location deleted successfully");
    },
    onError: (error) => {
      console.error("Location deletion error:", error);
      toast.error("Failed to delete location");
    }
  });
};
