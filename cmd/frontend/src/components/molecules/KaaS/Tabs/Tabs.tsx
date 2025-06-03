import { ReactNode } from 'react';

import { Tabs as TabsBase } from '@mui/material';

import { map } from 'lodash';

import Tab from '@components/atoms/KaaS/Tab/Tab';

interface TabsProps extends React.ComponentPropsWithoutRef<typeof TabsBase> {
  currentIndex: number;
  labels: ReactNode[];
}

const Tabs = ({ currentIndex, labels, ...props }: TabsProps) => (
  <TabsBase {...props} value={currentIndex}>
    {map(labels, (label, i) => (
      <Tab label={label} key={i} />
    ))}
  </TabsBase>
);

export default Tabs;
