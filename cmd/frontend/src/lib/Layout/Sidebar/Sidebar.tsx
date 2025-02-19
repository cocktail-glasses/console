import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath } from 'react-router';
import { useParams } from 'react-router-dom';

import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import { ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import useMediaQuery from '@mui/material/useMediaQuery';

import { PureSidebarProps } from './SidebarInterface';

import { ActionButton } from '@components/common';
import { Icon } from '@iconify/react';
import SidebarItem from '@lib/Layout/Sidebar/SidebarItem';
import { sidebarGroupId, sidebarGroups, sidebarMenus, sidebarMenuSelected, sidebarIsOpen } from '@lib/stores';
import { useTypedSelector } from 'redux/reducers/reducers';

// import { UriPrefix } from '@lib/api/constants';

export const drawerWidth = 240;
export const mobileDrawerWidth = 320;
export const drawerWidthClosed = 64;

export function useSidebarInfo() {
  const isSidebarOpen = useAtomValue(sidebarIsOpen);
  const isTemporary = useMediaQuery('(max-width:599px)');
  const isNarrowOnly = useMediaQuery('(max-width:960px) and (min-width:600px)');
  const temporarySideBarOpen = isSidebarOpen === true && isTemporary; // && isSidebarOpenUserSelected === true;

  // The large sidebar does not open in medium view (600-960px).
  const isOpen = (isSidebarOpen === true && !isNarrowOnly) || (isSidebarOpen === true && temporarySideBarOpen);

  return {
    isCollapsed: !temporarySideBarOpen && !isNarrowOnly,
    isOpen,
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

export default function Sidebar() {
  const menus = useAtomValue(sidebarMenus);
  const menu = useAtomValue(sidebarMenuSelected);

  const [_, setOpen] = useAtom(sidebarIsOpen);
  const groupID = useAtomValue(sidebarGroupId);
  const params = useParams();

  // const sidebar = useTypedSelector(state => state.sidebar);
  const sidebar = { selected: { sidebar: 'HOME', item: 'settings' }, entries: [], filters: [], isVisible: true };
  const { isOpen, isUserOpened, isNarrow, canExpand, isTemporary: isTemporaryDrawer } = useSidebarInfo();
  const isNarrowOnly = isNarrow && !canExpand;
  // const arePluginsLoaded = useTypedSelector(state => state.plugins.loaded);
  const namespaces = useTypedSelector((state) => state.filter.namespaces);

  const items = useMemo(() => {
    return menus
      .filter((f: any) => f.group === groupID)
      .map((m: any) => {
        const murl = params ? generatePath(m.url, { ...params } as { [x: string]: string | null }) : m.url;
        return {
          name: m.id,
          label: m.label,
          url: murl,
          icon: m.icon,
          hide: false,
          subList: m.sub
            .filter((s: any) => s.isOnlyTab === false)
            .map((s: any) => {
              const surl = params ? generatePath(s.url, { ...params } as { [x: string]: string | null }) : m.url;
              return { name: s.id, label: s.label, url: surl };
            }),
        };
      });
  }, [groupID, params]);

  const search = namespaces.size !== 0 ? `?namespace=${[...namespaces].join('+')}` : '';
  if (sidebar.selected.sidebar === null || !sidebar?.isVisible) {
    return null;
  }

  return (
    <PureSidebar
      items={items}
      open={isOpen}
      openUserSelected={isUserOpened}
      isNarrowOnly={isNarrowOnly}
      isTemporaryDrawer={isTemporaryDrawer}
      selectedName={menu.id}
      search={search}
      onToggleOpen={() => {
        setOpen(!isOpen);
      }}
      linkArea={<DefaultLinkArea sidebarName={sidebar.selected.sidebar || ''} isOpen={isOpen} />}
    />
  );
}

export function PureSidebar({
  open,
  openUserSelected,
  items,
  selectedName,
  isTemporaryDrawer = false,
  isNarrowOnly = false,
  onToggleOpen,
  search,
  linkArea,
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

  const contents = (
    <>
      <Box
        sx={(theme) => ({
          ...theme.mixins.toolbar,
        })}
      />
      <Grid
        sx={{
          height: '100%',
        }}
        container
        direction="column"
        justifyContent="space-between"
        wrap="nowrap"
      >
        <Grid item>
          <List
            onClick={isTemporaryDrawer ? toggleDrawer : undefined}
            onKeyDown={isTemporaryDrawer ? toggleDrawer : undefined}
          >
            {items.map((item) => (
              <SidebarItem
                key={item.name}
                selectedName={selectedName}
                fullWidth={largeSideBarOpen}
                search={search}
                {...item}
              />
            ))}
          </List>
        </Grid>
        <Grid item>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <ToggleButtonGroup
              orientation={open ? 'horizontal' : 'vertical'}
              color="primary"
              value={getSidebarGroup}
              exclusive
              onChange={(event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
                setSidebarGroup(newAlignment);
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

  const conditionalProps = isTemporaryDrawer
    ? {
        open: temporarySideBarOpen,
        onClose: onToggleOpen,
      }
    : {};

  return (
    <Box component="nav" aria-label={t('translation|Navigation')}>
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
            return { ...drawer, ...drawerOpen, '& .MuiPaper-root': { ...drawerOpen } };
          } else {
            return { ...drawer, ...drawerClose, '& .MuiPaper-root': { ...drawerClose } };
          }
        }}
        {...conditionalProps}
      >
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
