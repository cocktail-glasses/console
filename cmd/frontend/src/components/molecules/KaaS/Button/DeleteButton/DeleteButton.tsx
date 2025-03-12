import DeleteOutline from '@mui/icons-material/DeleteOutline';

import style from './DeleteButton.module.scss';

import Button from '@components/atoms/KaaS/Button/Button';
import clsx from 'clsx';

interface DeleteButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  label: string;
}

const DeleteButton = ({ label, ...props }: DeleteButtonProps) => {
  return (
    <Button
      className={clsx(style.deleteButton, props.className)}
      variant="contained"
      startIcon={<DeleteOutline fontSize="large" />}
      {...props}
    >
      {label}
    </Button>
  );
};

export default DeleteButton;
