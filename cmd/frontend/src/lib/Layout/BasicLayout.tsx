// import VersionDialog from '@lib/App/VersionDialog';
import { Outlet } from 'react-router-dom';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

// import ActionsNotifier from '@components/common/ActionsNotifier';
// import AlertNotification from '@components/common/AlertNotification';
import Sidebar, { NavigationTabs } from '@lib/Layout/Sidebar';
import TopBar from '@lib/Layout/TopBar';

const Div = styled('div')``;
const Main = styled('main')``;

export default function Layout() {
  const theme = useTheme();

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
      <Main
        id="main"
        sx={{
          flexGrow: 1,
          marginLeft: 'initial',
          overflowX: 'hidden',
          overflowY: 'auto',
          paddingBottom: '100px',
        }}
      >
        {/* <AlertNotification /> */}
        <Box>
          <Div id="toolbar" sx={theme.mixins.toolbar} />
          <Container maxWidth="xl">
            <NavigationTabs />
            {/* <RouteComponent route={route} key={`AuthRoute-children-${getCluster()}`} /> */}
            <Outlet />
          </Container>
        </Box>
      </Main>
      {/* <ActionsNotifier /> */}
    </Box>
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
