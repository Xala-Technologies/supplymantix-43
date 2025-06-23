
// Re-export all inventory hooks from their respective files
export { useInventoryEnhanced, useLowStockAlerts } from "./useInventoryQueries";
export { 
  useCreateInventoryItem, 
  useUpdateInventoryItem, 
  useDeleteInventoryItem 
} from "./useInventoryMutations";
export { 
  useAddStock, 
  useRemoveStock, 
  useAdjustStock, 
  useTransferStock 
} from "./useInventoryStockMutations";
export { useExportInventory } from "./useInventoryExport";
export { getCurrentTenantId } from "./useInventoryHelpers";
