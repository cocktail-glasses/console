import { forwardRef, MouseEvent, Ref, useState } from 'react';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { IconButton, InputAdornment } from '@mui/material';
import TextField from '@mui/material/TextField';

import { InputProps, sxProps } from './index.ts';

interface PasswordElementProps extends InputProps {
  iconColor?: any;
}

function InputPassword(props: PasswordElementProps, ref: Ref<HTMLDivElement>) {
  const { iconColor, ...other } = props;
  const [focus, setFocus] = useState<boolean>(false);
  const [password, setPassword] = useState<boolean>(true);

  return (
    <TextField
      {...other}
      ref={ref}
      variant="standard"
      onFocus={() => setFocus(true)}
      focused={focus}
      InputProps={{
        endAdornment: (
          <InputAdornment position={'end'}>
            <IconButton
              onMouseDown={(e: MouseEvent<HTMLButtonElement>) => e.preventDefault()}
              onClick={() => setPassword(!password)}
              tabIndex={-1}
              color={iconColor ?? 'default'}
            >
              {password ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      type={password ? 'password' : 'text'}
      sx={sxProps}
    />
  );
}

export default forwardRef(InputPassword);
