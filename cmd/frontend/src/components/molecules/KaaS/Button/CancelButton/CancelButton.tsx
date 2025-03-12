import { Close } from '@mui/icons-material';

import Button from '@components/atoms/KaaS/Button/Button';

interface CancelButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  label?: string;
}

const CancelButton = ({ label, ...props }: CancelButtonProps) => (
  <Button variant="outlined" color="secondary" size="large" startIcon={<Close />} {...props}>
    {label || 'Cancel'}
  </Button>
);

export default CancelButton;
