// API utilities and configuration
import { supabase } from '@/integrations/supabase/client';
import { AppError, AuthenticationError, AuthorizationError, NotFoundError } from './errors';

export interface ApiResponse<T> {
  data: T | null;
  error: AppError | null;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API response wrapper
export const createApiResponse = <T>(
  data: T | null,
  error: AppError | null = null
): ApiResponse<T> => ({
  data,
  error,
  success: !error,
});

// Error handling for API responses
export const handleApiError = (error: any): AppError => {
  if (error?.code === 'PGRST301') {
    return new NotFoundError();
  }
  
  if (error?.code === '42501' || error?.message?.includes('permission denied')) {
    return new AuthorizationError();
  }
  
  if (error?.code === 'PGRST116' || error?.message?.includes('JWT expired')) {
    return new AuthenticationError('Session expired');
  }
  
  return new AppError(
    error?.message || 'An error occurred',
    error?.code || 'API_ERROR',
    error?.status || 500
  );
};

// Generic API request wrapper
export const apiRequest = async <T>(
  operation: () => Promise<{ data: T; error: any }>
): Promise<ApiResponse<T>> => {
  try {
    const { data, error } = await operation();
    
    if (error) {
      return createApiResponse(null, handleApiError(error));
    }
    
    return createApiResponse(data);
  } catch (error) {
    return createApiResponse(null, handleApiError(error));
  }
};

// Supabase query builder with error handling
export const createSupabaseQuery = <T = any>(tableName: string) => ({
  select: (columns: string = '*') => 
    (supabase as any).from(tableName).select(columns),
  
  insert: (data: Partial<T>) => 
    (supabase as any).from(tableName).insert(data),
  
  update: (data: Partial<T>) => 
    (supabase as any).from(tableName).update(data),
  
  delete: () => 
    (supabase as any).from(tableName).delete(),
});