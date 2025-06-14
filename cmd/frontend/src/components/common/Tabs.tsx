import { useEffect, useState } from 'react';
import { Fragment } from 'react/jsx-runtime';

import MuiTab from '@mui/material/Tab';
import MuiTabs from '@mui/material/Tabs';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';

import { useId } from '@lib/util';

export interface Tab {
  label: string;
  component: JSX.Element | JSX.Element[];
}

export interface TabsProps {
  tabs: Tab[];
  tabProps?: {
    [propName: string]: any;
  };
  defaultIndex?: number | null | boolean;
  onTabChanged?: (tabIndex: number) => void;
  sx?: SxProps<Theme>;
  ariaLabel: string;
}

export default function Tabs(props: TabsProps) {
  const { tabs, tabProps = {}, defaultIndex = 0, onTabChanged = null, ariaLabel } = props;
  const [tabIndex, setTabIndex] = useState<TabsProps['defaultIndex']>(
    defaultIndex && Math.min(defaultIndex as number, 0)
  );

  function handleTabChange(event: any, newValue: number) {
    setTabIndex(newValue);

    if (onTabChanged !== null) {
      onTabChanged(newValue);
    }
  }

  useEffect(
    () => {
      if (defaultIndex === null) {
        setTabIndex(false);
        return;
      }
      setTabIndex(defaultIndex);
    },
    // eslint-disable-next-line
    [defaultIndex]
  );

  const uniqueIdSuffix = useId('tabs-');

  return (
    <Fragment>
      <MuiTabs
        value={tabIndex}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        aria-label={ariaLabel}
        variant="scrollable"
        centered={false}
        scrollButtons="auto"
        sx={props.sx}
        {...tabProps}
      >
        {tabs.map(({ label }, i) => (
          <MuiTab
            key={i}
            label={label}
            sx={
              tabs?.length > 7
                ? {
                    minWidth: 150, // allows 8 tabs to show like on pods
                  }
                : {}
            }
            id={`full-width-tab-${i}-${ariaLabel.replace(' ', '')}-${uniqueIdSuffix}`}
            aria-controls={`full-width-tabpanel-${i}-${ariaLabel.replace(' ', '')}-${uniqueIdSuffix}`}
          />
        ))}
      </MuiTabs>
      {tabs.map(({ component }, i) => (
        <TabPanel
          key={i}
          tabIndex={Number(tabIndex)}
          index={i}
          id={`full-width-tabpanel-${i}-${ariaLabel.replace(' ', '')}-${uniqueIdSuffix}`}
          labeledBy={`full-width-tab-${i}-${ariaLabel.replace(' ', '')}-${uniqueIdSuffix}`}
        >
          {component}
        </TabPanel>
      ))}
    </Fragment>
  );
}

interface TabPanelProps extends TypographyProps {
  tabIndex: number;
  index: number;
  id: string;
  labeledBy: string;
}

export function TabPanel(props: TabPanelProps) {
  const { children, tabIndex, index, id, labeledBy } = props;

  return (
    <Typography component="div" role="tabpanel" hidden={tabIndex !== index} id={id} aria-labelledby={labeledBy}>
      {children}
    </Typography>
  );
}
