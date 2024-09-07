import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { BoxProps } from './index.ts'


function BoxBoader(props: BoxProps) {
  const { children, sx } = props;
  const theme = useTheme();
  return (
    <Box sx={{ p: 2, borderRadius: 2, borderWidth: '1px', borderStyle: 'solid', borderColor: theme.palette.primary.dark, backgroundColor: theme.palette.background.paper, ...sx }}>
      {children}
    </Box>
  );
}

export default BoxBoader