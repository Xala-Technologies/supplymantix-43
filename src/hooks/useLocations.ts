
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { locationsApi } from "@/lib/database/locations";

export interface Location {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  location_code?: string;
  location_type: string;
  address?: string;
  tenant_id: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  coordinates?: any;
  metadata?: any;
}

export const useLocations = () => {
  return useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");

      const { data: userRecord } = await supabase
        .from("users")
        .select("tenant_id")
        .eq("id", userData.user.id)
        .single();

      if (!userRecord) throw new Error("User record not found");

      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .eq("tenant_id", userRecord.tenant_id);

      if (error) throw error;
      return data || [];
    },
  });
};

export const useLocationHierarchy = () => {
  return useQuery({
    queryKey: ["locationHierarchy"],
    queryFn: async () => {
      return await locationsApi.getLocationHierarchy();
    },
  });
};

export const useLocationBreadcrumbs = (locationId: string) => {
  return useQuery({
    queryKey: ["locationBreadcrumbs", locationId],
    queryFn: async () => {
      if (!locationId) return [];
      return await locationsApi.getLocationBreadcrumbs(locationId);
    },
    enabled: !!locationId,
  });
};

export const useLocationStats = (locationId: string) => {
  return useQuery({
    queryKey: ["locationStats", locationId],
    queryFn: async () => {
      if (!locationId) return { asset_count: 0, meter_count: 0, child_location_count: 0, work_order_count: 0 };
      return await locationsApi.getLocationStats(locationId);
    },
    enabled: !!locationId,
  });
};

export const useCreateLocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (locationData: Omit<Location, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");

      const { data: userRecord } = await supabase
        .from("users")
        .select("tenant_id")
        .eq("id", userData.user.id)
        .single();

      if (!userRecord) throw new Error("User record not found");

      const { data, error } = await supabase
        .from("locations")
        .insert({ ...locationData, tenant_id: userRecord.tenant_id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      queryClient.invalidateQueries({ queryKey: ["locationHierarchy"] });
    }
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Location> }) => {
      const { data, error } = await supabase
        .from("locations")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      queryClient.invalidateQueries({ queryKey: ["locationHierarchy"] });
    }
  });
};

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await locationsApi.deleteLocation(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      queryClient.invalidateQueries({ queryKey: ["locationHierarchy"] });
    }
  });
};
