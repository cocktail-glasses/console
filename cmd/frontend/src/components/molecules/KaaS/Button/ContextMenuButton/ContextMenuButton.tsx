import { MoreVert } from '@mui/icons-material';

import style from './ContextMenuButton.module.scss';

import Button from '@components/atoms/KaaS/Button/Button';
import clsx from 'clsx';

const ContextMenuButton = ({ ...props }: React.ComponentPropsWithoutRef<typeof Button>) => (
  <Button
    {...props}
    variant={props.variant || 'outlined'}
    className={clsx(style.contextMenuBtn, props.className)}
    aria-label="context-button"
  >
    <MoreVert className={style.contextIcon} />
  </Button>
);

export default ContextMenuButton;
