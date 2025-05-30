import 'reflect-metadata';

import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';

import { Provider as JProvider } from 'jotai';
import { useAtomValue } from 'jotai';
import { DevTools } from 'jotai-devtools';
import 'jotai-devtools/styles.css';

import './i18n/config';
import i18n from './i18n/config';
import store from './redux/stores/store';

import ErrorBoundary from '@components/common/ErrorBoundary';
import '@lib/App/icons';
import '@lib/App/icons';
import AppContainer from '@lib/AppContainer';
import ThemeProviderNexti18n from '@lib/ThemeProviderNexti18n';
import { theme } from '@lib/stores';
import themes, { getThemeName } from '@lib/themes';
import ErrorComponent from '@pages/Common/ErrorPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// TODO: ccambno, unused
//import { Loader } from '@components/common';

// TODO: ccambno, unused
// const Landing = () => {
//   console.log('Loading...');
//   return <Loader title="Loading..." />
// }

function AppWithRedux(props: React.PropsWithChildren<{}>) {
  const getTheme = useAtomValue(theme);
  // usePrefersColorScheme();
  let themeName = getTheme;
  if (!themeName) {
    themeName = getThemeName();
  }
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProviderNexti18n theme={themes[themeName]}>{props.children as React.ReactElement}</ThemeProviderNexti18n>
    </I18nextProvider>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3 * 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary fallback={(props: { error: Error }) => <ErrorComponent error={props.error} />}>
      <Provider store={store}>
        <JProvider>
          <DevTools position="bottom-right" />
          <QueryClientProvider client={queryClient}>
            <AppWithRedux>
              <AppContainer />
            </AppWithRedux>
            <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-right" />
          </QueryClientProvider>
        </JProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
