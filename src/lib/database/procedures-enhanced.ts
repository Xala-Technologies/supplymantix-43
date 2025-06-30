
import { coreApi } from './procedures/core-api';
import { executionsApi } from './procedures/executions-api';
import { executionApi } from './procedures/executions';
import { templateApi } from './procedures/templates';

// Export types
export * from './procedures/types';

// Combine all APIs into a single interface
export const proceduresEnhancedApi = {
  ...coreApi,
  ...executionsApi,
  ...executionApi,
  ...templateApi
};
