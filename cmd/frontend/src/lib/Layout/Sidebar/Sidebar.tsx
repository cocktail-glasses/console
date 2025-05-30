import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath } from 'react-router';
import { useParams } from 'react-router-dom';

import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import { ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid2';
import List from '@mui/material/List';
import useMediaQuery from '@mui/material/useMediaQuery';

import { find, get, has, isEmpty } from 'lodash';

import ClusterChooser from './ClusterChooser';
import { PureSidebarProps, SidebarItemProps } from './SidebarInterface';

import { ActionButton } from '@components/common';
import { Icon } from '@iconify/react';
import SidebarItem from '@lib/Layout/Sidebar/SidebarItem';
import {
  ApiregistrationV1Api as ApiRegistrationAPI,
  IoK8sKubeAggregatorPkgApisApiregistrationV1APIServiceCondition as ApiServiceCondition,
} from '@lib/apiRegistration';
import { useCluster } from '@lib/k8s';
import { MenuType } from '@lib/menu';
import { sidebarGroupId, sidebarGroups, sidebarMenus, sidebarMenuSelected, sidebarIsOpen } from '@lib/stores';
import { clusterAtom, mainClusterKey } from '@lib/stores/cluster';
import { useQuery } from '@tanstack/react-query';
import { useTypedSelector } from 'redux/reducers/reducers';

// import { UriPrefix } from '@lib/api/constants';

export const drawerWidth = 240;
export const mobileDrawerWidth = 320;
export const drawerWidthClosed = 64;

function useSidebarInfo() {
  const [isSidebarOpen, setIsSidebarOpen] = useAtom(sidebarIsOpen);
  const isTemporary = useMediaQuery('(max-width:599px)');
  const isNarrowOnly = useMediaQuery('(max-width:960px) and (min-width:600px)');
  const temporarySideBarOpen = isSidebarOpen === true && isTemporary; // && isSidebarOpenUserSelected === true;

  // The large sidebar does not open in medium view (600-960px).
  const isOpen = (isSidebarOpen === true && !isNarrowOnly) || (isSidebarOpen === true && temporarySideBarOpen);

  return {
    isCollapsed: !temporarySideBarOpen && !isNarrowOnly,
    isOpen,
    setIsOpen: setIsSidebarOpen,
    isNarrow: !isSidebarOpen || isNarrowOnly,
    canExpand: !isNarrowOnly,
    isTemporary,
    isUserOpened: isSidebarOpen, //isSidebarOpenUserSelected,
    width: isOpen ? `${drawerWidth}px` : isTemporary ? '0px' : `${drawerWidthClosed}px`,
  };
}

function SidebarToggleButton() {
  const setOpen = useSetAtom(sidebarIsOpen);
  const { isOpen, isNarrow, canExpand, isTemporary } = useSidebarInfo();

  const { t } = useTranslation();
  const isNarrowOnly = isNarrow && !canExpand;

  if (isTemporary || isNarrowOnly) {
    return null;
  }

  return (
    <Box textAlign={isOpen ? 'right' : 'center'}>
      <ActionButton
        iconButtonProps={{
          size: 'small',
        }}
        onClick={() => {
          setOpen(!isOpen);
        }}
        icon={isOpen ? 'mdi:chevron-left-box-outline' : 'mdi:chevron-right-box-outline'}
        description={t('translation|Collapse Sidebar')}
      />
    </Box>
  );
}

function DefaultLinkArea(props: { sidebarName: string; isOpen: boolean }) {
  const { sidebarName, isOpen } = props;
  console.log('sidebarName', sidebarName);
  // if (sidebarName === DefaultSidebars.HOME) {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      flexDirection={isOpen ? 'row' : 'column'}
      p={1}
    >
      <Box>{/* <AddClusterButton /> */}</Box>
      <Box>
        <SidebarToggleButton />
      </Box>
    </Box>
  );
  // }

  // return (
  //   <Box textAlign="center">
  //     <CreateButton isNarrow={!isOpen} />
  //     <Box
  //       display="flex"
  //       justifyContent="space-between"
  //       alignItems="center"
  //       flexDirection={isOpen ? 'row' : 'column'}
  //       p={1}
  //     >
  //       <Box>
  //       </Box>
  //       <Box>
  //         <SidebarToggleButton />
  //       </Box>
  //     </Box>
  //   </Box>
  // );
}

export interface SidebarMenuType extends MenuType {
  url: string;
  sub?: SidebarMenuType[];
  isOnlyTab?: boolean;
}

