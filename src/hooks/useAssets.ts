
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { assetsApi, type Asset, type AssetInsert, type AssetUpdate } from "@/lib/database/assets";
import { toast } from "sonner";

// Get all assets with optional filters
export const useAssets = (filters?: {
  search?: string;
  status?: string[];
  category?: string[];
  location?: string[];
  criticality?: string[];
}) => {
  return useQuery({
    queryKey: ["assets", filters],
    queryFn: () => assetsApi.getAssets(filters),
  });
};

// Get single asset
export const useAsset = (id: string) => {
  return useQuery({
    queryKey: ["assets", id],
    queryFn: () => assetsApi.getAsset(id),
    enabled: !!id,
  });
};

// Create asset mutation
export const useCreateAsset = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (asset: AssetInsert) => assetsApi.createAsset(asset),
    onSuccess: (newAsset) => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      toast.success(`Asset "${newAsset.name}" created successfully`);
    },
    onError: (error) => {
      console.error("Failed to create asset:", error);
      toast.error("Failed to create asset");
    },
  });
};

// Update asset mutation
export const useUpdateAsset = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: AssetUpdate }) => 
      assetsApi.updateAsset(id, updates),
    onSuccess: (updatedAsset) => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["assets", updatedAsset.id] });
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
  
  return useMutation({
    mutationFn: (id: string) => assetsApi.deleteAsset(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
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
  return useQuery({
    queryKey: ["assets", "location", location],
    queryFn: () => assetsApi.getAssetsByLocation(location),
    enabled: !!location,
  });
};

// Get assets by category
export const useAssetsByCategory = (category: string) => {
  return useQuery({
    queryKey: ["assets", "category", category],
    queryFn: () => assetsApi.getAssetsByCategory(category),
    enabled: !!category,
  });
};

// Get asset statistics
export const useAssetStatistics = () => {
  return useQuery({
    queryKey: ["assets", "statistics"],
    queryFn: () => assetsApi.getAssetStatistics(),
  });
};

export type { Asset, AssetInsert, AssetUpdate };
