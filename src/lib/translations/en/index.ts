
import { navigationTranslations } from './navigation';
import { sidebarTranslations } from './sidebar';
import { authTranslations } from './auth';
import { landingTranslations } from './landing';
import { pagesTranslations } from './pages';
import { adminTranslations } from './admin';
import { commonTranslations } from './common';
import { languageTranslations } from './language';

export const enTranslations = {
  ...navigationTranslations,
  ...sidebarTranslations,
  ...authTranslations,
  ...landingTranslations,
  ...pagesTranslations,
  ...adminTranslations,
  ...commonTranslations,
  ...languageTranslations,
};
