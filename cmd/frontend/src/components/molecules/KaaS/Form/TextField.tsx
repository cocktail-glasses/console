import { FormControl, TextField as TextFieldBase, FormHelperText } from '@mui/material';

interface TextFieldProps {
  isRequired?: boolean;
  label: string;
  value?: string;
  onChange?: (...e: any[]) => void;
  error?: boolean;
  errorMessage?: string;
}

const TextField = ({ isRequired = false, label, value, onChange, error, errorMessage }: TextFieldProps) => (
  <FormControl fullWidth required={isRequired} error={error}>
    <TextFieldBase label={label} variant="outlined" value={value} onChange={onChange} required={isRequired} />
    <FormHelperText>{errorMessage}</FormHelperText>
  </FormControl>
);

export default TextField;
