import Box from '@mui/material/Box';

import { BoxProps } from '.';
import './box.scss';

function BoxBasic(props: BoxProps) {
  const { children } = props;
  return <Box className="box-basic">{children}</Box>;
}

export default BoxBasic;
