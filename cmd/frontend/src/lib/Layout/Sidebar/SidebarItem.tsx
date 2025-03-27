import { Fragment } from 'react';
import { generatePath } from 'react-router';

import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';

import ListItemLink from './ListItemLink';
import { SidebarItemProps } from './SidebarInterface';
import style from './SidebarItem.module.scss';

import { createRouteURL } from '@lib/router';
// import { createRouteURL, getRoute } from '@lib/router';
import { getCluster, getClusterPrefixedPath } from '@lib/util';
import clsx from 'clsx';

export default function SidebarItem(props: SidebarItemProps) {
  const {
    label,
    name,
    subtitle,
    url = null,
    search,
    useClusterURL = false,
    subList = [],
    isSelected,
    hasParent = false,
    icon,
    fullWidth = true,
    hide,
    ...other
  } = props;
  const hasSubtitle = !!subtitle;
  const theme = useTheme();
  // const classes = useItemStyle({ fullWidth, hasSubtitle: !!subtitle });

  let fullURL = url;
  if (fullURL && useClusterURL && getCluster()) {
    fullURL = generatePath(getClusterPrefixedPath(url), {
      cluster: getCluster()!,
    });
  }

  if (!fullURL) {
    const routeName = name;
    // if (!getRoute(name)) {
    //   routeName = subList.length > 0 ? subList[0].name : '';
    // }
    fullURL = createRouteURL(routeName);
  }

  // const isSelected = useMemo(() => {
  //   if (name === selectedName) {
  //     return true;
  //   }
  //   const s = subList.find((s) => s.name === selectedName);
  //   if (s) {
  //     return true;
  //   }
  // }, [selectedName]);
  // const isSelected = useMemo(() => {
  //   if (name === selectedName) {
  //     return true;
  //   }

  //   let subListToCheck = [...subList];
  //   for (let i = 0; i < subListToCheck.length; i++) {
  //     const subItem = subListToCheck[i];
  //     if (subItem.name === selectedName) {
  //       return true;
  //     }

  //     if (!!subItem.subList) {
  //       subListToCheck = subListToCheck.concat(subItem.subList);
  //     }
  //   }
  //   return false;
  // }, [subList, name, selectedName]);

  // const isActive = useMatch({ path: fullURL, params: { name: '10' } });
  // const resolvedPath = useResolvedPath(fullURL)
  // const match = useMatch({ path: resolvedPath.pathname, end: resolvedPath.pathname === '/' ? true : false });
  // const isSelected = !!match
  // function shouldExpand() {
  //   return isSelected || !!subList.find((item) => item.name === selectedName);
  // }

  const expanded = subList.length > 0 && isSelected; // shouldExpand();

  // 셀렉트 지정을 단일 요소에만 지정한다.
  const setSinglePointSelect = () => {
    if (!isSelected) return false;

    const isChildrenSelected = subList.find((sub: SidebarItemProps) => sub.isSelected);

    return !isChildrenSelected;
  };

  return hide ? null : (
    <Fragment>
      <ListItemLink
        // selected={isSelected}
        pathname={fullURL || ''}
        primary={fullWidth ? label : ''}
        containerProps={{
          className: clsx(style.sidebarItem, {
            [style.sidearItemSub]: hasParent,
            [style.sidebarItemSelected]: setSinglePointSelect(),
          }),
        }}
        icon={icon}
        name={label}
        subtitle={subtitle}
        search={search}
        iconOnly={!fullWidth}
        {...other}
      />
      {subList.length > 0 && (
        <ListItem
          sx={{
            padding: 0,
          }}
        >
          <Collapse in={fullWidth && expanded} sx={{ width: '100%' }}>
            <List
              component="ul"
              disablePadding
              sx={{
                '& .MuiListItem-root': {
                  fontSize: '.875rem',
                  paddingTop: '2px',
                  paddingBottom: '2px',
                },
              }}
            >
              {subList.map((item: SidebarItemProps) => (
                <SidebarItem key={item.name} isSelected={item.isSelected} hasParent search={search} {...item} />
              ))}
            </List>
          </Collapse>
        </ListItem>
      )}
    </Fragment>
  );
}
