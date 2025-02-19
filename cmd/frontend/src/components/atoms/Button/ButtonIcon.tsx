import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { default as MuiButton } from '@mui/material/IconButton';

import { ButtonProps } from '.';

interface ButtonIconProps extends ButtonProps {
  type: string;
  [prop: string]: any;
}

export default function ButtonIcon(props: ButtonIconProps) {
  const { type, ...other } = props;
  let icon = <></>;
  switch (type) {
    case 'delete':
      icon = <DeleteIcon />;
      break;
    case 'save':
      icon = <SaveIcon />;
      break;
    default:
      break;
  }
  return <MuiButton {...other}>{icon}</MuiButton>;
}
