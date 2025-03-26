import * as React from 'react';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import SmartphoneRoundedIcon from '@mui/icons-material/SmartphoneRounded';
import UnfoldMoreRoundedIcon from '@mui/icons-material/UnfoldMoreRounded';
import MuiAvatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MuiListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { styled } from '@mui/material/styles';

import './sidebar.scss';

const Avatar = styled(MuiAvatar)(({ theme }) => ({
  width: 28,
  height: 28,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.secondary,
  border: `1px solid ${theme.palette.divider}`,
}));

const ListItemAvatar = styled(MuiListItemAvatar)({
  minWidth: 0,
  marginRight: 12,
});

export default function ClusterChooser() {
  const [company, setCompany] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setCompany(event.target.value as string);
  };
  return (
    <Select
      labelId="select-content-label"
      id="select-content"
      className="selectContent"
      value={company}
      onChange={handleChange}
      displayEmpty
      inputProps={{ 'aria-label': 'Select company' }}
      fullWidth
      SelectDisplayProps={{ className: 'SelectDisplayProps', id: 'select-content-selected' }}
      IconComponent={React.forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => (
        <UnfoldMoreRoundedIcon fontSize="small" {...props} ref={ref} />
      ))}
      MenuProps={{
        PaperProps: {
          className: 'select-content-menu',
        },
      }}
      // sx={(theme) => ({
      //   maxHeight: 56,
      //   width: 215,
      //   border: '1px solid',
      //   borderRadius: 2,
      //   borderColor: theme.palette.grey['700'],
      //   // '&.MuiList-root': {
      //   //   p: '8px',
      //   // },
      //   [`& .${selectClasses.select}`]: {
      //     // display: 'flex',
      //     // alignItems: 'center',
      //     // gap: '2px',
      //     // pl: 1,
      //   },
      //   '&:before': {
      //     border: 'none',
      //   },
      //   '&:after': {
      //     border: 'none',
      //   },
      //   '&:hover': {},
      // })}
    >
      <ListSubheader className="select-content-subheader" sx={{ fontSize: '12px' }}>
        Production
      </ListSubheader>
      <MenuItem value="" sx={{ borderRadius: '8px' }}>
        <ListItemAvatar>
          <Avatar alt="Sitemark web">
            <DevicesRoundedIcon sx={{ fontSize: '1rem' }} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary="Sitemark-web"
          secondary="Web app"
          slotProps={{ primary: { fontWeight: 'bold', fontSize: '14px' }, secondary: { fontSize: '12px' } }}
        />
      </MenuItem>
      <MenuItem value={10} sx={{ borderRadius: '8px' }}>
        <ListItemAvatar>
          <Avatar alt="Sitemark App">
            <SmartphoneRoundedIcon sx={{ fontSize: '1rem' }} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary="Sitemark-app"
          secondary="Mobile application"
          slotProps={{ primary: { fontWeight: 'bold', fontSize: '14px' }, secondary: { fontSize: '12px' } }}
        />
      </MenuItem>
      <MenuItem value={20} sx={{ borderRadius: '8px' }}>
        <ListItemAvatar>
          <Avatar alt="Sitemark Store">
            <DevicesRoundedIcon sx={{ fontSize: '1rem' }} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary="Sitemark-Store"
          secondary="Web app"
          slotProps={{ primary: { fontWeight: 'bold', fontSize: '14px' }, secondary: { fontSize: '12px' } }}
        />
      </MenuItem>
      <ListSubheader sx={{ fontSize: '12px' }}>Development</ListSubheader>
      <MenuItem value={30} sx={{ borderRadius: '8px' }}>
        <ListItemAvatar>
          <Avatar alt="Sitemark Store">
            <ConstructionRoundedIcon sx={{ fontSize: '1rem' }} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary="Sitemark-Admin"
          secondary="Web app"
          slotProps={{ primary: { fontWeight: 'bold', fontSize: '14px' }, secondary: { fontSize: '12px' } }}
        />
      </MenuItem>
      <Divider sx={{ mx: -1 }} />
      <MenuItem value={40} sx={{ borderRadius: '8px' }}>
        <ListItemIcon>
          <AddRoundedIcon />
        </ListItemIcon>
        <ListItemText
          primary="Add product"
          secondary="Web app"
          slotProps={{ primary: { fontWeight: 'bold', fontSize: '14px' }, secondary: { fontSize: '12px' } }}
        />
      </MenuItem>
    </Select>
  );
}
