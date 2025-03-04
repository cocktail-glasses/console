import { Box, Collapse as CollapseBase } from '@mui/material';

import style from './Collapse.module.scss';

export interface CollapseProps {
  isCollapse: boolean;
  data: any;
}

const Collapse = ({ isCollapse, data }: CollapseProps) => (
  <CollapseBase in={!isCollapse}>
    <Box className={style.collapseContent}>{data}</Box>
  </CollapseBase>
);

export default Collapse;