export default function Sidebar() {
  const menus = useAtomValue(sidebarMenus);
  const selectedMenu = useAtomValue(sidebarMenuSelected);

  const groupID = useAtomValue(sidebarGroupId);
  const params = useParams();

  const clusterInURL = useCluster();
  const setCluster = useSetAtom(clusterAtom);

  const [isGatewayAvailable, setIsGatewayAvailable] = useState(false);
  const { data: clusterGatewayApiService } = useQuery({
    queryKey: ['cluster-gateway-apiservice'],
    queryFn: async () => {
      const apiRegistrationAPI = new ApiRegistrationAPI(undefined, '/k8s/');
      return await apiRegistrationAPI.readApiregistrationV1APIServiceStatus(
        'v1alpha1.gateway.open-cluster-management.io'
      );
    },
    refetchInterval: 5000,
  });

  useEffect(() => {
    const conditions = get(clusterGatewayApiService, 'data.status.conditions', []);
    const condition = find(conditions, (condition: ApiServiceCondition) => condition.type === 'Available');
    setIsGatewayAvailable(condition?.status === 'True');
  }, [clusterGatewayApiService]);

  useEffect(() => {
    if (isGatewayAvailable && isEmpty(clusterInURL)) {
      setCluster(mainClusterKey);
    }
  }, [isGatewayAvailable]);

  // const sidebar = useTypedSelector(state => state.sidebar);
  // const sidebar = {
  //   selected: { sidebar: 'HOME', item: 'settings' },
  //   entries: [],
  //   filters: [],
  //   isVisible: true,
  // };
  const { isOpen, setIsOpen, isUserOpened, isNarrow, canExpand, isTemporary: isTemporaryDrawer } = useSidebarInfo();
  const isNarrowOnly = isNarrow && !canExpand;
  // const arePluginsLoaded = useTypedSelector(state => state.plugins.loaded);
  const namespaces = useTypedSelector((state) => state.filter.namespaces);

  const items: Omit<SidebarItemProps, 'sidebar'>[] | undefined = useMemo(() => {
    return menus
      ?.filter((menu) => menu.group === groupID)
      .map<Omit<SidebarItemProps, 'sidebar'>>((menu: SidebarMenuType) => {
        const murl = params ? generatePath(menu.url, { ...params } as { [x: string]: string | null }) : menu.url;
        const isSelected = menu.id == (has(selectedMenu, 'parent') ? selectedMenu.parent : selectedMenu?.id);

        return {
          name: menu.id,
          label: menu.label,
          url: murl,
          icon: menu.icon,
          hide: menu.isVisible === false,
          isSelected,
          subList: menu.sub
            ?.filter((s: any) => s.isOnlyTab === false)
            .map((s: SidebarMenuType) => {
              const surl = params
                ? generatePath(s.url, { ...params } as {
                    [x: string]: string | null;
                  })
                : menu.url;
              const isSelected = s.id == selectedMenu?.id;
              return { name: s.id, label: s.label, url: surl, isSelected };
            }),
        };
      });
  }, [groupID, menus, params, selectedMenu]);

  const search = namespaces.size !== 0 ? `?namespace=${[...namespaces].join('+')}` : '';
  // if (sidebar.selected.sidebar === null || !sidebar?.isVisible) {
  //   return null;
  // }

  if (selectedMenu == null) {
    return null;
  }

  return (
    <PureSidebar
      items={items!}
      open={isOpen}
      openUserSelected={isUserOpened}
      isNarrowOnly={isNarrowOnly}
      isTemporaryDrawer={isTemporaryDrawer}
      selectedName={selectedMenu.label}
      search={search}
      onToggleOpen={() => setIsOpen((prev) => !prev)}
      linkArea={<DefaultLinkArea sidebarName={selectedMenu.label} isOpen={isOpen} />}
      isClusterSwitchAvailable={isGatewayAvailable}
    />
  );
}

