import { Tab as TabBase } from '@mui/material';

import style from './Tab.module.scss';

import clsx from 'clsx';

interface TabProps {
  label: string;
  className?: string;
}

const Tab = ({ label, className, ...props }: TabProps) => {
  return <TabBase label={label} className={clsx(style.tab, className)} {...props} />;
};

export default Tab;
