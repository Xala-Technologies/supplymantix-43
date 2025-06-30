
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { assetsApi, type Asset, type AssetInsert, type AssetUpdate } from "@/lib/database/assets";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

// Get all assets with optional filters
export const useAssets = (filters?: {
  search?: string;
  status?: string[];
  category?: string[];
  location?: string[];
  criticality?: string[];
}) => {
  const { user, loading: authLoading } = useAuth();
  
  return useQuery({
    queryKey: ["assets", user?.id, filters],
    queryFn: () => assetsApi.getAssets(filters),
    enabled: !authLoading && !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 2, // 2 minutes cache time
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Don't retry auth errors
      if (error instanceof Error && error.message.includes('not authenticated')) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

// Get single asset
export const useAsset = (id: string) => {
  const { user, loading: authLoading } = useAuth();
  
  return useQuery({
    queryKey: ["assets", id, user?.id],
    queryFn: () => assetsApi.getAsset(id),
    enabled: !authLoading && !!user && !!id,
  });
};

// Create asset mutation
export const useCreateAsset = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: (asset: Omit<AssetInsert, 'tenant_id'>) => assetsApi.createAsset(asset),
    onSuccess: (newAsset) => {
      queryClient.invalidateQueries({ queryKey: ["assets", user?.id] });
      toast.success(`Asset "${newAsset.name}" created successfully`);
    },
    onError: (error: any) => {
      console.error("Failed to create asset:", error);
      const errorMessage = error?.message || "Failed to create asset";
      toast.error(errorMessage);
    },
  });
};

// Update asset mutation
export const useUpdateAsset = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Omit<AssetUpdate, 'tenant_id'> }) => 
      assetsApi.updateAsset(id, updates),
    onSuccess: (updatedAsset) => {
      queryClient.invalidateQueries({ queryKey: ["assets", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["assets", updatedAsset.id, user?.id] });
      toast.success(`Asset "${updatedAsset.name}" updated successfully`);
    },
    onError: (error) => {
      console.error("Failed to update asset:", error);
      toast.error("Failed to update asset");
    },
  });
};

// Delete asset mutation
export const useDeleteAsset = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: (id: string) => assetsApi.deleteAsset(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets", user?.id] });
      toast.success("Asset deleted successfully");
    },
    onError: (error) => {
      console.error("Failed to delete asset:", error);
      toast.error("Failed to delete asset");
    },
  });
};

// Get assets by location
export const useAssetsByLocation = (location: string) => {
  const { user, loading: authLoading } = useAuth();
  
  return useQuery({
    queryKey: ["assets", "location", location, user?.id],
    queryFn: () => assetsApi.getAssetsByLocation(location),
    enabled: !authLoading && !!user && !!location,
  });
};

// Get assets by category
export const useAssetsByCategory = (category: string) => {
  const { user, loading: authLoading } = useAuth();
  
  return useQuery({
    queryKey: ["assets", "category", category, user?.id],
    queryFn: () => assetsApi.getAssetsByCategory(category),
    enabled: !authLoading && !!user && !!category,
  });
};

// Get asset statistics
export const useAssetStatistics = () => {
  const { user, loading: authLoading } = useAuth();
  
  return useQuery({
    queryKey: ["assets", "statistics", user?.id],
    queryFn: () => assetsApi.getAssetStatistics(),
    enabled: !authLoading && !!user,
  });
};

export type { Asset, AssetInsert, AssetUpdate };
