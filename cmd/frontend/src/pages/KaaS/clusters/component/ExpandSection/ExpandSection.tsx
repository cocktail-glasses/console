import { Box, Collapse } from '@mui/material';

import CollapseButton from './CollapseButton';

const ExpandSection = ({ isCollapse, onChangeCollapse, label, data }) => (
  <>
    <CollapseButton label={label} isCollapse={isCollapse} handleOnChange={onChangeCollapse} />
    <Collapse in={!isCollapse}>
      <Box sx={{ padding: '0 60px', display: 'flex', flexWrap: 'wrap' }}>{data}</Box>
    </Collapse>
  </>
);

export default ExpandSection;
