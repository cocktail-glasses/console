import { Tab as TabBase } from '@mui/material';

import style from './Tab.module.scss';

import clsx from 'clsx';

const Tab = ({ ...props }: React.ComponentPropsWithoutRef<typeof TabBase>) => {
  return <TabBase className={clsx(style.tab, props.className)} {...props} />;
};

export default Tab;
