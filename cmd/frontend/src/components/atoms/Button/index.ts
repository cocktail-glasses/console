import { MouseEventHandler } from 'react';
import Button from './Button'
import ButtonIcon from './ButtonIcon'

export { Button, ButtonIcon }


export interface ButtonProps {
  onClick: MouseEventHandler;
}
