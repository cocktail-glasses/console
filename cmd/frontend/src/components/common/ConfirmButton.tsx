import { useState } from 'react';
import { Fragment } from 'react/jsx-runtime';

import Button, { ButtonProps } from '@mui/material/Button';

import { ConfirmDialog } from '@components/common/Dialog';

export interface ConfirmButtonProps extends ButtonProps {
  buttonComponent?: typeof Button;
  ariaLabel?: string;
  confirmTitle: string;
  confirmDescription: string;
  onConfirm: (...args: any[]) => void;
  [otherProps: string]: any;
}

export default function ConfirmButton(props: ConfirmButtonProps) {
  const { buttonComponent, ariaLabel, confirmTitle, confirmDescription, onConfirm, children, ...other } = props;
  const [openConfirm, setOpenConfirm] = useState(false);

  const ButtonComponent = buttonComponent || Button;

  return (
    <Fragment>
      <ButtonComponent aria-label={ariaLabel} onClick={() => setOpenConfirm(true)} children={children} {...other} />
      <ConfirmDialog
        open={openConfirm}
        title={confirmTitle}
        description={confirmDescription}
        handleClose={() => setOpenConfirm(false)}
        onConfirm={onConfirm}
      />
    </Fragment>
  );
}
