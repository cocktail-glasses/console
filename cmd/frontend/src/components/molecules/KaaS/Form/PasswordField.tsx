import { useState } from 'react';

import { VisibilityOff, Visibility } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';

import TextField from './TextField';

const PasswordField = ({ ...props }: React.ComponentPropsWithRef<typeof TextField>) => {
  // user credential password
  const [isPasswordShow, setIsPasswordShow] = useState(false);

  // disabled된 경우 무조건 패스워드를 가린다.
  const isShow = isPasswordShow && !props.disabled;

  return (
    <TextField
      {...props}
      disabled={props.disabled}
      type={isPasswordShow ? 'text' : 'password'}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                disabled={props.disabled}
                onClick={(e) => {
                  e.preventDefault();
                  setIsPasswordShow((prev) => !prev);
                }}
                edge="end"
              >
                {isShow ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export default PasswordField;
