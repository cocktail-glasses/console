import { useState } from 'react';

import { useAtomValue } from 'jotai';

import { Pause, PlayArrow } from '@mui/icons-material';
import { Box, IconButton, Paper } from '@mui/material';

import { getPrometheusInterval } from '../../../util';
import { DiskChart } from '../DiskChart/DiskChart';

import SectionBox from '@components/common/SectionBox';
import { showMetricSection } from '@lib/stores/prometheus';

/**
 * Props for the DiskMetricsChart component
 * @interface DiskMetricsChartProps
 * @property {string} [usageQuery] - The Prometheus query to fetch disk usage metrics
 * @property {string} [capacityQuery] - The Prometheus query to fetch disk capacity metrics
 */
interface DiskMetricsChartProps {
  usageQuery?: string;
  capacityQuery?: string;
}

export function DiskMetricsChart(props: DiskMetricsChartProps) {
  const [refresh, setRefresh] = useState<boolean>(true);
  const isVisible = useAtomValue(showMetricSection);

  const interval = getPrometheusInterval();

  if (!isVisible) {
    return null;
  }

  return (
    <SectionBox>
      <Paper variant="outlined" sx={{ p: 1 }}>
        <Box
          display="flex"
          justifyContent="space-around"
          alignItems="center"
          style={{ marginBottom: '0.5rem', margin: '0 auto', width: '0%' }}
        >
          {[
            <Box>Disk</Box>,
            <Box pl={2}>
              <IconButton onClick={() => setRefresh((refresh) => !refresh)} size="large">
                {refresh ? <Pause /> : <PlayArrow />}
              </IconButton>
            </Box>,
          ]}
        </Box>

        <Box
          style={{
            justifyContent: 'center',
            display: 'flex',
            height: '40vh',
            width: '80%',
            margin: '0 auto',
          }}
        >
          <DiskChart
            usageQuery={props.usageQuery!}
            capacityQuery={props.capacityQuery!}
            interval={interval}
            autoRefresh={refresh}
          />
        </Box>
      </Paper>
    </SectionBox>
  );
}
