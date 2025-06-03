import { Box, Drawer, Typography } from '@mui/material';

import { merge } from 'lodash';

import Editor, { EditorProps } from '../../../molecules/KaaS/Editor/Editor';

import Button from '@components/atoms/KaaS/Button/Button';

interface DrawerEditorProps extends React.ComponentPropsWithoutRef<typeof Drawer> {
  title: string;
  value?: string;
  editorProps?: Omit<EditorProps, 'value'>;
}

const DrawerEditor = ({ title, value, editorProps, ...props }: DrawerEditorProps) => {
  const HeaderZIndex = 1200;

  return (
    <Drawer {...props} anchor={props.anchor || 'right'} sx={merge({ zIndex: HeaderZIndex + 1 }, props.sx)}>
      <Box sx={{ width: '50vw', p: 1, paddingRight: 0 }}>
        <Typography>{title}</Typography>
        <Editor {...editorProps} value={value} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 }}>
          <Button onClick={(e) => props.onClose && props.onClose(e, 'backdropClick')}>Close</Button>
          <Button variant={'contained'}>Update</Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default DrawerEditor;
