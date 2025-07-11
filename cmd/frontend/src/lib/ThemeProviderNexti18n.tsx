import { ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { deDE, enUS, esES, frFR, hiIN, koKR, ptPT } from '@mui/material/locale';
import { createTheme, StyledEngineProvider, Theme, ThemeProvider } from '@mui/material/styles';

import { Loader } from '../components/common';

function getLocale(locale: string): typeof enUS {
  const LOCALES = {
    en: enUS,
    // pt: ptPT,
    // es: esES,
    // de: deDE,
    // ta: enUS, // @todo: material ui needs a translation for this.
    // hi: hiIN,
    // fr: frFR,
    ko: koKR,
  };
  // type LocalesType = 'en' | 'pt' | 'es' | 'ta' | 'de' | 'hi' | 'fr' | 'ko';
  type LocalesType = 'en' | 'ko';
  return locale in LOCALES ? LOCALES[locale as LocalesType] : LOCALES['en'];
}

/** Like a ThemeProvider but uses reacti18next for the language selection
 *  Because Material UI is localized as well.
 */
const ThemeProviderNexti18n: React.FunctionComponent<{ theme: Theme; children: ReactElement }> = (props) => {
  const { i18n, ready: isI18nReady } = useTranslation(['translation', 'glossary'], {
    useSuspense: false,
  });
  const [lang, setLang] = useState(i18n.language);

  function changeLang(lng: string) {
    if (lng) {
      document.documentElement.lang = lng;
      document.body.dir = i18n.dir();
      setLang(lng);
    }
  }

  useEffect(() => {
    i18n.on('languageChanged', changeLang);
    if (i18n.language) {
      // Set the lang when the page loads too.
      changeLang(i18n.language);
    }
    return () => {
      i18n.off('languageChanged', changeLang);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const theme = createTheme(props.theme, getLocale(lang));

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>{!!isI18nReady ? props.children : <Loader title="Loading..." />}</ThemeProvider>
    </StyledEngineProvider>
  );
};

export default ThemeProviderNexti18n;
