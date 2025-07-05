// Testing utilities
export const testUtils = {
  // Mock data generators
  generators: {
    // Generate test user data
    user: (overrides: Partial<any> = {}) => ({
      id: `user-${Date.now()}`,
      email: `test-${Date.now()}@example.com`,
      firstName: 'Test',
      lastName: 'User',
      createdAt: new Date().toISOString(),
      ...overrides,
    }),
    
    // Generate test work order data
    workOrder: (overrides: Partial<any> = {}) => ({
      id: `wo-${Date.now()}`,
      title: `Test Work Order ${Date.now()}`,
      description: 'Test description',
      status: 'open',
      priority: 'medium',
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      ...overrides,
    }),
    
    // Generate test asset data
    asset: (overrides: Partial<any> = {}) => ({
      id: `asset-${Date.now()}`,
      name: `Test Asset ${Date.now()}`,
      description: 'Test asset description',
      status: 'active',
      location: 'Test Location',
      createdAt: new Date().toISOString(),
      ...overrides,
    }),
    
    // Generate test inventory item data
    inventoryItem: (overrides: Partial<any> = {}) => ({
      id: `inv-${Date.now()}`,
      name: `Test Item ${Date.now()}`,
      description: 'Test inventory item',
      quantity: 10,
      unitPrice: 99.99,
      reorderLevel: 5,
      status: 'in_stock',
      createdAt: new Date().toISOString(),
      ...overrides,
    }),
  },
  
  // Test data cleanup
  cleanup: {
    // Clear all localStorage data
    clearLocalStorage: () => {
      if (typeof window !== 'undefined') {
        window.localStorage.clear();
      }
    },
    
    // Clear all sessionStorage data
    clearSessionStorage: () => {
      if (typeof window !== 'undefined') {
        window.sessionStorage.clear();
      }
    },
    
    // Reset DOM to clean state
    resetDOM: () => {
      if (typeof document !== 'undefined') {
        // Remove any dynamically added elements
        const dynamicElements = document.querySelectorAll('[data-testid]');
        dynamicElements.forEach(el => el.remove());
        
        // Reset body classes
        document.body.className = '';
      }
    },
  },
  
  // Async utilities for testing
  async: {
    // Wait for element to appear
    waitForElement: (selector: string, timeout: number = 5000): Promise<Element> => {
      return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
          return;
        }
        
        const observer = new MutationObserver(() => {
          const element = document.querySelector(selector);
          if (element) {
            observer.disconnect();
            resolve(element);
          }
        });
        
        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });
        
        setTimeout(() => {
          observer.disconnect();
          reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        }, timeout);
      });
    },
    
    // Wait for condition to be true
    waitForCondition: (
      condition: () => boolean, 
      timeout: number = 5000
    ): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (condition()) {
          resolve();
          return;
        }
        
        const interval = setInterval(() => {
          if (condition()) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
        
        setTimeout(() => {
          clearInterval(interval);
          reject(new Error(`Condition not met within ${timeout}ms`));
        }, timeout);
      });
    },
    
    // Simulate async delay
    delay: (ms: number): Promise<void> => {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
  },
  
  // Event simulation utilities
  events: {
    // Simulate click event
    click: (element: HTMLElement) => {
      element.click();
      element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    },
    
    // Simulate input change
    changeInput: (input: HTMLInputElement, value: string) => {
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    },
    
    // Simulate keyboard event
    keyboard: (element: HTMLElement, key: string, options: KeyboardEventInit = {}) => {
      element.dispatchEvent(new KeyboardEvent('keydown', { 
        key, 
        bubbles: true,
        ...options 
      }));
      element.dispatchEvent(new KeyboardEvent('keyup', { 
        key, 
        bubbles: true,
        ...options 
      }));
    },
    
    // Simulate form submission
    submitForm: (form: HTMLFormElement) => {
      form.dispatchEvent(new Event('submit', { bubbles: true }));
    },
  },
  
  // Accessibility testing helpers
  a11y: {
    // Check if element has proper ARIA labels
    hasAriaLabel: (element: HTMLElement): boolean => {
      return !!(
        element.getAttribute('aria-label') ||
        element.getAttribute('aria-labelledby') ||
        element.querySelector('label')
      );
    },
    
    // Check if interactive element is focusable
    isFocusable: (element: HTMLElement): boolean => {
      const tabIndex = element.getAttribute('tabindex');
      return tabIndex !== '-1' && !element.hasAttribute('disabled');
    },
    
    // Get all focusable elements within container
    getFocusableElements: (container: HTMLElement): HTMLElement[] => {
      const selector = [
        'button:not([disabled])',
        '[href]',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ].join(', ');
      
      return Array.from(container.querySelectorAll(selector));
    },
  },
};