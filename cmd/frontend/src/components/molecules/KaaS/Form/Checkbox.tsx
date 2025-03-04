import { ChangeEvent } from 'react';

import { FormControlLabel, Checkbox as CheckboxBase } from '@mui/material';

interface CheckboxProps {
  label: string;
  value?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox = ({ label, value = false, onChange }: CheckboxProps) => {
  return <FormControlLabel control={<CheckboxBase checked={value} onChange={onChange} />} label={label} key={label} />;
};

export default Checkbox;
