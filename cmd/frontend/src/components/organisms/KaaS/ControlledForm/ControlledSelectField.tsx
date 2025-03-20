import { useController } from 'react-hook-form';

import { isUndefined } from 'lodash';

import Controller from './Controller';

import SelectField from '@components/molecules/KaaS/Form/SelectField';

interface ControlledSelectFieldProps
  extends Omit<React.ComponentPropsWithRef<typeof Controller>, 'render'>,
    Omit<React.ComponentPropsWithoutRef<typeof SelectField>, 'name' | 'defaultValue'> {
  control?: any;
}

const ControlledSelectField = ({
  name,
  control,
  defaultValue,
  rules,
  shouldUnregister,
  disabled,
  ...props
}: ControlledSelectFieldProps) => {
  const {
    field,
    fieldState: { invalid, error },
  } = useController({ name, control, defaultValue, rules, shouldUnregister, disabled });

  return (
    <SelectField
      {...props}
      {...field}
      error={invalid}
      helperText={isUndefined(error?.message) ? props.helperText : error?.message}
    />
  );
};

export default ControlledSelectField;
