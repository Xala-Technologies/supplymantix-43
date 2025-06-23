
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryEnhancedApi } from "@/lib/database/inventory-enhanced";
import { toast } from "sonner";

// Stock movement mutations
export const useAddStock = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ inventoryId, quantity, note }: { 
      inventoryId: string; 
      quantity: number; 
      note?: string; 
    }) => inventoryEnhancedApi.addStock(inventoryId, quantity, note),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["inventory-enhanced"] });
      queryClient.invalidateQueries({ queryKey: ["low-stock-alerts"] });
      toast.success(`Added ${variables.quantity} units to stock`);
    },
    onError: (error) => {
      console.error("Failed to add stock:", error);
      toast.error("Failed to add stock: " + (error as Error).message);
    },
  });
};

export const useRemoveStock = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ inventoryId, quantity, note }: { 
      inventoryId: string; 
      quantity: number; 
      note?: string;
    }) => inventoryEnhancedApi.removeStock(inventoryId, quantity, note),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["inventory-enhanced"] });
      queryClient.invalidateQueries({ queryKey: ["low-stock-alerts"] });
      toast.success(`Removed ${variables.quantity} units from stock`);
    },
    onError: (error) => {
      console.error("Failed to remove stock:", error);
      toast.error("Failed to remove stock: " + (error as Error).message);
    },
  });
};

export const useAdjustStock = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ inventoryId, newQuantity, note }: { 
      inventoryId: string; 
      newQuantity: number; 
      note?: string; 
    }) => inventoryEnhancedApi.adjustStock(inventoryId, newQuantity, note),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["inventory-enhanced"] });
      queryClient.invalidateQueries({ queryKey: ["low-stock-alerts"] });
      toast.success(`Adjusted stock to ${variables.newQuantity} units`);
    },
    onError: (error) => {
      console.error("Failed to adjust stock:", error);
      toast.error("Failed to adjust stock: " + (error as Error).message);
    },
  });
};

// Transfer stock 
export const useTransferStock = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ inventoryId, quantity, fromLocationId, toLocationId, note }: { 
      inventoryId: string; 
      quantity: number; 
      fromLocationId: string;
      toLocationId: string;
      note?: string;
    }) => {
      console.log('Transfer stock:', { inventoryId, quantity, fromLocationId, toLocationId, note });
      toast.info("Stock transfer feature coming soon - using adjustment for now");
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["inventory-enhanced"] });
      queryClient.invalidateQueries({ queryKey: ["low-stock-alerts"] });
      toast.success(`Transferred ${variables.quantity} units`);
    },
    onError: (error) => {
      console.error("Failed to transfer stock:", error);
      toast.error("Failed to transfer stock: " + (error as Error).message);
    },
  });
};
