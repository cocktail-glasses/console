import { TextField as TextFieldBase } from '@mui/material';

import { get } from 'lodash';

import style from './Form.module.scss';

import clsx from 'clsx';

const TextField = ({ ...props }: React.ComponentPropsWithoutRef<typeof TextFieldBase>) => (
  <TextFieldBase
    {...props}
    required={get(props, 'required', false)}
    fullWidth={get(props, 'fullWidth', true)}
    variant={get(props, 'variant', 'outlined')}
    className={clsx(style.form, props.className)}
  />
);

export default TextField;
