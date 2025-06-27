
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface DataLoaderOptions {
  retryAttempts?: number;
  retryDelay?: number;
  showErrorToast?: boolean;
  cacheKey?: string;
  cacheDuration?: number;
}

interface DataLoaderState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  lastFetch: Date | null;
  retryCount: number;
}

// Simple in-memory cache
const dataCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

export const useDataLoader = <T>(
  fetchFunction: () => Promise<T>,
  dependencies: any[] = [],
  options: DataLoaderOptions = {}
) => {
  const {
    retryAttempts = 3,
    retryDelay = 1000,
    showErrorToast = true,
    cacheKey,
    cacheDuration = 5 * 60 * 1000 // 5 minutes default
  } = options;

  const [state, setState] = useState<DataLoaderState<T>>({
    data: null,
    isLoading: false,
    error: null,
    lastFetch: null,
    retryCount: 0
  });

  // Check cache first
  const getCachedData = useCallback(() => {
    if (!cacheKey) return null;
    
    const cached = dataCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      console.log(`Cache hit for ${cacheKey}`);
      return cached.data;
    }
    
    return null;
  }, [cacheKey]);

  // Set cache
  const setCachedData = useCallback((data: T) => {
    if (!cacheKey) return;
    
    dataCache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl: cacheDuration
    });
    console.log(`Data cached for ${cacheKey}`);
  }, [cacheKey, cacheDuration]);

  const fetchData = useCallback(async (attempt = 0) => {
    console.log(`Fetching data (attempt ${attempt + 1}/${retryAttempts + 1})`);
    
    // Check cache first
    const cachedData = getCachedData();
    if (cachedData && attempt === 0) {
      setState(prev => ({ 
        ...prev, 
        data: cachedData, 
        isLoading: false,
        error: null 
      }));
      return;
    }

    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null,
      retryCount: attempt 
    }));

    try {
      const result = await fetchFunction();
      console.log('Data fetch successful:', result);
      
      // Cache the result
      setCachedData(result);
      
      setState(prev => ({
        ...prev,
        data: result,
        isLoading: false,
        error: null,
        lastFetch: new Date(),
        retryCount: 0
      }));
    } catch (error) {
      console.error('Data fetch error:', error);
      
      const errorObj = error instanceof Error ? error : new Error('Unknown error occurred');
      
      if (attempt < retryAttempts) {
        console.log(`Retrying in ${retryDelay}ms...`);
        setTimeout(() => {
          fetchData(attempt + 1);
        }, retryDelay * Math.pow(2, attempt)); // Exponential backoff
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorObj,
          retryCount: attempt
        }));
        
        if (showErrorToast) {
          toast.error(`Failed to load data: ${errorObj.message}`);
        }
      }
    }
  }, [fetchFunction, retryAttempts, retryDelay, showErrorToast, getCachedData, setCachedData]);

  const refetch = useCallback(() => {
    // Clear cache on manual refetch
    if (cacheKey) {
      dataCache.delete(cacheKey);
    }
    fetchData(0);
  }, [fetchData, cacheKey]);

  useEffect(() => {
    fetchData(0);
  }, dependencies);

  return {
    ...state,
    refetch,
    isRetrying: state.retryCount > 0
  };
};
