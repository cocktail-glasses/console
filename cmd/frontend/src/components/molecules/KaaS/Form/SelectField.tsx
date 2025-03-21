import { forwardRef, ReactNode } from 'react';

import { MenuItem } from '@mui/material';

import { has, isObject, isString, map } from 'lodash';

import TextField from './TextField';

export interface SelectItem {
  label: ReactNode;
  value: string;
}

interface SelectFieldProps extends React.ComponentPropsWithRef<typeof TextField> {
  items: SelectItem[] | string[];
}

const SelectField = forwardRef(({ items, ...props }: SelectFieldProps, ref: any) => {
  const isSelectItem = (item: any): item is SelectItem => {
    if (!isObject(item)) return false;

    return has(item, 'label') && has(item, 'value');
  };

  return (
    <TextField select {...props} ref={ref}>
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
    </TextField>
  );
});

export default SelectField;
