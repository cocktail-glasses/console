import { initReactI18next } from 'react-i18next';

import sharedConfig from './i18nextSharedConfig.mjs';

// import enGlossary from './locales/en/glossary.json';
// import enTranslation from './locales/en/translation.json';
// import koGlossary from './locales/ko/glossary.json';
// import koTranslation from './locales/ko/translation.json';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const en = {}; // To keep TS happy.

export const supportedLanguages: { [langCode: string]: string } = {
  en: 'English',
  // es: 'Español',
  // fr: 'Français',
  // pt: 'Português',
  // de: 'Deutsch',
  ko: '한국어',
};

i18next
  // detect user language https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  .use(initReactI18next)
  // Use dynamic imports (webpack code splitting) to load javascript bundles.
  // @see https://www.i18next.com/misc/creating-own-plugins#backend
  // @see https://webpack.js.org/guides/code-splitting/
  .use({
    type: 'backend',
    read<Namespace extends keyof typeof en>(
      language: string | any,
      namespace: Namespace,
      callback: (errorValue: unknown, translations: null | (typeof en)[Namespace]) => void
    ) {
      import(`./locales/${language}/${namespace}.json?import=default`)
        .then((resources) => {
          callback(null, resources.default);
        })
        .catch((error) => {
          callback(error, null);
        });
    },
  })
  // i18next options: https://www.i18next.com/overview/configuration-options
  .init({
    debug: import.meta.env.DEV && !import.meta.env.UNDER_TEST,
    ns: ['translation', 'glossary'],
    defaultNS: 'translation',
    fallbackLng: 'en',
    contextSeparator: sharedConfig.contextSeparator,
    supportedLngs: Object.keys(supportedLanguages),
    // resources: {
    //   en: { translation: enTranslation, glossary: enGlossary },
    //   ko: { translation: koTranslation, glossary: koGlossary },
    // },
    // nonExplicitSupportedLngs: true,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
      format: function (value, format, lng) {
        // https://www.i18next.com/translation-function/formatting
        if (format === 'number') return new Intl.NumberFormat(lng).format(value);
        if (format === 'date') return new Intl.DateTimeFormat(lng).format(value);
        return value;
      },
    },
    returnEmptyString: false,
    // https://react.i18next.com/latest/i18next-instance
    // https://www.i18next.com/overview/configuration-options
    react: {
      useSuspense: false, // not needed as we cannot use suspend due to issues with Storybook
    },
    nsSeparator: '|',
    keySeparator: false,
  });

export default i18next;
