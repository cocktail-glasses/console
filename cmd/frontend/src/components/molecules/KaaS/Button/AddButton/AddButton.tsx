import { ReactNode } from 'react';

import { Add } from '@mui/icons-material';

import Button, { ButtonProps } from '@components/atoms/KaaS/Button/Button';

interface AddButtonProps extends ButtonProps {
  label: ReactNode;
  onClick?: (...e: any[]) => void;
}

const AddButton = ({ label, onClick, ...props }: AddButtonProps) => (
  <Button variant="contained" onClick={onClick} startIcon={<Add />} {...props}>
    {label}
  </Button>
);

export default AddButton;
