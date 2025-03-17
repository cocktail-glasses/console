import { TextField as TextFieldBase } from '@mui/material';

interface TextFieldProps extends React.ComponentPropsWithoutRef<typeof TextFieldBase> {
  required?: boolean;
}

const TextField = ({ required = false, ...props }: TextFieldProps) => (
  <TextFieldBase required={required} fullWidth variant="outlined" {...props} />
);

export default TextField;
