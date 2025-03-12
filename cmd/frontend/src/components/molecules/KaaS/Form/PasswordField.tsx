import { useState } from 'react';

import { VisibilityOff, Visibility } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';

import TextField from './TextField';

const PasswordField = ({ ...props }: React.ComponentPropsWithoutRef<typeof TextField>) => {
  // user credential password
  const [isPasswordShow, setIsPasswordShow] = useState(false);

  return (
    <TextField
      type={isPasswordShow ? 'text' : 'password'}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={(e) => {
                  e.preventDefault();
                  setIsPasswordShow((prev) => !prev);
                }}
                edge="end"
              >
                {isPasswordShow ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      {...props}
    />
  );
};

export default PasswordField;
