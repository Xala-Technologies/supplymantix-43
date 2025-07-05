// Localization provider with Norwegian-first approach
import React, { createContext, useContext, useState, useEffect } from 'react';
import { localizationService } from './localizationService';
import type { LocaleCode, DomainTranslations } from './types';

interface LocalizationContextType {
  currentLocale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
  t: (domain: string, key: string, params?: Record<string, any>) => string;
  formatDate: (date: Date | string) => string;
  formatNumber: (number: number) => string;
  formatCurrency: (amount: number) => string;
}

const LocalizationContext = createContext<LocalizationContextType | null>(null);

interface LocalizationProviderProps {
  children: React.ReactNode;
  defaultLocale?: LocaleCode;
}

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({
  children,
  defaultLocale = 'nb'
}) => {
  const [currentLocale, setCurrentLocale] = useState<LocaleCode>(defaultLocale);

  useEffect(() => {
    // Load saved locale preference or detect from browser
    const savedLocale = localStorage.getItem('xala-locale') as LocaleCode;
    const browserLocale = navigator.language.startsWith('no') ? 'nb' : 'en';
    
    setCurrentLocale(savedLocale || browserLocale || defaultLocale);
  }, [defaultLocale]);

  const setLocale = (locale: LocaleCode) => {
    setCurrentLocale(locale);
    localStorage.setItem('xala-locale', locale);
    
    // Update HTML lang attribute for accessibility
    document.documentElement.lang = locale;
  };

  const t = (domain: string, key: string, params?: Record<string, any>): string => {
    return localizationService.translate(domain, key, currentLocale, params);
  };

  const formatDate = (date: Date | string): string => {
    return localizationService.formatDate(date, currentLocale);
  };

  const formatNumber = (number: number): string => {
    return localizationService.formatNumber(number, currentLocale);
  };

  const formatCurrency = (amount: number): string => {
    return localizationService.formatCurrency(amount, currentLocale);
  };

  const value: LocalizationContextType = {
    currentLocale,
    setLocale,
    t,
    formatDate,
    formatNumber,
    formatCurrency
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within LocalizationProvider');
  }
  return context;
};

// Domain-specific translation hook
export const useDomainTranslation = (domain: string) => {
  const { t, currentLocale, formatDate, formatNumber, formatCurrency } = useLocalization();
  
  return {
    t: (key: string, params?: Record<string, any>) => t(domain, key, params),
    locale: currentLocale,
    formatDate,
    formatNumber,
    formatCurrency
  };
};