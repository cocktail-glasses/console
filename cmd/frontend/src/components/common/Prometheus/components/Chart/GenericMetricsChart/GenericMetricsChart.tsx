import { useState } from 'react';

import { useAtomValue } from 'jotai';

import { Box, Button, MenuItem, Paper, Select, ToggleButton, ToggleButtonGroup } from '@mui/material';

import { getPrometheusInterval } from '../../../util';
import { CPUChart } from '../CPUChart/CPUChart';
import { FilesystemChart } from '../FilesystemChart/FilesystemChart';
import { MemoryChart } from '../MemoryChart/MemoryChart';
import { NetworkChart } from '../NetworkChart/NetworkChart';

import SectionBox from '@components/common/SectionBox';
import { Icon } from '@iconify/react';
import { showMetricSection } from '@lib/stores/prometheus';

/**
 * Props for the GenericMetricsChart component
 * @interface GenericMetricsChartProps
 * @property {string} cpuQuery - The Prometheus query to fetch CPU metrics
 * @property {string} memoryQuery - The Prometheus query to fetch memory metrics
 * @property {string} networkRxQuery - The Prometheus query to fetch network receive metrics
 * @property {string} networkTxQuery - The Prometheus query to fetch network transmit metrics
 * @property {string} filesystemReadQuery - The Prometheus query to fetch filesystem read metrics
 * @property {string} filesystemWriteQuery - The Prometheus query to fetch filesystem write metrics
 */
interface GenericMetricsChartProps {
  cpuQuery: string;
  memoryQuery: string;
  networkRxQuery: string;
  networkTxQuery: string;
  filesystemReadQuery: string;
  filesystemWriteQuery: string;
}

export function GenericMetricsChart(props: GenericMetricsChartProps) {
  const [chartVariant, setChartVariant] = useState<string>('cpu');
  const [refresh, setRefresh] = useState<boolean>(true);
  const isVisible = useAtomValue(showMetricSection);

  const handleChartVariantChange = (_: React.MouseEvent<HTMLElement>, value: any) => setChartVariant(value);

  const interval = getPrometheusInterval();
  const [timespan, setTimespan] = useState(interval ?? '1h');

  if (!isVisible) {
    return null;
  }

  return (
    <SectionBox>
      <Paper variant="outlined" sx={{ p: 1 }}>
        <Box display="flex" gap={1} justifyContent="flex-end" mb={2}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setRefresh((refresh) => !refresh)}
            startIcon={<Icon icon={refresh ? 'mdi:pause' : 'mdi:play'} />}
            sx={{ filter: 'grayscale(1.0)' }}
          >
            {refresh ? 'Pause' : 'Resume'}
          </Button>
          <ToggleButtonGroup
            onChange={handleChartVariantChange}
            size="small"
            aria-label="metric chooser"
            value={chartVariant}
            exclusive
          >
            <CustomToggleButton label="CPU" value="cpu" icon="mdi:chip" />
            <CustomToggleButton label="Memory" value="memory" icon="mdi:memory" />
            <CustomToggleButton label="Network" value="network" icon="mdi:folder-network-outline" />
            <CustomToggleButton label="Filesystem" value="filesystem" icon="mdi:database" />
          </ToggleButtonGroup>
          <Box>
            <Select
              variant="outlined"
              size="small"
              name="Time"
              value={timespan}
              onChange={(e) => setTimespan(e.target.value)}
            >
              <MenuItem value={'10m'}>10 minutes</MenuItem>
              <MenuItem value={'30m'}>30 minutes</MenuItem>
              <MenuItem value={'1h'}>1 hour</MenuItem>
              <MenuItem value={'3h'}>3 hours</MenuItem>
              <MenuItem value={'6h'}>6 hours</MenuItem>
              <MenuItem value={'12h'}>12 hours</MenuItem>
              <MenuItem value={'24h'}>24 hours</MenuItem>
              <MenuItem value={'48h'}>48 hours</MenuItem>
              <MenuItem value={'today'}>Today</MenuItem>
              <MenuItem value={'yesterday'}>Yesterday</MenuItem>
              <MenuItem value={'week'}>Week</MenuItem>
              <MenuItem value={'lastweek'}>Last week</MenuItem>
              <MenuItem value={'7d'}>7 days</MenuItem>
              <MenuItem value={'14d'}>14 days</MenuItem>
            </Select>
          </Box>
        </Box>

        <Box sx={{ height: '400px' }}>
          {chartVariant === 'cpu' && <CPUChart query={props.cpuQuery} autoRefresh={refresh} interval={timespan} />}
          {chartVariant === 'memory' && (
            <MemoryChart query={props.memoryQuery} autoRefresh={refresh} interval={timespan} />
          )}
          {chartVariant === 'network' && (
            <NetworkChart
              rxQuery={props.networkRxQuery}
              txQuery={props.networkTxQuery}
              autoRefresh={refresh}
              interval={timespan}
            />
          )}
          {chartVariant === 'filesystem' && (
            <FilesystemChart
              readQuery={props.filesystemReadQuery}
              writeQuery={props.filesystemWriteQuery}
              autoRefresh={refresh}
              interval={timespan}
            />
          )}
        </Box>
      </Paper>
    </SectionBox>
  );
}

function CustomToggleButton({ label, icon, value }: { label: string; icon: string; value: string }) {
  return (
    <ToggleButton size="small" value={value} sx={{ textTransform: 'none', gap: 0.5, fontSize: 14 }}>
      <Icon icon={icon} width="18px" />
      {label}
    </ToggleButton>
  );
}
