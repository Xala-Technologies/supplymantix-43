
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Location {
  id: string;
  name: string;
  description?: string;
  location_code?: string;
  location_type?: string;
  address?: string;
  parent_id?: string;
  tenant_id: string;
  created_at: string;
  updated_at: string;
}

export interface LocationStats {
  asset_count: number;
  meter_count: number;
  work_order_count: number;
  child_location_count: number;
}

export interface LocationBreadcrumb {
  id: string;
  name: string;
  level: number;
}

export const useLocations = () => {
  return useQuery({
    queryKey: ['locations'],
    queryFn: async (): Promise<Location[]> => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          console.log('No authenticated user, returning empty locations');
          return [];
        }

        const { data: userRecord } = await supabase
          .from("users")
          .select("tenant_id")
          .eq("id", userData.user.id)
          .single();

        if (!userRecord) {
          console.log('No user record found, returning empty locations');
          return [];
        }

        const { data, error } = await supabase
          .from('locations')
          .select('*')
          .eq('tenant_id', userRecord.tenant_id)
          .eq('is_active', true)
          .order('name');

        if (error) {
          console.error('Error fetching locations:', error);
          return [];
        }

        return data || [];
      } catch (error) {
        console.error('Error in useLocations:', error);
        return [];
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useLocationHierarchy = () => {
  return useQuery({
    queryKey: ['location-hierarchy'],
    queryFn: async () => {
      const { data: locations } = await useLocations();
      return locations || [];
    },
  });
};

export const useLocationStats = (locationId: string) => {
  return useQuery({
    queryKey: ['location-stats', locationId],
    queryFn: async (): Promise<LocationStats> => {
      // Mock stats for now - you can implement real stats later
      return {
        asset_count: 0,
        meter_count: 0,
        work_order_count: 0,
        child_location_count: 0,
      };
    },
    enabled: !!locationId,
  });
};

export const useLocationBreadcrumbs = (locationId: string) => {
  return useQuery({
    queryKey: ['location-breadcrumbs', locationId],
    queryFn: async (): Promise<LocationBreadcrumb[]> => {
      if (!locationId) return [];
      
      // Mock breadcrumbs for now - you can implement real breadcrumbs later
      return [
        { id: locationId, name: 'Current Location', level: 0 }
      ];
    },
    enabled: !!locationId,
  });
};

export const useCreateLocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (location: any) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('No authenticated user');

      const { data: userRecord } = await supabase
        .from("users")
        .select("tenant_id")
        .eq("id", userData.user.id)
        .single();

      if (!userRecord) throw new Error('No user record found');

      const { data, error } = await supabase
        .from('locations')
        .insert({ ...location, tenant_id: userRecord.tenant_id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success('Location created successfully');
    },
    onError: (error) => {
      console.error('Failed to create location:', error);
      toast.error('Failed to create location');
    },
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from('locations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success('Location updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update location:', error);
      toast.error('Failed to update location');
    },
  });
};

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('locations')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success('Location deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete location:', error);
      toast.error('Failed to delete location');
    },
  });
};
