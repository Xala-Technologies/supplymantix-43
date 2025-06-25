
// Common shared types across the application
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
  tenant_id: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FilterState {
  search: string;
  status?: string;
  category?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: LoadingState;
  error: string | null;
}
