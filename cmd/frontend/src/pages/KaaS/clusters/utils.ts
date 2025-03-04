import cond from 'lodash/cond';
import constant from 'lodash/constant';
import curry from 'lodash/curry';
import eq from 'lodash/eq';
import stubTrue from 'lodash/stubTrue';
import toLower from 'lodash/toLower';

import { DotStatusEnum } from '../../../components/atoms/KaaS/DotStatus';

export const getDotStatus = (status?: string) => {
  const equal = curry(eq);

  return cond([
    [equal('loading'), constant(DotStatusEnum.WARNING)],
    [equal('ready'), constant(DotStatusEnum.SUCCESS)],
    [equal('error'), constant(DotStatusEnum.ERROR)],
    [stubTrue, constant(DotStatusEnum.DEFAULT)],
  ])(toLower(status));
};
