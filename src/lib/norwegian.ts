// Norwegian-specific utilities and compliance
export const norwegian = {
  // Norwegian organizational number validation
  validateOrgNumber: (orgNumber: string): boolean => {
    const cleanOrgNumber = orgNumber.replace(/\s/g, '');
    if (!/^\d{9}$/.test(cleanOrgNumber)) return false;
    
    // Modulus 11 validation algorithm for Norwegian org numbers
    const weights = [3, 2, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    
    for (let i = 0; i < 8; i++) {
      sum += parseInt(cleanOrgNumber[i]) * weights[i];
    }
    
    const remainder = sum % 11;
    const checkDigit = remainder === 0 ? 0 : 11 - remainder;
    
    return checkDigit === parseInt(cleanOrgNumber[8]);
  },
  
  // Norwegian postal code validation
  validatePostalCode: (postalCode: string): boolean => {
    return /^\d{4}$/.test(postalCode);
  },
  
  // Norwegian bank account number validation
  validateBankAccount: (accountNumber: string): boolean => {
    const cleanAccount = accountNumber.replace(/\s/g, '');
    if (!/^\d{11}$/.test(cleanAccount)) return false;
    
    // Modulus 11 validation for Norwegian bank accounts
    const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanAccount[i]) * weights[i];
    }
    
    const remainder = sum % 11;
    const checkDigit = remainder === 0 ? 0 : remainder === 1 ? 11 : 11 - remainder;
    
    return checkDigit < 10 && checkDigit === parseInt(cleanAccount[10]);
  },
  
  // Norwegian phone number formatting
  formatPhoneNumber: (phone: string): string => {
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.startsWith('47')) {
      // International format
      return `+47 ${cleanPhone.slice(2, 5)} ${cleanPhone.slice(5, 7)} ${cleanPhone.slice(7)}`;
    } else if (cleanPhone.length === 8) {
      // Domestic format
      return `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 5)} ${cleanPhone.slice(5)}`;
    }
    
    return phone; // Return original if can't format
  },
  
  // Norwegian currency formatting
  formatCurrency: (amount: number): string => {
    return new Intl.NumberFormat('no-NO', {
      style: 'currency',
      currency: 'NOK',
    }).format(amount);
  },
  
  // Norwegian date formatting
  formatDate: (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('no-NO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(dateObj);
  },
  
  // Norwegian number formatting
  formatNumber: (number: number): string => {
    return new Intl.NumberFormat('no-NO').format(number);
  },
};

// NSM Security Classification System
export const NSM_CLASSIFICATION = {
  ÅPEN: 'ÅPEN',
  BEGRENSET: 'BEGRENSET',
  KONFIDENSIELT: 'KONFIDENSIELT',
  HEMMELIG: 'HEMMELIG',
} as const;

export type NSMClassification = typeof NSM_CLASSIFICATION[keyof typeof NSM_CLASSIFICATION];

export const getClassificationLevel = (classification: NSMClassification): number => {
  const levels = {
    [NSM_CLASSIFICATION.ÅPEN]: 1,
    [NSM_CLASSIFICATION.BEGRENSET]: 2,
    [NSM_CLASSIFICATION.KONFIDENSIELT]: 3,
    [NSM_CLASSIFICATION.HEMMELIG]: 4,
  };
  return levels[classification];
};

export const canAccessClassification = (
  userClearance: NSMClassification,
  dataClassification: NSMClassification
): boolean => {
  return getClassificationLevel(userClearance) >= getClassificationLevel(dataClassification);
};

// GDPR Compliance utilities
export const gdpr = {
  // Data retention periods (in days)
  RETENTION_PERIODS: {
    USER_DATA: 2555, // 7 years
    TRANSACTION_DATA: 2555, // 7 years
    LOG_DATA: 90, // 3 months
    TEMPORARY_DATA: 30, // 1 month
  },
  
  // Data processing lawful bases
  LAWFUL_BASIS: {
    CONSENT: 'consent',
    CONTRACT: 'contract',
    LEGAL_OBLIGATION: 'legal_obligation',
    VITAL_INTERESTS: 'vital_interests',
    PUBLIC_TASK: 'public_task',
    LEGITIMATE_INTERESTS: 'legitimate_interests',
  } as const,
  
  // Check if data should be retained
  shouldRetainData: (createdAt: Date, dataType: keyof typeof gdpr.RETENTION_PERIODS): boolean => {
    const retentionDays = gdpr.RETENTION_PERIODS[dataType];
    const daysSinceCreation = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceCreation < retentionDays;
  },
  
  // Anonymize personal data
  anonymizeData: <T extends Record<string, any>>(
    data: T,
    fieldsToAnonymize: (keyof T)[]
  ): T => {
    const anonymized = { ...data };
    
    fieldsToAnonymize.forEach(field => {
      if (typeof anonymized[field] === 'string') {
        anonymized[field] = '[ANONYMIZED]' as T[keyof T];
      } else {
        anonymized[field] = null as T[keyof T];
      }
    });
    
    return anonymized;
  },
};

// Norwegian holiday calendar
export const norwegianHolidays = {
  // Fixed holidays
  getFixedHolidays: (year: number): Date[] => [
    new Date(year, 0, 1),   // New Year's Day
    new Date(year, 4, 1),   // Labour Day
    new Date(year, 4, 17),  // Constitution Day
    new Date(year, 11, 25), // Christmas Day
    new Date(year, 11, 26), // Boxing Day
  ],
  
  // Check if date is a Norwegian holiday
  isHoliday: (date: Date): boolean => {
    const year = date.getFullYear();
    const fixedHolidays = norwegianHolidays.getFixedHolidays(year);
    
    return fixedHolidays.some(holiday => 
      holiday.getTime() === date.getTime()
    );
  },
  
  // Get next working day (excluding weekends and holidays)
  getNextWorkingDay: (date: Date): Date => {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    
    // Skip weekends
    while (nextDay.getDay() === 0 || nextDay.getDay() === 6) {
      nextDay.setDate(nextDay.getDate() + 1);
    }
    
    // Skip holidays
    while (norwegianHolidays.isHoliday(nextDay)) {
      nextDay.setDate(nextDay.getDate() + 1);
      // Check weekends again after skipping holiday
      while (nextDay.getDay() === 0 || nextDay.getDay() === 6) {
        nextDay.setDate(nextDay.getDate() + 1);
      }
    }
    
    return nextDay;
  },
};