import { Fragment, useMemo } from 'react';
import { generatePath } from 'react-router';

import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';

import ListItemLink from './ListItemLink';
import { SidebarItemProps } from './SidebarInterface';

// import { createRouteURL, getRoute } from '@lib/router';
import { getCluster, getClusterPrefixedPath } from '@lib/util';

export default function SidebarItem(props: SidebarItemProps) {
  const {
    label,
    name,
    subtitle,
    url = null,
    search,
    useClusterURL = false,
    subList = [],
    selectedName,
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

  // if (!fullURL) {
  //   let routeName = name;
  //   if (!getRoute(name)) {
  //     routeName = subList.length > 0 ? subList[0].name : '';
  //   }
  //   fullURL = createRouteURL(routeName);
  // }
  const isSelected = useMemo(() => {
    if (name === selectedName) {
      return true;
    }
    const s = subList.find((s) => s.name === selectedName);
    if (s) {
      return true;
    }
  }, [selectedName]);
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
  function shouldExpand() {
    return isSelected || !!subList.find((item) => item.name === selectedName);
  }

  const expanded = subList.length > 0 && shouldExpand();

  return hide ? null : (
    <Fragment>
      <ListItemLink
        // selected={isSelected}
        pathname={fullURL || ''}
        primary={fullWidth ? label : ''}
        containerProps={{
          sx: {
            color: theme.palette.sidebarLink.color,
            borderRadius: '4px',
            marginRight: '5px',
            marginLeft: theme.spacing(5),
            marginBottom: '1px',

            '& *': {
              fontSize: '.875rem',
              textTransform: 'none',
            },
            '& .MuiListItem-root': {
              paddingTop: '4px',
              paddingBottom: '4px',
              color: theme.palette.sidebarLink.color,
            },
            '& .MuiListItem-button:hover': {
              backgroundColor: 'unset',
            },
            '&:hover': {
              backgroundColor: theme.palette.sidebarLink.hover.backgroundColor,

              '& svg': {
                color: theme.palette.sidebarLink.hover.color,
              },
            },
            '& a.Mui-focusVisible': {
              backgroundColor: theme.palette.sidebarLink.hover.backgroundColor,
            },
            '& svg': {
              color: theme.palette.sidebarLink.color,
            },
            '& .MuiListItemIcon-root': {
              minWidth: 0,
              alignSelf: fullWidth && hasSubtitle ? 'stretch' : 'auto',
              paddingTop: fullWidth && hasSubtitle ? theme.spacing(1) : 0,
              marginRight: fullWidth ? '8px' : '0',
            },
            '& .MuiListItemText-secondary': {
              fontSize: '.85rem',
              fontStyle: 'italic',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflowWrap: 'anywhere',
              overflow: 'hidden',
              color: theme.palette.sidebarLink.color,
            },

            ...(!hasParent && {
              color: theme.palette.sidebarLink.main.color,
              marginLeft: '0px',
              marginRight: '0px',
              borderRadius: '4px',

              '& .MuiListItem-root': {
                paddingTop: hasSubtitle ? '0' : '4px',
                paddingBottom: hasSubtitle ? '0' : '4px',
                paddingLeft: '8px',
                paddingRight: '8px',
                minHeight: !fullWidth ? '48px' : 'unset',
                color: theme.palette.sidebarLink.color,
              },

              '& *': {
                fontSize: '1rem',
              },

              '&:hover, &:active': {
                color: theme.palette.sidebarLink.main.color,
                '& svg': {
                  color: theme.palette.sidebarLink.main.color,
                },
              },
            }),

            ...(!hasParent &&
              isSelected && {
                '& svg': {
                  color: theme.palette.sidebarLink.main.selected.color,
                },
                '&:hover, &:active': {
                  color: theme.palette.sidebarLink.main.selected.color,
                  '& svg': {
                    color: theme.palette.sidebarLink.main.selected.color,
                  },
                },
                '&, & *': {
                  color: theme.palette.sidebarLink.main.selected.color,
                },
                backgroundColor: `${theme.palette.sidebarLink.main.selected.backgroundColor}!important`,
                '& .MuiListItemText-secondary': {
                  fontSize: '.85rem',
                  fontStyle: 'italic',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  textTransform: 'none',
                  overflowWrap: 'anywhere',
                  overflow: 'hidden',
                  color: theme.palette.sidebarLink.main.selected.color,
                },
                '& a.Mui-focusVisible': {
                  backgroundColor: theme.palette.sidebarLink.selected.backgroundColor,
                },
              }),

            ...(hasParent &&
              isSelected && {
                fontWeight: 'bold',
                '& .Mui-selected': {
                  background: theme.palette.sidebarLink.selected.backgroundColor,
                  '& *': {
                    fontWeight: 'bold',
                    color: theme.palette.sidebarLink.selected.color,
                  },
                },
              }),
          },
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
                <SidebarItem key={item.name} selectedName={selectedName} hasParent search={search} {...item} />
              ))}
            </List>
          </Collapse>
        </ListItem>
      )}
    </Fragment>
  );
}
