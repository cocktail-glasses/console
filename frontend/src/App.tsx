import "reflect-metadata";

import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";

import { Provider as JProvider } from "jotai";
import { useAtomValue } from "jotai";

import "i18n/config.ts";
import i18n from "i18n/config.ts";

import ErrorBoundary from "@components/common/ErrorBoundary";
import "@lib/App/icons.ts";
import AppContainer from "@lib/AppContainer.tsx";
import ThemeProviderNexti18n from "@lib/ThemeProviderNexti18n.tsx";
import { theme } from "@lib/stores";
import themes, { getThemeName, usePrefersColorScheme } from "@lib/themes.ts";
import ErrorComponent from "@pages/Common/ErrorPage";
import store from "redux/stores/store.tsx";

// TODO: ccambno, unused
//import { Loader } from '@components/common';

// TODO: ccambno, unused
// const Landing = () => {
//   console.log('Loading...');
//   return <Loader title="Loading..." />
// }

function AppWithRedux(props: React.PropsWithChildren<{}>) {
  const getTheme = useAtomValue(theme);
  usePrefersColorScheme();
  let themeName = getTheme;
  if (!themeName) {
    themeName = getThemeName();
  }
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProviderNexti18n theme={themes[themeName]}>
        {props.children as React.ReactElement}
      </ThemeProviderNexti18n>
    </I18nextProvider>
  );
}

function App() {
  return (
    <ErrorBoundary fallback={<ErrorComponent />}>
      <Provider store={store}>
        <JProvider>
          <AppWithRedux>
            <AppContainer />
          </AppWithRedux>
        </JProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
