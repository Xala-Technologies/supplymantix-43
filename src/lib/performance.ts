// Performance monitoring utilities
export const performanceLogger = {
  startTimer: (label: string): (() => void) => {
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      const duration = end - start;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
      }
      
      // Send to analytics in production
      if (process.env.NODE_ENV === 'production' && duration > 1000) {
        // Report slow operations
        console.warn(`Slow operation detected: ${label} took ${duration.toFixed(2)}ms`);
      }
    };
  },
  
  measureAsync: async <T>(
    label: string,
    operation: () => Promise<T>
  ): Promise<T> => {
    const endTimer = performanceLogger.startTimer(label);
    try {
      const result = await operation();
      endTimer();
      return result;
    } catch (error) {
      endTimer();
      throw error;
    }
  },
};

// Memory usage monitoring
export const memoryMonitor = {
  getMemoryUsage: () => {
    if ('memory' in performance) {
      return {
        used: Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round((performance as any).memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round((performance as any).memory.jsHeapSizeLimit / 1024 / 1024),
      };
    }
    return null;
  },
  
  logMemoryUsage: (label: string) => {
    const usage = memoryMonitor.getMemoryUsage();
    if (usage && process.env.NODE_ENV === 'development') {
      console.log(`🧠 ${label} - Memory: ${usage.used}MB / ${usage.total}MB (limit: ${usage.limit}MB)`);
    }
  },
};

// Bundle size analyzer
export const bundleAnalyzer = {
  trackComponentLoad: (componentName: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`📦 Component loaded: ${componentName}`);
    }
  },
  
  trackLazyLoad: (routeName: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 Route loaded: ${routeName}`);
    }
  },
};