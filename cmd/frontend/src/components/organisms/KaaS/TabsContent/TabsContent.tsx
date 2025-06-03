import React, { ReactNode, useState } from 'react';

import { Box, Paper } from '@mui/material';

import { isFunction, map } from 'lodash';

import style from './TabsContent.module.scss';

import Tabs from '@components/molecules/KaaS/Tabs/Tabs';
import clsx from 'clsx';

export interface TabData {
  label: ReactNode;
  content: any;
}

interface TabsContentProps {
  tabIndex?: number;
  onChange?: (e: React.SyntheticEvent, v: any) => void;
  tabDatas: TabData[];
  contentComponent?: React.ElementType;
  mainProps?: React.ComponentPropsWithoutRef<typeof Box>;
}

const TabsContent = ({ tabIndex, onChange, tabDatas, contentComponent, mainProps }: TabsContentProps) => {
  const [currentIndex, setCurrentIndex] = useState(tabIndex || 0);

  const handleChangeTab = (e: React.SyntheticEvent, v: any) => {
    setCurrentIndex(v);
    if (isFunction(onChange)) onChange(e, v);
  };

  return (
    <Box {...mainProps} className={clsx(style.mainContainer, mainProps?.className)}>
      <Box className={style.tabsContainer}>
        <Tabs currentIndex={currentIndex} onChange={handleChangeTab} labels={map(tabDatas, (tab) => tab.label)} />
      </Box>
      {map(tabDatas, (tab, i) => (
        <Box
          component={contentComponent || Paper}
          key={i}
          hidden={currentIndex !== i}
          className={style.contentContainer}
        >
          {tab.content}
        </Box>
      ))}
    </Box>
  );
};

export default TabsContent;
