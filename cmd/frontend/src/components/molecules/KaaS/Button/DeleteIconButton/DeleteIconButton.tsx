import { DeleteOutline, Delete } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';

import { eq } from 'lodash';

import style from './DeleteIconButton.module.scss';

interface DeleteIconButtonProps extends React.ComponentPropsWithoutRef<typeof IconButton> {
  variant?: 'standard' | 'outlined';
}

const DeleteIconButton = ({ variant = 'standard', ...props }: DeleteIconButtonProps) => {
  return (
    <IconButton {...props}>
      <Box component={eq(variant, 'standard') ? Delete : DeleteOutline} className={style.deleteIcon} />
    </IconButton>
  );
};

export default DeleteIconButton;