export function PureSidebar({
  open,
  openUserSelected,
  items,
  isTemporaryDrawer = false,
  isNarrowOnly = false,
  onToggleOpen,
  search,
  linkArea,
  isClusterSwitchAvailable,
}: PureSidebarProps) {
  const { t } = useTranslation(['glossary']);
  const [getSidebarGroup, setSidebarGroup] = useAtom(sidebarGroupId);
  const groups = useAtomValue(sidebarGroups);
  const temporarySideBarOpen = open === true && isTemporaryDrawer && openUserSelected === true;

  // The large sidebar does not open in medium view (600-960px).
  const largeSideBarOpen = (open === true && !isNarrowOnly) || (open === true && temporarySideBarOpen);

  /**
   * For closing the sidebar if temporaryDrawer on mobile.
   */
  const toggleDrawer = (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    onToggleOpen();
  };

  const topContent = (
    <Box
      sx={(theme) => {
        return {
          ...theme.mixins.toolbar,
        };
      }}
    />
  );
  const contents = (
    <>
      <Grid
        sx={{
          height: '100%',
        }}
        container
        direction="column"
        justifyContent="space-between"
        wrap="nowrap"
      >
        <Grid sx={{ padding: 1 }}>
          <List
            aria-label="sidebar list"
            onClick={isTemporaryDrawer ? toggleDrawer : undefined}
            onKeyDown={isTemporaryDrawer ? toggleDrawer : undefined}
            sx={{ padding: 1 }}
          >
            {items.map((item) => (
              <SidebarItem
                key={item.name}
                isSelected={item.isSelected}
                fullWidth={largeSideBarOpen}
                search={search}
                {...item}
              />
            ))}
          </List>
        </Grid>
        <Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <ToggleButtonGroup
              orientation={open ? 'horizontal' : 'vertical'}
              color="primary"
              value={getSidebarGroup}
              exclusive
              onChange={(event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
                newAlignment && setSidebarGroup(newAlignment);
              }}
              sx={(theme) => ({ background: theme.palette.sidebarGroupBg })}
              aria-label="Platform"
            >
              {groups.map((g) => (
                <ToggleButton key={g.id} value={g.id}>
                  <Tooltip title={t(g.label)}>
                    <Icon icon={g.icon} width={'2em'} height={'2em'} />
                  </Tooltip>
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
          <Box
            textAlign="center"
            p={0}
            sx={(theme) => ({
              '&, & *, & svg': {
                color: theme.palette.sidebarLink.color,
              },
              '& .MuiButton-root': {
                color: theme.palette.sidebarButtonInLinkArea.color,
                '&:hover': {
                  background: theme.palette.sidebarButtonInLinkArea.hover.background,
                },
              },
              '& .MuiButton-containedPrimary': {
                background: theme.palette.sidebarButtonInLinkArea.primary.background,
                '&:hover': {
                  background: theme.palette.sidebarButtonInLinkArea.hover.background,
                },
              },
            })}
          >
            {linkArea}
          </Box>
        </Grid>
      </Grid>
    </>
  );

  const clusterChooser = isClusterSwitchAvailable && (
    <>
      <Box
        sx={{
          display: 'flex',
          mt: 'calc(var(--template-frame-height, 0px) + 4px)',
          p: 1.5,
        }}
      >
        <ClusterChooser fullWidth={largeSideBarOpen} />
      </Box>
      <Divider />
    </>
  );

  const conditionalProps = isTemporaryDrawer
    ? {
        open: temporarySideBarOpen,
        onClose: onToggleOpen,
      }
    : {};

  return (
    <Box component="nav" aria-label={t('translation|Navigation')} className="sidebar-box">
      <Drawer
        variant={isTemporaryDrawer ? 'temporary' : 'permanent'}
        sx={(theme) => {
          const drawer = {
            width: drawerWidth,
            flexShrink: 0,
            background: theme.palette.sidebarBg,
          };

          const drawerOpen = {
            width: drawerWidth,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            background: theme.palette.sidebarBg,
          };

          const drawerClose = {
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: 'hidden',
            width: '56px',
            [theme.breakpoints.down('xs')]: {
              background: 'initial',
            },
            [theme.breakpoints.down('sm')]: {
              width: theme.spacing(0),
            },
            [theme.breakpoints.up('sm')]: {
              width: '72px',
            },
            background: theme.palette.sidebarBg,
          };

          if ((isTemporaryDrawer && temporarySideBarOpen) || (!isTemporaryDrawer && largeSideBarOpen)) {
            return {
              ...drawer,
              ...drawerOpen,
              '& .MuiPaper-root': { ...drawerOpen },
            };
          } else {
            return {
              ...drawer,
              ...drawerClose,
              '& .MuiPaper-root': { ...drawerClose },
            };
          }
        }}
        aria-label="drawer"
        {...conditionalProps}
      >
        {topContent}
        {/* kaas 서비스는 어차피 허브 클러스터에서 할 것 같은데.. 일단은 설정 메뉴를 제외하고 clusterChooser 노출 */}
        {getSidebarGroup == 'k8s' && clusterChooser}
        {contents}
      </Drawer>
    </Box>
  );
}

// export function useSidebarItem(
//   sidebarDesc: string | null | { item: string | null; sidebar?: string }
// ) {
//   let itemName: string | null = null;
//   let sidebar: DefaultSidebars | string | null = DefaultSidebars.IN_CLUSTER;
//   if (typeof sidebarDesc === 'string') {
//     itemName = sidebarDesc;
//   } else if (sidebarDesc === null) {
//     sidebar = null;
//   } else if (!!sidebarDesc) {
//     itemName = sidebarDesc.item;
//     if (!!sidebarDesc.sidebar) {
//       sidebar = sidebarDesc.sidebar || DefaultSidebars.IN_CLUSTER;
//     }
//   }

//   const dispatch = useDispatch();

//   useEffect(
//     () => {
//       dispatch(setSidebarSelected({ item: itemName, sidebar: sidebar }));
//     },
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     [itemName]
//   );
// }
