import { VerticalAlignBottom } from '@mui/icons-material';
import { Button } from '@mui/material';

interface DownloadButtonProps {
  label?: string;
}

const DownloadButton = ({ label, ...props }: DownloadButtonProps) => (
  <Button variant="contained" startIcon={<VerticalAlignBottom />} {...props}>
    {label}
  </Button>
);

export default DownloadButton;
