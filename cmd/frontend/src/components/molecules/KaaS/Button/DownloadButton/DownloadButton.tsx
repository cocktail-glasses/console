import { VerticalAlignBottom } from '@mui/icons-material';

import Button, { ButtonProps } from '@components/atoms/KaaS/Button/Button';

interface DownloadButtonProps extends ButtonProps {
  label?: string;
}

const DownloadButton = ({ label, ...props }: DownloadButtonProps) => (
  <Button variant="contained" startIcon={<VerticalAlignBottom />} {...props}>
    {label}
  </Button>
);

export default DownloadButton;
