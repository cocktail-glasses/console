// import VersionDialog from '@lib/App/VersionDialog';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

import { useAtomValue } from 'jotai';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

import ErrorBoundary from '@components/common/ErrorBoundary';
import DetailsDrawer from '@components/common/Resource/DetailsDrawer';
// import ActionsNotifier from '@components/common/ActionsNotifier';
// import AlertNotification from '@components/common/AlertNotification';
import Sidebar, { NavigationTabs } from '@lib/Layout/Sidebar';
import TopBar from '@lib/Layout/TopBar';
import { additionalLayoutStyle } from '@lib/stores/layout';
import ErrorComponent from '@pages/Common/ErrorPage';

const Div = styled('div')``;
const Main = styled('main')``;

export default function Layout() {
  const theme = useTheme();

  const defaultStyle = {
    flexGrow: 1,
    marginLeft: 'initial',
    overflowX: 'hidden',
    overflowY: 'auto',
    paddingBottom: '100px',
  };
  const additionalStyle = useAtomValue(additionalLayoutStyle);

  return (
    <Box
      id="layout"
      sx={{
        display: 'flex',
        [theme.breakpoints.down('sm')]: { display: 'block' },
        height: '100vh',
        width: '100vw',
      }}
      className={theme.palette.mode}
    >
      {/* <VersionDialog /> */}
      <CssBaseline />
      <TopBar />
      <Sidebar />
      <Main id="main" sx={[defaultStyle, additionalStyle]}>
        {/* <AlertNotification /> */}
        <Box>
          <Div id="toolbar" sx={theme.mixins.toolbar} />
          <Container maxWidth="xl">
            <NavigationTabs />
            {/* <RouteComponent route={route} key={`AuthRoute-children-${getCluster()}`} /> */}
            <ErrorBoundary fallback={(props: { error: Error }) => <RouteErrorBoundary error={props.error} />}>
              <Outlet />
            </ErrorBoundary>
          </Container>
        </Box>
      </Main>
      <DetailsDrawer />
      {/* <ActionsNotifier /> */}
    </Box>
  );
}

function RouteErrorBoundary(props: { error: Error }) {
  const { error } = props;
  const { t } = useTranslation();
  return (
    <ErrorComponent
      title={t('Uh-oh! Something went wrong.')}
      error={error}
      message={t('translation|Error loading {{ routeName }}', { routeName: '' })}
    />
  );
}

// function RouteComponent({ route }: { route: RouteType }) {
//   const { t } = useTranslation();
//   const [_, setHideAppBar] = useAtom(hideAppBar);

//   useEffect(() => {
//     setHideAppBar(!!route.hideAppBar);
//   }, [route.hideAppBar]);

//   return (
//     <PageTitle
//       title={t(
//         route.name
//           ? route.name
//           : typeof route.sidebar === 'string'
//             ? route.sidebar
//             : route.sidebar?.item || ''
//       )}
//     >
//       <route.component />
//     </PageTitle>
//   );
// }
