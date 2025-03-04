import { ChangeEvent } from 'react';

import { Search as SearchIcon } from '@mui/icons-material';
import { BaseTextFieldProps, InputAdornment, TextField } from '@mui/material';

import { isFunction } from 'lodash';

interface SearchbarProps extends BaseTextFieldProps {
  value?: string;
  onChange?: (event: ChangeEvent, value: string) => void;
}

const Searchbar = ({ value, onChange, ...props }: SearchbarProps) => {
  return (
    <TextField
      variant="outlined"
      size="small"
      placeholder="Search"
      value={value}
      onChange={(e) => isFunction(onChange) && onChange(e, e.target.value)}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        },
      }}
      {...props}
    />
  );
};

export default Searchbar;
