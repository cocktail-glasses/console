import { MoreVert } from '@mui/icons-material';
import { Button } from '@mui/material';

import style from './ContextMenuButton.module.scss';

const ContextMenuButton = () => (
  <Button variant="outlined" className={style.contextMenuBtn}>
    <MoreVert sx={{ color: 'white' }} />
  </Button>
);

export default ContextMenuButton;
