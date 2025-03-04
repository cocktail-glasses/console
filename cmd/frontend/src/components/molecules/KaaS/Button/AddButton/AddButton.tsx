import { Add } from '@mui/icons-material';
import { ButtonOwnProps } from '@mui/material';

import Button from '@components/atoms/KaaS/Button/Button';

interface AddButtonProps extends ButtonOwnProps {
  label: string;
  onClick?: (...e: any[]) => void;
}

const AddButton = ({ label, onClick, ...props }: AddButtonProps) => (
  <Button variant="contained" onClick={onClick} startIcon={<Add />} {...props}>
    {label}
  </Button>
);

export default AddButton;
