import { ReactNode } from 'react';

import { VerticalAlignBottom } from '@mui/icons-material';

import Button from '@components/atoms/KaaS/Button/Button';

interface DownloadButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  label?: ReactNode;
}

const DownloadButton = ({ label, ...props }: DownloadButtonProps) => (
  <Button variant="contained" startIcon={<VerticalAlignBottom />} {...props}>
    {label}
  </Button>
);

export default DownloadButton;
