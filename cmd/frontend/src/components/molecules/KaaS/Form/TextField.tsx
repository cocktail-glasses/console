import { forwardRef } from 'react';

import { TextField as TextFieldBase } from '@mui/material';

import { get } from 'lodash';

import style from './Form.module.scss';

import clsx from 'clsx';

const TextField = forwardRef(({ ...props }: React.ComponentProps<typeof TextFieldBase>, ref: any) => (
  <TextFieldBase
    {...props}
    ref={ref}
    required={get(props, 'required', false)}
    fullWidth={get(props, 'fullWidth', true)}
    variant={get(props, 'variant', 'outlined')}
    className={clsx(style.form, props.className)}
  />
));

export default TextField;
