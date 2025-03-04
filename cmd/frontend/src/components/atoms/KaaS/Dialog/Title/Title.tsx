import { ReactElement } from 'react';

import { Close } from '@mui/icons-material';
import { DialogTitle, IconButton } from '@mui/material';

import style from './Title.module.scss';

import clsx from 'clsx';

interface TitleProp {
  title: string | ReactElement;
  closeBtn?: boolean;
  onClose?: (...event: any[]) => void;
  className?: string;
}

const Title = ({ title, closeBtn, onClose, className }: TitleProp) => {
  return (
    <>
      <DialogTitle className={clsx(className)}>{title}</DialogTitle>
      {closeBtn && (
        <IconButton aria-label="close" className={style.closeBtn} onClick={onClose}>
          <Close />
        </IconButton>
      )}
    </>
  );
};

export default Title;
