// import { has } from 'lodash';
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useAtom, useSetAtom } from "jotai";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

// import { setWhetherSidebarOpen } from 'redux/sidebarSlice';
// import { SettingsButton } from '../../pages/Settings';

import { Icon } from "@iconify/react";
import { AppLogo } from "@lib/App/AppLogo";
// import { ClusterTitle } from '@components/cluster/Chooser';
// import ErrorBoundary from '@components/common/ErrorBoundary';
import { drawerWidth } from "@lib/Layout/Sidebar";
import MinButton from "@lib/Layout/Sidebar/MinButton";
import { authAtom, getToken } from "@lib/auth";
import { useCluster, useClustersConf } from "@lib/k8s";
import { createRouteURL } from "@lib/router";
import { sidebarIsOpen } from "@lib/stores";
import { SettingsButton } from "@pages/Settings";
import NotificationButton from "@pages/Settings/NotificationButton";
// import {
//   AppBarAction,
//   AppBarActionsProcessor,
//   DefaultAppBarAction,
//   HeaderActionType,
// } from 'redux/actionButtonsSlice';
import { useTypedSelector } from "redux/reducers/reducers";

export interface TopBarProps {}

// export function useAppBarActionsProcessed() {
//   const appBarActions = useTypedSelector(state => state.actionButtons.appBarActions);
//   const appBarActionsProcessors = useTypedSelector(
//     state => state.actionButtons.appBarActionsProcessors
//   );

//   return { appBarActions, appBarActionsProcessors };
// }

// export function processAppBarActions(
//   appBarActions: AppBarAction[],
//   appBarActionsProcessors: AppBarActionsProcessor[]
// ): AppBarAction[] {
//   let appBarActionsProcessed = [...appBarActions];
//   for (const appBarActionsProcessor of appBarActionsProcessors) {
//     appBarActionsProcessed = appBarActionsProcessor.processor({ actions: appBarActionsProcessed });
//   }
//   return appBarActionsProcessed;
// }

export default function TopBar() {
  // const dispatch = useDispatch();
  const [isSidebarOpen, setOpen] = useAtom(sidebarIsOpen);
  const setAuthAtom = useSetAtom(authAtom);
  const isMedium = useMediaQuery("(max-width:960px)");
  const isSidebarOpenUserSelected = isSidebarOpen;
  // const isSidebarOpenUserSelected = useTypedSelector(
  //   state => state.sidebar.isSidebarOpenUserSelected
  // );
  const hideAppBar = useTypedSelector((state) => state.ui.hideAppBar);

  const clustersConfig = useClustersConf();
  const cluster = useCluster();
  const navigate = useNavigate();
  // const { appBarActions, appBarActionsProcessors } = useAppBarActionsProcessed();

  function hasToken() {
    return cluster ? !!getToken(cluster) : false;
  }

  function logout() {
    setAuthAtom("");
    navigate("/");
  }

  if (hideAppBar) {
    return null;
  }
  return (
    <PureTopBar
      // appBarActions={appBarActions}
      // appBarActionsProcessors={appBarActionsProcessors}
      logout={logout}
      hasToken={hasToken()}
      isSidebarOpen={isSidebarOpen}
      isSidebarOpenUserSelected={isSidebarOpenUserSelected}
      onToggleOpen={() => {
        // For medium view we default to closed if they have not made a selection.
        // This handles the case when the user resizes the window from large to small.
        // If they have not made a selection then the window size stays the default for
        //   the size.

        const openSideBar =
          isMedium && isSidebarOpenUserSelected === undefined
            ? false
            : isSidebarOpen;
        setOpen(!openSideBar);
      }}
      cluster={cluster || undefined}
      clusters={clustersConfig || undefined}
    />
  );
}

export interface PureTopBarProps {
  /** If the sidebar is fully expanded open or shrunk. */
  // appBarActions: AppBarAction[];
  /** functions which filter the app bar action buttons */
  // appBarActionsProcessors?: AppBarActionsProcessor[];
  logout: () => void;
  hasToken: boolean;
  clusters?: {
    [clusterName: string]: any;
  };
  cluster?: string;
  isSidebarOpen?: boolean;
  isSidebarOpenUserSelected?: boolean;

