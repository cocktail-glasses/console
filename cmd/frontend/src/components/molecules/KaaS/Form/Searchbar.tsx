import { Search as SearchIcon } from '@mui/icons-material';
import { InputAdornment } from '@mui/material';

import { get } from 'lodash';

import TextField from './TextField';

const Searchbar = ({ ...props }: React.ComponentPropsWithoutRef<typeof TextField>) => {
  return (
    <TextField
      {...props}
      variant={get(props, 'variant', 'outlined')}
      size={get(props, 'size', 'small')}
      placeholder={get(props, 'placeholder', 'Search')}
      fullWidth={get(props, 'fullWidth', false)}
      slotProps={get(props, 'slotProps', {
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        },
      })}
    />
  );
};

export default Searchbar;
