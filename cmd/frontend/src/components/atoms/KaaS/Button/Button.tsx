import { Button as ButtonBase, ButtonProps as ButtonBaseProps } from '@mui/material';

import style from './Buttom.module.scss';

import clsx from 'clsx';

export interface ButtonProps extends ButtonBaseProps {
  className?: string;
  textTransform?: 'capitalize' | 'uppercase' | 'lowercase' | 'none';
}

const Button = ({ className, textTransform, ...props }: ButtonProps) => (
  <ButtonBase className={clsx(style.buttonBase, className, style[`text-transform-${textTransform}`])} {...props} />
);

export default Button;
