import { forwardRef, Ref, useState, } from 'react';
import TextField from '@mui/material/TextField';
import { InputProps, sxProps } from './index.ts';

function InputText(props: InputProps, ref: Ref<HTMLDivElement>) {
  const { ...other } = props;
  const [focus, setFocus] = useState(false)

  return (
    <TextField
      {...other}
      ref={ref}
      variant="standard"
      onFocus={() => setFocus(true)}
      focused={focus}
      sx={sxProps}
    />
  );
}

export default forwardRef(InputText)