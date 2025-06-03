import { FormControlLabel } from '@mui/material';

import Checkbox from '@components/atoms/KaaS/Form/Checkbox';

const CheckboxLabel = ({ ...props }: Omit<React.ComponentPropsWithRef<typeof FormControlLabel>, 'control'>) => (
  <FormControlLabel control={<Checkbox />} {...props} />
);

export default CheckboxLabel;
