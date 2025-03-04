import DeleteOutline from '@mui/icons-material/DeleteOutline';
import { ButtonOwnProps } from '@mui/material/Button';

import style from './DeleteButton.module.scss';

import Button from '@components/atoms/KaaS/Button/Button';
import clsx from 'clsx';

interface DeleteButtonProps extends ButtonOwnProps {
  label: string;
  onClick: (...e: any[]) => void;
  className?: string;
}

const DeleteButton = ({ label, onClick, className, ...props }: DeleteButtonProps) => {
  return (
    <Button
      className={clsx(style.deleteButton, className)}
      variant="contained"
      startIcon={<DeleteOutline fontSize="large" />}
      onClick={onClick}
      {...props}
    >
      {label}
    </Button>
  );
};

export default DeleteButton;
