import Controller from './Controller';

import SelectField from '@components/molecules/KaaS/Form/SelectField';

interface ControlledSelectFieldProps
  extends Omit<React.ComponentPropsWithRef<typeof Controller>, 'render'>,
    Omit<React.ComponentPropsWithoutRef<typeof SelectField>, 'name' | 'defaultValue'> {}

const ControlledSelectField = ({
  name,
  control,
  defaultValue,
  rules,
  shouldUnregister,
  disabled,
  ...props
}: ControlledSelectFieldProps) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      shouldUnregister={shouldUnregister}
      disabled={disabled}
      render={({ field, fieldState }) => (
        <SelectField {...props} {...field} error={fieldState.invalid} helperText={fieldState.error?.message} />
      )}
    />
  );
};

export default ControlledSelectField;
