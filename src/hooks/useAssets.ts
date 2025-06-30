
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { assetsApi, type Asset, type AssetInsert, type AssetUpdate } from "@/lib/database/assets";
import { toast } from "sonner";

// Re-export types for components that import them from this hook
export type { Asset, AssetInsert, AssetUpdate };

export const useAssets = (filters?: {
  search?: string;
  status?: string[];
  category?: string[];
  location?: string[];
  criticality?: string[];
}) => {
  return useQuery({
    queryKey: ['assets', filters],
    queryFn: () => assetsApi.getAssets(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};

export const useAsset = (id: string) => {
  return useQuery({
    queryKey: ['assets', id],
    queryFn: () => assetsApi.getAsset(id),
    enabled: !!id,
  });
};

export const useCreateAsset = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: assetsApi.createAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      toast.success('Asset created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create asset: ${error.message}`);
    }
  });
};

export const useUpdateAsset = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => 
      assetsApi.updateAsset(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      toast.success('Asset updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update asset: ${error.message}`);
    }
  });
};

export const useDeleteAsset = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: assetsApi.deleteAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      toast.success('Asset deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete asset: ${error.message}`);
    }
  });
};

export const useAssetsByLocation = (locationId: string) => {
  return useQuery({
    queryKey: ['assets', 'location', locationId],
    queryFn: () => assetsApi.getAssetsByLocation(locationId),
    enabled: !!locationId,
  });
};

export const useAssetsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['assets', 'category', category],
    queryFn: () => assetsApi.getAssetsByCategory(category),
    enabled: !!category,
  });
};

export const useAssetStatistics = () => {
  return useQuery({
    queryKey: ['assets', 'statistics'],
    queryFn: assetsApi.getAssetStatistics,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
