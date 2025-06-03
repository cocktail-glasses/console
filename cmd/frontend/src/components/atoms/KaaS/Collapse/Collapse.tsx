import { Collapse as CollapseBase } from '@mui/material';

import style from './Collapse.module.scss';

import clsx from 'clsx';

export interface CollapseProps extends Omit<React.ComponentPropsWithoutRef<typeof CollapseBase>, 'in'> {
  isCollapse: boolean;
  data: any;
}

const Collapse = ({ isCollapse, data, ...props }: CollapseProps) => (
  <CollapseBase {...props} in={!isCollapse} className={clsx(style.collapseContent, props.className)}>
    {data}
  </CollapseBase>
);

export default Collapse;
