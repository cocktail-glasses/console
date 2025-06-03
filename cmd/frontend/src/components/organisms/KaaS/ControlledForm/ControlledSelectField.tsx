import { useController, UseControllerProps } from 'react-hook-form';

import { isUndefined } from 'lodash';

import SelectField from '@components/molecules/KaaS/Form/SelectField';

interface ControlledSelectFieldProps
  extends Omit<UseControllerProps, 'render'>,
    Omit<React.ComponentPropsWithRef<typeof SelectField>, 'name' | 'defaultValue'> {
  control?: any;
  // 입력 필드가 disabled 상태에서 값이 존재하지만, form 인스턴스에는 undefined로 넘겨주고 싶은 경우 사용
  useFormDisabled?: boolean;
}

const ControlledSelectField = ({
  name,
  control,
  defaultValue,
  rules,
  shouldUnregister,
  useFormDisabled = false,
  ...props
}: ControlledSelectFieldProps) => {
  const {
    field,
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
    defaultValue,
    rules,
    shouldUnregister,
    disabled: useFormDisabled ? props.disabled : undefined,
  });

  return (
    <SelectField
      {...props}
      {...field}
      onChange={(e) => {
        props.onChange && props.onChange(e);
        field.onChange(e);
      }}
      onBlur={(e) => {
        props.onBlur && props.onBlur(e);
        field.onBlur();
      }}
      error={invalid}
      helperText={isUndefined(error?.message) ? props.helperText : error?.message}
    />
  );
};

export default ControlledSelectField;
