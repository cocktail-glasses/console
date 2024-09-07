import { forwardRef, Ref, useState } from 'react';

import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import { InputProps, sxProps } from './index.ts';

interface SelectElementProps extends InputProps {
  options?: any[];
}

function InputSelect(props: SelectElementProps, ref: Ref<HTMLDivElement>) {
  const [focus, setFocus] = useState(false);
  const { options = [], ...other } = props;

  return (
    <TextField
      {...other}
      ref={ref}
      variant="standard"
      onFocus={() => setFocus(true)}
      focused={focus}
      select
      sx={sxProps}
    >
      {options.map((item, idx) => {
        const key = `${props.name}_option_${idx}`;
        return (
          <MenuItem key={key} value={item.value}>
            {item.label}
          </MenuItem>
        );
      })}
    </TextField>
  );
}

export default forwardRef(InputSelect);
