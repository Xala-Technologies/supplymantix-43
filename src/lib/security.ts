// Security utilities
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

export const sanitizeObject = <T extends Record<string, any>>(obj: T): T => {
  const sanitized = {} as T;
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key as keyof T] = sanitizeInput(value) as T[keyof T];
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key as keyof T] = sanitizeObject(value);
    } else {
      sanitized[key as keyof T] = value;
    }
  }
  
  return sanitized;
};

// Role-based access control
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ORGANIZATION_ADMIN: 'organization_admin',
  USER: 'user',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const hasPermission = (userRole: Role, requiredRole: Role): boolean => {
  const roleHierarchy: Record<Role, number> = {
    [ROLES.SUPER_ADMIN]: 3,
    [ROLES.ORGANIZATION_ADMIN]: 2,
    [ROLES.USER]: 1,
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

// Data encryption utilities (for sensitive data)
export const maskEmail = (email: string): string => {
  const [username, domain] = email.split('@');
  if (username.length <= 2) return email;
  
  const maskedUsername = username[0] + '*'.repeat(username.length - 2) + username[username.length - 1];
  return `${maskedUsername}@${domain}`;
};

export const maskPhone = (phone: string): string => {
  if (phone.length <= 4) return phone;
  return phone.slice(0, -4).replace(/\d/g, '*') + phone.slice(-4);
};

// Input validation
export const validateInput = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  phone: (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  },
  
  norwegianOrgNumber: (orgNumber: string): boolean => {
    const orgNumberRegex = /^\d{9}$/;
    return orgNumberRegex.test(orgNumber);
  },
  
  norwegianPostalCode: (postalCode: string): boolean => {
    const postalCodeRegex = /^\d{4}$/;
    return postalCodeRegex.test(postalCode);
  },
};