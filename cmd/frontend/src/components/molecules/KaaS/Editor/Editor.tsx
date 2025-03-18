import { useTheme } from '@mui/material/styles';

import { EditorTheme } from './types';

import { Editor as EditorBase } from '@monaco-editor/react';

export interface EditorProps extends Omit<React.ComponentPropsWithoutRef<typeof EditorBase>, 'theme'> {
  theme?: EditorTheme;
}

const Editor = ({ theme, ...props }: EditorProps) => {
  const muiTheme = useTheme();
  const defaultTheme = muiTheme.palette.mode === 'light' ? EditorTheme.Light : EditorTheme.Dark;

  return (
    <EditorBase
      {...props}
      height={props.height || '94vh'}
      language={props.language || 'yaml'}
      theme={theme || defaultTheme}
    />
  );
};

export default Editor;
