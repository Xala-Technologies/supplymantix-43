
// Re-export utilities from the feature module for backward compatibility
export { 
  normalizeWorkOrderData as transformWorkOrderData,
  getStatusColor,
  getPriorityColor,
  extractAssetInfo,
  extractLocationInfo 
} from '@/features/workOrders/utils';

export { formatRelativeDate as formatDueDate } from '@/shared/utils/date';
