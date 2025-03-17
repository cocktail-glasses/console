import { Tabs as TabsBase } from '@mui/material';

import { map } from 'lodash';

import Tab from '@components/atoms/KaaS/Tab/Tab';

interface TabsProps {
  currentIndex: number;
  onChange: (e: React.SyntheticEvent, v: any) => void;
  labels: string[];
}

const Tabs = ({ currentIndex, onChange, labels }: TabsProps) => (
  <TabsBase value={currentIndex} onChange={onChange} aria-label="tabs">
    {map(labels, (label) => (
      <Tab label={label} key={label} />
    ))}
  </TabsBase>
);

export default Tabs;
