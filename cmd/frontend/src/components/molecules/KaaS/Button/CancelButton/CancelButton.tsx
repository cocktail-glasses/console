import { Close } from '@mui/icons-material';

import Button from '@components/atoms/KaaS/Button/Button';

interface CancelButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  label?: string;
}

const CancelButton = ({ label, ...props }: CancelButtonProps) => (
  <Button {...props} variant={props.variant || 'outlined'} size={props.size || 'large'} startIcon={<Close />}>
    {label || 'Cancel'}
  </Button>
);

export default CancelButton;
