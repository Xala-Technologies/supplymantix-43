// Core localization service with Norwegian-first approach
import type { LocaleCode, DomainTranslations, TranslationParams } from './types';

// Import domain translations
import commonNb from './domains/common/nb.json';
import commonEn from './domains/common/en.json';
import workOrdersNb from './domains/work-orders/nb.json';
import workOrdersEn from './domains/work-orders/en.json';
import assetsNb from './domains/assets/nb.json';
import assetsEn from './domains/assets/en.json';
import inventoryNb from './domains/inventory/nb.json';
import inventoryEn from './domains/inventory/en.json';
import authNb from './domains/auth/nb.json';
import authEn from './domains/auth/en.json';
import licensingNb from './domains/licensing/nb.json';
import licensingEn from './domains/licensing/en.json';

class LocalizationService {
  private translations = {
    nb: {
      common: commonNb,
      'work-orders': workOrdersNb,
      assets: assetsNb,
      inventory: inventoryNb,
      auth: authNb,
      licensing: licensingNb,
    },
    en: {
      common: commonEn,
      'work-orders': workOrdersEn,
      assets: assetsEn,
      inventory: inventoryEn,
      auth: authEn,
      licensing: licensingEn,
    }
  };

  translate(
    domain: string, 
    key: string, 
    locale: LocaleCode, 
    params?: TranslationParams
  ): string {
    // Fallback chain: domain-specific → common → key
    const domainTranslations = this.translations[locale]?.[domain];
    const commonTranslations = this.translations[locale]?.common;
    
    let translation = this.getNestedTranslation(domainTranslations, key) ||
                     this.getNestedTranslation(commonTranslations, key);

    // If not found in current locale, try Norwegian fallback
    if (!translation && locale !== 'nb') {
      const nbDomainTranslations = this.translations.nb[domain];
      const nbCommonTranslations = this.translations.nb.common;
      
      translation = this.getNestedTranslation(nbDomainTranslations, key) ||
                   this.getNestedTranslation(nbCommonTranslations, key);
    }

    // Final fallback: return the key
    if (!translation) {
      console.warn(`Translation missing: ${domain}.${key} for locale ${locale}`);
      return key;
    }

    // Apply parameters if provided
    if (params) {
      return this.interpolateParams(translation, params);
    }

    return translation;
  }

  private getNestedTranslation(translations: DomainTranslations | undefined, key: string): string | undefined {
    if (!translations) return undefined;

    const keys = key.split('.');
    let current: any = translations;

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        return undefined;
      }
    }

    return typeof current === 'string' ? current : undefined;
  }

  private interpolateParams(translation: string, params: TranslationParams): string {
    return translation.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      const value = params[key];
      if (value !== undefined) {
        if (value instanceof Date) {
          return value.toLocaleDateString('nb-NO');
        }
        return String(value);
      }
      return match;
    });
  }

  formatDate(date: Date | string, locale: LocaleCode): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const localeCode = locale === 'nb' ? 'nb-NO' : 'en-US';
    
    return dateObj.toLocaleDateString(localeCode, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  formatNumber(number: number, locale: LocaleCode): string {
    const localeCode = locale === 'nb' ? 'nb-NO' : 'en-US';
    return number.toLocaleString(localeCode);
  }

  formatCurrency(amount: number, locale: LocaleCode): string {
    const localeCode = locale === 'nb' ? 'nb-NO' : 'en-US';
    const currency = locale === 'nb' ? 'NOK' : 'USD';
    
    return amount.toLocaleString(localeCode, {
      style: 'currency',
      currency
    });
  }

  // Norwegian-specific formatters
  formatNorwegianOrgNumber(orgNumber: string): string {
    // Format: XXX XXX XXX
    return orgNumber.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  }

  formatNorwegianPostalCode(postalCode: string): string {
    // Format: XXXX
    return postalCode.padStart(4, '0');
  }

  formatNorwegianBankAccount(accountNumber: string): string {
    // Format: XXXX.XX.XXXXX
    return accountNumber.replace(/(\d{4})(\d{2})(\d{5})/, '$1.$2.$3');
  }
}

export const localizationService = new LocalizationService();