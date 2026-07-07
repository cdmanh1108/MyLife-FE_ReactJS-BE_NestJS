import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { DEFAULT_LANGUAGE } from '@/shared/constants/languages';
import { storage } from '@/shared/lib/storage';
import vi from './locales/vi.json';
import en from './locales/en.json';
import ko from './locales/ko.json';

const savedLang = storage.get<string>('language') ?? DEFAULT_LANGUAGE;

i18n
  .use(initReactI18next)
  .init({
    resources: {
      vi: { translation: vi },
      en: { translation: en },
      ko: { translation: ko },
    },
    lng: savedLang,
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: { escapeValue: false },
  });

export default i18n;
