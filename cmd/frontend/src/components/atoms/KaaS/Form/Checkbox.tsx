import { Checkbox as CheckboxBase } from '@mui/material';

const Checkbox = ({ checked = false, ...props }: React.ComponentPropsWithoutRef<typeof CheckboxBase>) => {
  return <CheckboxBase checked={checked} {...props} />;
};

export default Checkbox;
