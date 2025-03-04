import { ReactNode } from 'react';

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  OutlinedInput,
  Checkbox,
  ListItemText,
  SelectChangeEvent,
} from '@mui/material';

import { map } from 'lodash';

export interface SelectItem {
  label: string;
  value: string;
}

interface CheckSelectFieldProps {
  isRequired?: boolean;
  label: string;
  value?: string[];
  onChange?: (event: SelectChangeEvent<string[]>, child: ReactNode) => void;
  displayFn?: (selected: string[]) => string;
  error?: boolean;
  errorMessage?: string;
  items: SelectItem[];
}

const defaultDisplayFn = (selected: string[]) => selected.join(', ');

const CheckSelectField = ({
  isRequired = false,
  label,
  value = [],
  onChange,
  displayFn = defaultDisplayFn,
  error,
  errorMessage,
  items,
}: CheckSelectFieldProps) => {
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  return (
    <FormControl required={isRequired} fullWidth error={error}>
      <InputLabel variant="outlined">{label}</InputLabel>
      <Select
        aria-label="check select"
        variant="outlined"
        multiple
        value={value}
        onChange={onChange}
        input={<OutlinedInput label={label} />}
        renderValue={displayFn}
        MenuProps={MenuProps}
      >
        {map(items, (item) => (
          <MenuItem value={item.value}>
            <Checkbox checked={value?.includes(item.value)} />
            <ListItemText primary={item.label} />
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{errorMessage}</FormHelperText>
    </FormControl>
  );
};

export default CheckSelectField;
