import { Stack, Typography } from '@mui/material';

import './index.scss';

export interface Description {
  label?: string;
  value: string;
}

interface DescriptionItemProps {
  description: Description;
}

const DescriptionItem: React.FC<DescriptionItemProps> = ({ description }) => (
  <Stack className="description-item" sx={{ marginRight: '30px', height: '62px' }}>
    <Typography className="caption" variant="caption">
      {description.label}
    </Typography>
    <Typography variant="body1" sx={{ lineHeight: '1.66' }}>
      {description.value}
    </Typography>
  </Stack>
);

export default DescriptionItem;