  /** Called when sidebar toggles between open and closed. */
  onToggleOpen: () => void;
}

// function AppBarActionsMenu({ appBarActions }: { appBarActions: HeaderActionType[] | AppBarAction[] }) {
//   const actions = (function stateActions() {
//     return React.Children.toArray(
//       appBarActions.map(action => {
//         const Action = has(action, 'action') ? action.action : action;
//         if (React.isValidElement(Action)) {
//           return (
//             <ErrorBoundary>
//               <MenuItem>{Action}</MenuItem>
//             </ErrorBoundary>
//           );
//         } else if (Action === null) {
//           return null;
//         } else if (typeof Action === 'function') {
//           return (
//             <ErrorBoundary>
//               <MenuItem>
//                 <>{Action()}</>
//                 {/* <Action /> */}
//               </MenuItem>
//             </ErrorBoundary>
//           );
//         }
//       })
//     );
//   })();

//   return <>{actions}</>;
// }
// function AppBarActions({ appBarActions }: { appBarActions: HeaderActionType[] | AppBarAction[] }) {
//   console.log('AppBarActions')
//   const actions = (function stateActions() {
//     return React.Children.toArray(
//       appBarActions.map(action => {
//         const Action = has(action, 'action') ? action.action : action;
//         if (React.isValidElement(Action)) {
//           console.log('1', Action)
//           // return <ErrorBoundary>{Action}</ErrorBoundary>;
//           return Action
//         } else if (Action === null) {
//           console.log('2')
//           return null;
//         } else if (typeof Action === 'function') {
//           console.log('3', Action)
//           return (
//             <ErrorBoundary>
//               {/* <>{Action()}</> */}
//               <Action />
//             </ErrorBoundary>
//           );
//         }
//       })
//     );
//   })();
//   console.log('actions', actions)
//   return <>{actions}</>;
// }

