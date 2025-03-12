import { Search as SearchIcon } from '@mui/icons-material';
import { InputAdornment } from '@mui/material';

import TextField from './TextField';

const Searchbar = ({ ...props }: React.ComponentPropsWithoutRef<typeof TextField>) => {
  return (
    <TextField
      variant="outlined"
      size="small"
      placeholder="Search"
      fullWidth={false}
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
