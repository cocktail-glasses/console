import { ElementType, forwardRef } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';

import { isUndefined } from 'lodash';

import SelectField from '@components/molecules/KaaS/Form/SelectField';
import TextField from '@components/molecules/KaaS/Form/TextField';

type ComponentType = React.ComponentProps<typeof TextField> | React.ComponentProps<typeof SelectField>;

interface ConttrolledFieldProps<T extends Omit<ComponentType, 'component'>>
  extends UseControllerProps,
    Omit<ComponentType, 'name' | 'defaultValue'> {
  control?: any;
  component: ElementType<T>;
  // 입력 필드가 disabled 상태에서 값이 존재하지만, form 인스턴스에는 undefined로 넘겨주고 싶은 경우 사용
  useFormDisabled?: boolean;
}

const ControlledField = forwardRef(
  <T extends ComponentType>(
    {
      name,
      control,
      defaultValue,
      rules,
      shouldUnregister,
      useFormDisabled = false,
      component,
      ...props
    }: ConttrolledFieldProps<T>,
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
        component={component}
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

export default ControlledField;
