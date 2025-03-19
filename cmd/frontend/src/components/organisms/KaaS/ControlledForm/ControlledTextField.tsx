import Controller from './Controller';

import TextField from '@components/molecules/KaaS/Form/TextField';

interface ControlledTextFieldProps
  extends Omit<React.ComponentPropsWithRef<typeof Controller>, 'render'>,
    Omit<React.ComponentPropsWithoutRef<typeof TextField>, 'name' | 'defaultValue'> {}

const ControlledTextField = ({
  name,
  control,
  defaultValue,
  rules,
  shouldUnregister,
  disabled,
  ...props
}: ControlledTextFieldProps) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      shouldUnregister={shouldUnregister}
      disabled={disabled}
      render={({ field, fieldState }) => (
        <TextField {...props} {...field} error={fieldState.invalid} helperText={fieldState.error?.message} />
      )}
    />
  );
};

export default ControlledTextField;
