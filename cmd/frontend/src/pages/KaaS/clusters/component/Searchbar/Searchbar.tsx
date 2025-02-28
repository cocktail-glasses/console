import { ChangeEvent } from 'react';

import { Search as SearchIcon } from '@mui/icons-material';
import { InputAdornment, TextField } from '@mui/material';

interface SearchbarProps {
  value?: string;
  onChange: (event: ChangeEvent, value: string) => void;
}

const Searchbar: React.FC<SearchbarProps> = ({ value, onChange }) => {
  return (
    <TextField
      variant="outlined"
      size="small"
      placeholder="Search"
      value={value}
      onChange={(e) => onChange(e, e.target.value)}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export default Searchbar;
