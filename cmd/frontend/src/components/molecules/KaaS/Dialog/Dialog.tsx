import { ReactElement } from 'react';

import { Dialog as DialogBase, Divider, SxProps, Theme } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import style from './Dialog.module.scss';

import Content from '@components/atoms/KaaS/Dialog/Content/Content';
import Footer from '@components/atoms/KaaS/Dialog/Footer/Footer';
import Title from '@components/atoms/KaaS/Dialog/Title/Title';
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

const Dialog = ({
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
}: DialogBaseProps) => {
  const theme = useTheme();

  return (
    <DialogBase open={isOpen} onClose={onClose} className={clsx(theme.palette.mode, style.dialog)} {...props}>
      <Title title={title} closeBtn={closeBtn} onClose={onClose} className={titleClassName} />
      <Content content={content} className={contentClassName} />
      {footer && (
        <>
          <Divider />
          <Footer footer={footer} className={footerClassName} />
        </>
      )}
    </DialogBase>
  );
};

export default Dialog;
