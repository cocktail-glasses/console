import { MenuItem, Checkbox, ListItemText } from '@mui/material';

import { map } from 'lodash';

import TextField from './TextField';

export interface SelectItem {
  label: string;
  value: string;
}

interface CheckSelectFieldProps extends React.ComponentPropsWithRef<typeof TextField> {
  value?: string[];
  displayFn?: (selected: string[]) => string;
  items: SelectItem[];
}

const defaultDisplayFn = (selected: string[]) => selected.join(', ');

const CheckSelectField = ({ value = [], displayFn = defaultDisplayFn, items, ...props }: CheckSelectFieldProps) => {
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
    <TextField
      {...props}
      select
      slotProps={{
        select: {
          multiple: true,
          value: value,
          renderValue: (s: any) => displayFn(s),
          MenuProps: MenuProps,
        },
      }}
    >
      {map(items, (item) => (
        <MenuItem value={item.value} key={item.label}>
          <Checkbox checked={value?.includes(item.value)} />
          <ListItemText primary={item.label} />
        </MenuItem>
      ))}
    </TextField>
  );
};

export default CheckSelectField;
