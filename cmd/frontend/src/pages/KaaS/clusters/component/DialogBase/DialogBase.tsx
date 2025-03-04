import { ReactElement } from 'react';

import { Close } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogActions, DialogContent, IconButton, Divider, SxProps, Theme } from '@mui/material';

import style from './DialogBase.module.scss';

import clsx from 'clsx';

export interface DialogBaseProps {
  isOpen: boolean;
  onClose: (...event: any[]) => void;
  closeBtn?: boolean;
  title: string | ReactElement;
  content: ReactElement;
  footer?: ReactElement;
  titleClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  sx?: SxProps<Theme>;
}

const DialogBase: React.FC<DialogBaseProps> = ({
  isOpen,
  onClose,
  closeBtn,
  title,
  content,
  footer,
  titleClassName,
  contentClassName,
  footerClassName,
  ...props
}) => (
  <Dialog open={isOpen} onClose={onClose} className={clsx(style.dialog, titleClassName)} {...props}>
    <DialogTitle>{title}</DialogTitle>
    {closeBtn && (
      <IconButton aria-label="close" className={style.closeBtn} onClick={onClose}>
        <Close />
      </IconButton>
    )}
    <DialogContent className={clsx(style.content, contentClassName)}>{content}</DialogContent>
    {footer && (
      <>
        <Divider />
        <DialogActions className={clsx(style.actionGroup, footerClassName)}>{footer}</DialogActions>
      </>
    )}
  </Dialog>
);

export default DialogBase;
