import { OpenInNew } from '@mui/icons-material';
import { Link } from '@mui/material';

import style from './LinkText.module.scss';

import clsx from 'clsx';

interface LinkTextProps extends React.ComponentPropsWithRef<typeof Link> {
  iconProps?: React.ComponentPropsWithRef<typeof OpenInNew>;
}

const LinkText = ({ children, iconProps, ...props }: LinkTextProps) => {
  return (
    <Link {...props} className={clsx(style.link, props.className)}>
      {children}
      <OpenInNew {...iconProps} className={clsx(style.icon, iconProps?.className)} />
    </Link>
  );
};

export default LinkText;
