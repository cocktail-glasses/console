import { useController, UseControllerProps } from 'react-hook-form';

import { isUndefined } from 'lodash';

import TextField from '@components/molecules/KaaS/Form/TextField';

interface ControlledTextFieldProps
  extends UseControllerProps,
    Omit<React.ComponentPropsWithoutRef<typeof TextField>, 'name' | 'defaultValue'> {
  control?: any;
}

const ControlledTextField = ({
  name,
  control,
  defaultValue,
  rules,
  shouldUnregister,
  disabled,
  ...props
}: ControlledTextFieldProps) => {
  const {
    field,
    fieldState: { invalid, error },
  } = useController({ name, control, defaultValue, rules, shouldUnregister, disabled });
  return (
    <TextField
      {...props}
      {...field}
      error={invalid}
      helperText={isUndefined(error?.message) ? props.helperText : error?.message}
    />
  );
};

export default ControlledTextField;
