import { Tab as TabBase } from '@mui/material';

import style from './Tab.module.scss';

import clsx from 'clsx';

const Tab = ({ ...props }: React.ComponentPropsWithoutRef<typeof TabBase>) => {
  return <TabBase {...props} className={clsx(style.tab, props.className)} />;
};

export default Tab;
