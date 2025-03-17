import { useState } from 'react';

import { Box, Paper } from '@mui/material';

import { isFunction, map } from 'lodash';

import style from './TabsContent.module.scss';

import Tabs from '@components/molecules/KaaS/Tabs/Tabs';

export interface TabData {
  label: string;
  content: any;
}

interface TabsContent {
  tabIndex?: number;
  onChange?: (e: React.SyntheticEvent, v: any) => void;
  tabDatas: TabData[];
}

const TabsContent = ({ tabIndex, onChange, tabDatas }: TabsContent) => {
  const [currentIndex, setCurrentIndex] = useState(tabIndex || 0);

  const handleChangeTab = (e: React.SyntheticEvent, v: any) => {
    setCurrentIndex(v);
    if (isFunction(onChange)) onChange(e, v);
  };

  return (
    <Box className={style.mainContainer}>
      <Box className={style.tabsContainer}>
        <Tabs currentIndex={currentIndex} onChange={handleChangeTab} labels={map(tabDatas, (tab) => tab.label)} />
      </Box>
      {map(tabDatas, (tab, i) => (
        <Paper key={tab.label} hidden={currentIndex !== i} className={style.contentContainer}>
          {tab.content}
        </Paper>
      ))}
    </Box>
  );
};

export default TabsContent;
