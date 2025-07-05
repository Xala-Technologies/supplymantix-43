// Caching utilities
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class MemoryCache {
  private cache = new Map<string, CacheItem<any>>();
  
  set<T>(key: string, data: T, ttlMinutes: number = 5): void {
    const ttl = ttlMinutes * 60 * 1000; // Convert to milliseconds
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }
  
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  delete(key: string): void {
    this.cache.delete(key);
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  keys(): string[] {
    return Array.from(this.cache.keys());
  }
  
  size(): number {
    return this.cache.size;
  }
  
  // Clean up expired items
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Global cache instance
export const memoryCache = new MemoryCache();

// Local storage cache with expiration
export const localStorageCache = {
  set: <T>(key: string, data: T, ttlMinutes: number = 60): void => {
    const item = {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000,
    };
    
    try {
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  },
  
  get: <T>(key: string): T | null => {
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;
      
      const item = JSON.parse(itemStr);
      
      // Check if item has expired
      if (Date.now() - item.timestamp > item.ttl) {
        localStorage.removeItem(key);
        return null;
      }
      
      return item.data;
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return null;
    }
  },
  
  delete: (key: string): void => {
    localStorage.removeItem(key);
  },
  
  clear: (): void => {
    localStorage.clear();
  },
};

// Cache key generators
export const cacheKeys = {
  user: (userId: string) => `user:${userId}`,
  workOrder: (id: string) => `work_order:${id}`,
  asset: (id: string) => `asset:${id}`,
  inventory: (id: string) => `inventory:${id}`,
  tenant: (tenantId: string) => `tenant:${tenantId}`,
  list: (entityType: string, filters: Record<string, any>) => 
    `${entityType}:list:${JSON.stringify(filters)}`,
};

// Automatic cleanup interval (run every 5 minutes)
if (typeof window !== 'undefined') {
  setInterval(() => {
    memoryCache.cleanup();
  }, 5 * 60 * 1000);
}