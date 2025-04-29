import { Box } from '@mui/material';

import cond from 'lodash/cond';
import constant from 'lodash/constant';
import curry from 'lodash/curry';
import eq from 'lodash/eq';
import stubTrue from 'lodash/stubTrue';

import style from './DotStatus.module.scss';

import clsx from 'clsx';

export type Status = 'success' | 'warning' | 'error' | 'default';

interface DotStatusProps {
  status?: Status;
}

const statusStyle = (status: Status) => {
  const equal = curry(eq);

  return cond([
    [equal('success'), constant(style.success)],
    [equal('error'), constant(style.error)],
    [equal('warning'), constant(style.warning)],
    [stubTrue, constant(style.default)],
  ])(status);
};

const DotStatus = ({ status = 'default' }: DotStatusProps) => (
  <Box className={style.dotStatusContainer}>
    <Box className={clsx(style.dotStatus, statusStyle(status))} />
  </Box>
);

export default DotStatus;
