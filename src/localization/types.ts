// Localization type definitions
export type LocaleCode = 'nb' | 'en';

export interface DomainTranslations {
  [key: string]: string | DomainTranslations;
}

export interface LocaleTranslations {
  [domain: string]: DomainTranslations;
}

export interface TranslationParams {
  [key: string]: string | number | Date;
}

// Norwegian-specific types for compliance
export interface NorwegianAddress {
  street: string;
  postalCode: string;
  city: string;
  county?: string;
}

export interface NorwegianOrganization {
  name: string;
  orgNumber: string;
  address: NorwegianAddress;
  sector: 'private' | 'public' | 'municipal';
}

// Classification levels according to NSM
export type NSMClassification = 'ÅPEN' | 'BEGRENSET' | 'KONFIDENSIELT' | 'HEMMELIG';

export interface ComplianceMetadata {
  classification: NSMClassification;
  retention_period_years: number;
  gdpr_category: 'personal' | 'sensitive' | 'anonymous' | 'pseudonymized';
  access_log_required: boolean;
}