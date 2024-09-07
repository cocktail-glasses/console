import Box from '@mui/material/Box';
import { BoxProps } from './index.ts'


function BoxBasic(props: BoxProps) {
  const { children } = props;
  return (
    <Box sx={{ p: 1 }}>
      {children}
    </Box>
  );
}

export default BoxBasic