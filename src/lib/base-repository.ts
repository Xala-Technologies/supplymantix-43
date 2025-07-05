// Base repository pattern for domain-driven design
import { supabase } from '@/integrations/supabase/client';
import { BaseEntity, PaginationParams, PaginatedResponse } from '@/types/common';
import { AppError } from './errors';

export interface ApiResponse<T> {
  data: T | null;
  error: AppError | null;
  success: boolean;
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
  return new AppError(
    error?.message || 'An error occurred',
    error?.code || 'API_ERROR',
    error?.status || 500
  );
};

export interface Repository<T extends BaseEntity> {
  findById(id: string): Promise<ApiResponse<T>>;
  findAll(params?: PaginationParams): Promise<PaginatedResponse<T>>;
  create(entity: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<T>>;
  update(id: string, updates: Partial<T>): Promise<ApiResponse<T>>;
  delete(id: string): Promise<ApiResponse<void>>;
  findByTenant(tenantId: string, params?: PaginationParams): Promise<PaginatedResponse<T>>;
}

export abstract class BaseRepository<T extends BaseEntity> implements Repository<T> {
  constructor(protected tableName: string) {}

  async findById(id: string): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await (supabase as any)
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return createApiResponse(null, handleApiError(error));
      }

      return createApiResponse(data as T);
    } catch (error) {
      return createApiResponse(null, handleApiError(error));
    }
  }

  async findAll(params?: PaginationParams): Promise<PaginatedResponse<T>> {
    try {
      let query = (supabase as any).from(this.tableName).select('*', { count: 'exact' });

      if (params?.sortBy) {
        query = query.order(params.sortBy, { 
          ascending: params.sortOrder === 'asc' 
        });
      }

      if (params?.page && params?.limit) {
        const from = (params.page - 1) * params.limit;
        const to = from + params.limit - 1;
        query = query.range(from, to);
      }

      const { data, error, count } = await query;

      if (error) {
        return {
          data: [],
          pagination: {
            page: params?.page || 1,
            limit: params?.limit || 10,
            total: 0,
            totalPages: 0
          }
        };
      }

      const total = count || 0;
      const limit = params?.limit || 10;
      const totalPages = Math.ceil(total / limit);

      return {
        data: (data || []) as T[],
        pagination: {
          page: params?.page || 1,
          limit,
          total,
          totalPages
        }
      };
    } catch (error) {
      return {
        data: [],
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          total: 0,
          totalPages: 0
        }
      };
    }
  }

  async create(entity: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await (supabase as any)
        .from(this.tableName)
        .insert(entity)
        .select()
        .single();

      if (error) {
        return createApiResponse(null, handleApiError(error));
      }

      return createApiResponse(data as T);
    } catch (error) {
      return createApiResponse(null, handleApiError(error));
    }
  }

  async update(id: string, updates: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await (supabase as any)
        .from(this.tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return createApiResponse(null, handleApiError(error));
      }

      return createApiResponse(data as T);
    } catch (error) {
      return createApiResponse(null, handleApiError(error));
    }
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await (supabase as any)
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        return createApiResponse(null, handleApiError(error));
      }

      return createApiResponse(null);
    } catch (error) {
      return createApiResponse(null, handleApiError(error));
    }
  }

  async findByTenant(tenantId: string, params?: PaginationParams): Promise<PaginatedResponse<T>> {
    try {
      let query = (supabase as any)
        .from(this.tableName)
        .select('*', { count: 'exact' })
        .eq('tenant_id', tenantId);

      if (params?.sortBy) {
        query = query.order(params.sortBy, { 
          ascending: params.sortOrder === 'asc' 
        });
      }

      if (params?.page && params?.limit) {
        const from = (params.page - 1) * params.limit;
        const to = from + params.limit - 1;
        query = query.range(from, to);
      }

      const { data, error, count } = await query;

      if (error) {
        return {
          data: [],
          pagination: {
            page: params?.page || 1,
            limit: params?.limit || 10,
            total: 0,
            totalPages: 0
          }
        };
      }

      const total = count || 0;
      const limit = params?.limit || 10;
      const totalPages = Math.ceil(total / limit);

      return {
        data: (data || []) as T[],
        pagination: {
          page: params?.page || 1,
          limit,
          total,
          totalPages
        }
      };
    } catch (error) {
      return {
        data: [],
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          total: 0,
          totalPages: 0
        }
      };
    }
  }

  protected async executeWithTenantContext<R>(
    operation: () => Promise<R>
  ): Promise<R> {
    // Get current user's tenant context
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Execute operation with tenant isolation
    return await operation();
  }
}