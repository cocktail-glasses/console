import { DeleteOutline } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import style from './DeleteIconButton.module.scss';

interface DeleteIconButtonProps {
  onClick?: (...e: any[]) => void;
}

const DeleteIconButton = ({ onClick }: DeleteIconButtonProps) => {
  return (
    <IconButton aria-label="delete-icon-button" onClick={onClick}>
      <DeleteOutline className={style.deleteIcon} />
    </IconButton>
  );
};

export default DeleteIconButton;