function PureTopBar({
  // appBarActions,
  // appBarActionsProcessors = [],
  logout,
  // cluster,
  // clusters,
  isSidebarOpen,
  isSidebarOpenUserSelected,
  onToggleOpen,
}: PureTopBarProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const navigate = useNavigate();

  const openSideBar = !!(isSidebarOpenUserSelected === undefined
    ? false
    : isSidebarOpen);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);
  // const isClusterContext = !!cluster;

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const userMenuId = "primary-user-menu";
  const userMenu = (
    <IconButton
      aria-label={t("Account of current user")}
      aria-controls={userMenuId}
      aria-haspopup="true"
      color="inherit"
      onClick={(event) => {
        handleMenuClose();
        handleProfileMenuOpen(event);
      }}
      size="medium"
    >
      <Icon icon="mdi:account" />
    </IconButton>
  );
  const settingMunu = <SettingsButton onClickExtra={handleMenuClose} />;
  const notificationMenu = (
    <NotificationButton onClickExtra={handleMenuClose} />
  );
  const renderUserMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={userMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={() => {
        handleMenuClose();
        handleMobileMenuClose();
      }}
      style={{ zIndex: 1400 }}
      sx={{
        "& .MuiMenu-list": {
          paddingBottom: 0,
        },
      }}
    >
      <MenuItem
        component="a"
        onClick={() => {
          logout();
          handleMenuClose();
        }}
      >
        <ListItemIcon>
          <Icon icon="mdi:logout" />
        </ListItemIcon>
        <ListItemText primary={t("Log out")} />
      </MenuItem>
      <MenuItem
        component="a"
        onClick={() => {
          navigate(createRouteURL("settings"));
          handleMenuClose();
        }}
      >
        <ListItemIcon>
          <Icon icon="mdi:cog-box" />
        </ListItemIcon>
        <ListItemText>{t("translation|General Settings")}</ListItemText>
      </MenuItem>
      <MenuItem
        component="a"
        onClick={() => {
          handleMenuClose();
        }}
      >
        <ListItemIcon>
          <Icon icon="mdi:information-outline" />
        </ListItemIcon>
        <ListItemText>{""}</ListItemText>
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-menu-mobile";
  // const allAppBarActionsMobile: AppBarAction[] = [
  //   {
  //     id: DefaultAppBarAction.CLUSTER,
  //     action: isClusterContext && (
  //       <ClusterTitle cluster={cluster} clusters={clusters} onClick={() => handleMenuClose()} />
  //     ),
  //   },
  //   // ...appBarActions,
  //   {
  //     id: DefaultAppBarAction.NOTIFICATION,
  //     action: null,
  //   },
  //   {
  //     id: DefaultAppBarAction.SETTINGS,
  //     action: (
  //       <MenuItem>
  //         <SettingsButton onClickExtra={handleMenuClose} />
  //       </MenuItem>
  //     ),
  //   },
  //   {
  //     id: DefaultAppBarAction.USER,
  //     action: !!isClusterContext && (
  //       <MenuItem>
  //         <IconButton
  //           aria-label={t('Account of current user')}
  //           aria-controls={userMenuId}
  //           aria-haspopup="true"
  //           color="inherit"
  //           onClick={event => {
  //             handleMenuClose();
  //             handleProfileMenuOpen(event);
  //           }}
  //           size="medium"
  //         >
  //           <Icon icon="mdi:account" />
  //         </IconButton>
  //       </MenuItem>
  //     ),
  //   },
  // ];
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {/* <AppBarActionsMenu
        appBarActions={processAppBarActions(allAppBarActionsMobile, appBarActionsProcessors)}
      /> */}
      <MenuItem>{notificationMenu}</MenuItem>
      <MenuItem>{settingMunu}</MenuItem>
      <MenuItem>{userMenu}</MenuItem>
    </Menu>
  );

  // const allAppBarActions: AppBarAction[] = [
  //   {
  //     id: DefaultAppBarAction.CLUSTER,
  //     action: (
  //       <Box
  //         sx={theme => ({
  //           paddingRight: theme.spacing(10),
  //         })}
  //       >
  //         <ClusterTitle cluster={cluster} clusters={clusters} onClick={handleMobileMenuClose} />
  //       </Box>
  //     ),
  //   },
  //   ...appBarActions,
  //   {
  //     id: DefaultAppBarAction.NOTIFICATION,
  //     action: null,
  //   },
  //   {
  //     id: DefaultAppBarAction.SETTINGS,
  //     action: <SettingsButton onClickExtra={handleMenuClose} />,
  //   },
  //   {
  //     id: DefaultAppBarAction.USER,
  //     action: !!isClusterContext && (
  //       <IconButton
  //         aria-label={t('Account of current user')}
  //         aria-controls={userMenuId}
  //         aria-haspopup="true"
  //         onClick={handleProfileMenuOpen}
  //         color="inherit"
  //         size="medium"
  //       >
  //         <Icon icon="mdi:account" />
  //       </IconButton>
  //     ),
  //   },
  // ];

  return (
    <>
      <AppBar
        position="fixed"
        sx={(theme) => ({
          marginLeft: drawerWidth,
          zIndex: theme.zIndex.drawer + 1,
          "& > *": {
            color: theme.palette.text.primary,
          },
          backgroundColor: theme.palette.background.paper,
        })}
        elevation={1}
        component="nav"
        aria-label={t("Appbar Tools")}
        enableColorOnDark
      >
        <Toolbar
          sx={{
            [theme.breakpoints.down("sm")]: {
              paddingLeft: 0,
              paddingRight: 0,
            },
          }}
        >
          {isSmall ? (
            <>
              <MinButton open={openSideBar} onToggleOpen={onToggleOpen} />
              <Box sx={{ flexGrow: 1 }} />
              <IconButton
                aria-label={t("show more")}
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
                size="medium"
              >
                <Icon icon="mdi:more-vert" />
              </IconButton>
            </>
          ) : (
            <>
              <AppLogo />
              <Box sx={{ flexGrow: 1 }} />
              {/* <AppBarActions
                appBarActions={processAppBarActions(allAppBarActions, appBarActionsProcessors)}
              /> */}
              {notificationMenu}
              {settingMunu}
              {userMenu}
            </>
          )}
        </Toolbar>
      </AppBar>
      {renderUserMenu}
      {isSmall && renderMobileMenu}
    </>
  );
}
