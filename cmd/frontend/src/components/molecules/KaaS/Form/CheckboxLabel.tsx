import { FormControlLabel } from '@mui/material';

import Checkbox from '@components/atoms/KaaS/Form/Checkbox';

// control 필드와 {...props} 순서를 바꿔서 오버라이딩하는 대신 control 필드를 노출하지 않는다.
const CheckboxLabel = ({ ...props }: Omit<React.ComponentPropsWithoutRef<typeof FormControlLabel>, 'control'>) => (
  <FormControlLabel control={<Checkbox />} {...props} />
);

export default CheckboxLabel;
