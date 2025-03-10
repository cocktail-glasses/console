import { forwardRef, useMemo } from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

import { Icon, IconProps } from '@iconify/react';

const ExpandedIconSize = 24;
const CollapsedIconSize = 24;

interface ListItemLinkProps {
  primary: string;
  pathname: string;
  search?: string;
  name: string;
  subtitle?: string;
  icon?: IconProps['icon'];
  iconOnly?: boolean;
  containerProps?: {
    [prop: string]: any;
  };
}

// make a styled() li
const StyledLi = styled('li')``;

export default function ListItemLink(props: ListItemLinkProps) {
  const { primary, pathname, search, icon, name, containerProps, iconOnly, subtitle, ...other } = props;

  const iconSize = useMemo(() => (iconOnly ? CollapsedIconSize : ExpandedIconSize), [iconOnly]);

  const renderLink = useMemo(
    () =>
      forwardRef<any, Omit<RouterLinkProps, 'to'>>((itemProps, ref) => (
        <RouterLink to={{ pathname: pathname, search: search }} ref={ref} {...itemProps} />
      )),
    [pathname, search]
  );
  let listItemLink = null;

  if (icon) {
    listItemLink = (
      <ListItemIcon sx={{ minWidth: '24px' }}>
        <Icon icon={icon} width={iconSize} height={iconSize} />
      </ListItemIcon>
    );
  }

  let listItemLinkContainer = listItemLink;
  if (!primary) {
    listItemLinkContainer = listItemLink && (
      <Tooltip
        title={name}
        placement="right-start"
        sx={{
          backgroundColor: '#474747',
          color: '#fff',
          minWidth: 60,
          padding: '0.5rem',
          fontSize: '0.8rem',
          border: '1px solid #474747',
          marginLeft: '1rem',
        }}
      >
        {listItemLink}
      </Tooltip>
    );
  }

  return (
    <StyledLi {...containerProps}>
      <ListItem component={renderLink} {...other} sx={{ paddingLeft: 1 }}>
        {listItemLinkContainer}
        {!iconOnly && <ListItemText primary={primary} secondary={subtitle} />}
      </ListItem>
    </StyledLi>
  );
}
