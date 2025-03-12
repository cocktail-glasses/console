import { Box } from '@mui/material';

import cond from 'lodash/cond';
import constant from 'lodash/constant';
import curry from 'lodash/curry';
import eq from 'lodash/eq';
import stubTrue from 'lodash/stubTrue';

import style from './DotStatus.module.scss';
import DotStatusEnum from './DotStatusEnum';

import clsx from 'clsx';

interface DotStatusProps {
  status?: DotStatusEnum;
}

const statusStyle = (status: DotStatusEnum) => {
  const equal = curry(eq);

  return cond([
    [equal(DotStatusEnum.SUCCESS), constant(style.success)],
    [equal(DotStatusEnum.ERROR), constant(style.error)],
    [equal(DotStatusEnum.WARNING), constant(style.warning)],
    [stubTrue, constant(style.default)],
  ])(status);
};

const DotStatus = ({ status = DotStatusEnum.DEFAULT }: DotStatusProps) => (
  <Box className={style.dotStatusContainer}>
    <Box className={clsx(style.dotStatus, statusStyle(status))} />
  </Box>
);

export default DotStatus;
