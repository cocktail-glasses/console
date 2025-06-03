import { useTranslation } from 'react-i18next';
import { generatePath } from 'react-router';
import { useNavigate } from 'react-router-dom';

import { useAtomValue } from 'jotai';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { SidebarItemProps } from './SidebarInterface';

import Tabs from '@components/common/Tabs';
import { createRouteURL } from '@lib/router';
import { sidebarMenuSelected, sidebarIsOpen, sidebarSub } from '@lib/stores';
import { getCluster, getClusterPrefixedPath } from '@lib/util';
import { useTypedSelector } from 'redux/reducers/reducers';

export default function NavigationTabs() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isSmallSideBar = useMediaQuery(theme.breakpoints.only('sm'));
  const isSidebarOpen = useAtomValue(sidebarIsOpen);
  if (!isSmallSideBar && (isSidebarOpen || isMobile)) {
    return null;
  }
  return <PureNavigationTabs />;
}

function PureNavigationTabs() {
  const navigate = useNavigate();
  const sidebar = useTypedSelector((state) => state.sidebar);
  const theme = useTheme();
  const { t } = useTranslation();
  const sidebarSublist = useAtomValue(sidebarSub);
  const menu = useAtomValue(sidebarMenuSelected);

  let defaultIndex = null;

  const subList = sidebarSublist;
  if (!sidebarSublist) {
    return null;
  }
  if (sidebarSublist.length === 0) {
    return null;
  }

  /**
   * This function is used to handle the tab change event.
   *
   * @param index The index of the tab that was clicked.
   * @returns void
   */
  function tabChangeHandler(index: number) {
    if (!subList) {
      return;
    }

    const url = subList[index].url;
    const useClusterURL = !!subList[index].useClusterURL;
    if (url && useClusterURL && getCluster()) {
      navigate(generatePath(getClusterPrefixedPath(url), { cluster: getCluster()! }));
    } else if (url) {
      navigate(url);
    } else {
      navigate(createRouteURL(subList[index].name));
    }
  }

  const tabRoutes = subList
    .filter((item) => !item.hide)
    .map((item: SidebarItemProps) => {
      return { label: item.label, component: <></> };
    });

  defaultIndex = subList.findIndex((item) => item.id === menu.id);
  return (
    <Box mb={2} component="nav" aria-label={t('translation|Main Navigation')}>
      <Tabs
        tabs={tabRoutes}
        onTabChanged={(index) => {
          tabChangeHandler(index);
        }}
        defaultIndex={defaultIndex}
        sx={{
          maxWidth: '85vw',
          [theme.breakpoints.down('sm')]: {
            paddingTop: theme.spacing(1),
          },
        }}
        ariaLabel={t('translation|Navigation Tabs')}
      />
      <Divider />
    </Box>
  );
}
