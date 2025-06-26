
import { procedureApi } from './procedures/api';
import { executionApi } from './procedures/executions';
import { templateApi } from './procedures/templates';

// Export types
export * from './procedures/types';

// Combine all APIs into a single interface
export const proceduresEnhancedApi = {
  ...procedureApi,
  ...executionApi,
  ...templateApi
};
