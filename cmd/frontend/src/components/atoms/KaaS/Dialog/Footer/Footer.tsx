import { ReactElement } from 'react';

import { DialogActions } from '@mui/material';

import style from './Footer.module.scss';

import clsx from 'clsx';

interface FooterProps {
  footer?: ReactElement;
  className?: string;
}

const Footer = ({ footer, className }: FooterProps) => {
  return <DialogActions className={clsx(style.actionGroup, className)}>{footer}</DialogActions>;
};

export default Footer;
