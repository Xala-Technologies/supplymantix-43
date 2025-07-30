import { useMemo } from 'react';
import { sanitizeInput, sanitizeObject } from '@/lib/security';

export const useSecureForm = () => {
  const secureFormHandlers = useMemo(() => ({
    sanitizeInput: (input: string) => sanitizeInput(input),
    sanitizeObject: <T extends Record<string, any>>(obj: T): T => sanitizeObject(obj),
    
    createSecureHandler: <T extends Record<string, any>>(
      handler: (data: T) => void | Promise<void>
    ) => {
      return (data: T) => {
        const sanitizedData = sanitizeObject(data);
        return handler(sanitizedData);
      };
    },

    validateAndSanitize: <T extends Record<string, any>>(
      data: T,
      validator?: (data: T) => boolean
    ): { isValid: boolean; sanitizedData: T; errors?: string[] } => {
      const sanitizedData = sanitizeObject(data);
      const errors: string[] = [];
      
      // Basic validation checks
      for (const [key, value] of Object.entries(sanitizedData)) {
        if (typeof value === 'string') {
          if (value !== data[key as keyof T]) {
            errors.push(`${key} contains potentially unsafe content that was sanitized`);
          }
        }
      }
      
      const isValid = validator ? validator(sanitizedData) : errors.length === 0;
      
      return {
        isValid,
        sanitizedData,
        errors: errors.length > 0 ? errors : undefined
      };
    }
  }), []);

  return secureFormHandlers;
};