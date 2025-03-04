import { ReactElement } from 'react';

import { ExpandMore } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

import style from './ExpandSection.module.scss';

import clsx from 'clsx';

interface CollapseButtonProps {
  label: string | ReactElement;
  isCollapse: boolean;
  handleOnChange: (...event: any[]) => void;
}

const CollapseButton = ({ label, isCollapse, handleOnChange }: CollapseButtonProps) => {
  return (
    <Box className={style.collapseButton} onClick={handleOnChange}>
      <hr className={style.line} />
      <Box className={style.labelContainer}>
        <Typography className={style.label} variant="subtitle1">
          {label}
        </Typography>
        <ExpandMore className={clsx({ [style.iconArrowUp]: isCollapse })} />
      </Box>
      <hr className={style.line} />
    </Box>
  );
};

export default CollapseButton;
