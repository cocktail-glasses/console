import { MouseEventHandler } from 'react';
import Button from './Button.tsx'
import ButtonIcon from './ButtonIcon.tsx'

export { Button, ButtonIcon }


export interface ButtonProps {
  onClick: MouseEventHandler;
}
