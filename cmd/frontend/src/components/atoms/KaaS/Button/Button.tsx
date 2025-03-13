import { Button as ButtonBase } from '@mui/material';

import style from './Buttom.module.scss';

import clsx from 'clsx';

export interface ButtonProps extends React.ComponentPropsWithoutRef<typeof ButtonBase> {
  textTransform?: 'capitalize' | 'uppercase' | 'lowercase' | 'none';
}

const Button = ({ textTransform, ...props }: ButtonProps) => {
  return (
    <ButtonBase
      {...props}
      className={clsx(style.buttonBase, props.className, style[`text-transform-${textTransform}`])}
    />
  );
};

export default Button;
