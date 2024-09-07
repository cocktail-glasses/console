import { SxProps } from '@mui/material';

import BoxBasic from './BoxBasic.tsx';

export interface BoxProps {
  sx?: SxProps;
  children: React.ReactNode | React.ReactElement;
}

export { BoxBasic };
