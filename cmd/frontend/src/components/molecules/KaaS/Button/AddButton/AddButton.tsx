import { ReactNode } from 'react';

import { Add } from '@mui/icons-material';

import Button from '@components/atoms/KaaS/Button/Button';

interface AddButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  label: ReactNode;
}

const AddButton = ({ label, ...props }: AddButtonProps) => (
  <Button variant="contained" startIcon={<Add />} {...props}>
    {label}
  </Button>
);

export default AddButton;
