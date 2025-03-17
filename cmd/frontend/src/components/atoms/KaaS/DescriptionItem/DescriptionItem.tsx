import { Stack, Typography } from '@mui/material';

import style from './DescriptionItem.module.scss';

export interface Description {
  label?: string;
  value: string;
}

interface DescriptionItemProps {
  description: Description;
}

const DescriptionItem = ({ description }: DescriptionItemProps) => (
  <Stack className={style.descriptionItem} sx={{ marginRight: '30px', height: '62px' }}>
    <Typography className={style.caption} variant="caption">
      {description.label}
    </Typography>
    <Typography variant="body1" sx={{ lineHeight: '1.66' }}>
      {description.value}
    </Typography>
  </Stack>
);

export default DescriptionItem;
