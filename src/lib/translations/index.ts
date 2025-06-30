
import { enTranslations } from './en';
import { frTranslations } from './fr';
import { noTranslations } from './no';

export const translations = {
  en: enTranslations,
  fr: frTranslations,
  no: noTranslations,
};

export type TranslationKeys = keyof typeof translations.en;
