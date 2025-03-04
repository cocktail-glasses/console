import { FormControl, InputLabel, MenuItem, Select, FormHelperText, InputBaseProps } from '@mui/material';

import { has, isObject, isString, map } from 'lodash';

export interface SelectItem {
  label: string;
  value: string;
}

interface SelectFieldProps extends InputBaseProps {
  isRequired?: boolean;
  label: string;
  value?: string;
  onChange?: (...e: any[]) => void;
  items: SelectItem[] | string[];
  error?: boolean;
  errorMessage?: string;
}

const SelectField = ({
  isRequired = false,
  label,
  value,
  onChange,
  items,
  error,
  errorMessage,
  ...props
}: SelectFieldProps) => {
  const isSelectItem = (item: any): item is SelectItem => {
    if (!isObject(item)) return false;

    return has(item, 'label') && has(item, 'value');
  };

  return (
    <FormControl fullWidth required={isRequired} error={error}>
      <InputLabel variant="outlined" required={isRequired}>
        {label}
      </InputLabel>
      <Select variant="outlined" value={value} onChange={onChange} label={label} {...props}>
        {map(items, (item) =>
          isSelectItem(item) ? (
            <MenuItem value={item.value} key={item.value}>
              {item.label}
            </MenuItem>
          ) : isString(item) ? (
            <MenuItem value={item} key={item}>
              {item}
            </MenuItem>
          ) : null
        )}
      </Select>
      <FormHelperText>{errorMessage}</FormHelperText>
    </FormControl>
  );
};

export default SelectField;
