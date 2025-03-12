import { ReactElement } from 'react';

import { ExpandMore } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

import style from './CollapseButton.module.scss';

import clsx from 'clsx';

export interface CollapseButtonProps {
  label: string | ReactElement;
  isCollapse: boolean;
  onChange: (...event: any[]) => void;
}

const CollapseButton = ({ label, isCollapse, onChange }: CollapseButtonProps) => {
  return (
    <Box className={style.collapseButton} onClick={onChange}>
      <Box component="hr" className={style.line} />
      <Box className={style.labelContainer}>
        <Typography className={style.label} variant="subtitle1">
          {label}
        </Typography>
        <ExpandMore className={clsx({ [style.iconArrowUp]: isCollapse })} />
      </Box>
      <Box component="hr" className={style.line} />
    </Box>
  );
};

export default CollapseButton;
