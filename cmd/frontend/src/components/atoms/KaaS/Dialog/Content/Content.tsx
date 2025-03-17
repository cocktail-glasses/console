import { ReactElement } from 'react';

import { DialogContent } from '@mui/material';

import style from './Content.module.scss';

import clsx from 'clsx';

interface ContentProp {
  content: ReactElement;
  className?: string;
}

const Content = ({ content, className }: ContentProp) => (
  <DialogContent className={clsx(style.content, className)}>{content}</DialogContent>
);

export default Content;
