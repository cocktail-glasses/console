import { forwardRef } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';

import { isUndefined } from 'lodash';

import TextField from '@components/molecules/KaaS/Form/TextField';

interface ControlledTextFieldProps
  extends UseControllerProps,
    Omit<React.ComponentPropsWithRef<typeof TextField>, 'name' | 'defaultValue'> {
  control?: any;
  // 입력 필드가 disabled 상태에서 값이 존재하지만, form 인스턴스에는 undefined로 넘겨주고 싶은 경우 사용
  useFormDisabled?: boolean;
}

const ControlledTextField = forwardRef(
  (
    {
      name,
      control,
      defaultValue,
      rules,
      shouldUnregister,
      useFormDisabled = false,
      ...props
    }: ControlledTextFieldProps,
    ref: any
  ) => {
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
      <TextField
        {...props}
        {...field}
        ref={ref}
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
  }
);

export default ControlledTextField;
