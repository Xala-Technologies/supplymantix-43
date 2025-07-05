// WCAG 2.2 AAA Accessibility utilities
export const accessibility = {
  // Color contrast utilities
  calculateContrast: (color1: string, color2: string): number => {
    const getLuminance = (color: string): number => {
      // Convert hex to RGB
      const rgb = color.match(/\w\w/g)?.map(x => parseInt(x, 16)) || [0, 0, 0];
      const [r, g, b] = rgb.map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    
    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  },
  
  // Check if contrast meets WCAG standards
  meetsContrastRequirement: (
    color1: string, 
    color2: string, 
    level: 'AA' | 'AAA' = 'AA',
    isLargeText: boolean = false
  ): boolean => {
    const contrast = accessibility.calculateContrast(color1, color2);
    
    if (level === 'AAA') {
      return isLargeText ? contrast >= 4.5 : contrast >= 7;
    } else {
      return isLargeText ? contrast >= 3 : contrast >= 4.5;
    }
  },
  
  // Focus management
  focusManagement: {
    // Trap focus within an element
    trapFocus: (element: HTMLElement): (() => void) => {
      const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      };
      
      element.addEventListener('keydown', handleTabKey);
      
      // Return cleanup function
      return () => {
        element.removeEventListener('keydown', handleTabKey);
      };
    },
    
    // Restore focus to previous element
    restoreFocus: (() => {
      let previouslyFocusedElement: HTMLElement | null = null;
      
      return {
        save: () => {
          previouslyFocusedElement = document.activeElement as HTMLElement;
        },
        restore: () => {
          if (previouslyFocusedElement) {
            previouslyFocusedElement.focus();
            previouslyFocusedElement = null;
          }
        },
      };
    })(),
  },
  
  // Screen reader utilities
  screenReader: {
    // Announce message to screen readers
    announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      const announcer = document.createElement('div');
      announcer.setAttribute('aria-live', priority);
      announcer.setAttribute('aria-atomic', 'true');
      announcer.setAttribute('class', 'sr-only');
      announcer.textContent = message;
      
      document.body.appendChild(announcer);
      
      // Remove after announcement
      setTimeout(() => {
        document.body.removeChild(announcer);
      }, 1000);
    },
    
    // Create visually hidden text for screen readers
    createScreenReaderText: (text: string): HTMLElement => {
      const span = document.createElement('span');
      span.textContent = text;
      span.className = 'sr-only';
      return span;
    },
  },
  
  // Keyboard navigation
  keyboard: {
    // Check if element is keyboard focusable
    isFocusable: (element: HTMLElement): boolean => {
      const focusableSelectors = [
        'button:not([disabled])',
        '[href]',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ];
      
      return focusableSelectors.some(selector => element.matches(selector));
    },
    
    // Handle escape key globally
    handleEscape: (callback: () => void): (() => void) => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          callback();
        }
      };
      
      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    },
  },
  
  // ARIA utilities
  aria: {
    // Generate unique IDs for ARIA attributes
    generateId: (prefix: string = 'aria'): string => {
      return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
    },
    
    // Associate label with control
    associateLabel: (control: HTMLElement, label: HTMLElement) => {
      const id = accessibility.aria.generateId('label');
      label.id = id;
      control.setAttribute('aria-labelledby', id);
    },
    
    // Associate description with control
    associateDescription: (control: HTMLElement, description: HTMLElement) => {
      const id = accessibility.aria.generateId('desc');
      description.id = id;
      control.setAttribute('aria-describedby', id);
    },
  },
  
  // Motion and animation preferences
  motion: {
    // Check if user prefers reduced motion
    prefersReducedMotion: (): boolean => {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },
    
    // Respect motion preferences in animations
    respectMotionPreferences: (animationConfig: any) => {
      if (accessibility.motion.prefersReducedMotion()) {
        return {
          ...animationConfig,
          duration: 0,
          transition: 'none',
        };
      }
      return animationConfig;
    },
  },
};