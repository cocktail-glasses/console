import { useTranslation } from 'react-i18next';

import Typography from '@mui/material/Typography';

import { TooltipIcon } from '@components/common';
import { PercentageBar } from '@components/common/Chart';
import { KubeMetrics } from '@lib/k8s/cluster';
import Node from '@lib/k8s/node';
import { getPercentStr, getResourceMetrics, getResourceStr } from '@lib/util';

interface UsageBarChartProps {
  node: Node;
  nodeMetrics: KubeMetrics[] | null;
  resourceType: keyof KubeMetrics['usage'];
  noMetrics?: boolean;
}

export function UsageBarChart(props: UsageBarChartProps) {
  const { node, nodeMetrics, resourceType, noMetrics = false } = props;
  const { t } = useTranslation(['translation']);
  let [used, capacity] = [0, 0];

  if (node) {
    [used, capacity] = getResourceMetrics(node, nodeMetrics || [], resourceType);
  }

  const data = [
    {
      name: t('used'),
      value: used,
    },
  ];

  function tooltipFunc() {
    return (
      <Typography>
        {getResourceStr(used, resourceType)} of {getResourceStr(capacity, resourceType)} (
        {getPercentStr(used, capacity)})
      </Typography>
    );
  }

  return noMetrics ? (
    <>
      <Typography display="inline">{getResourceStr(capacity, resourceType)}</Typography>
      <TooltipIcon>{t('translation|Install the metrics-server to get usage data.')}</TooltipIcon>
    </>
  ) : (
    <PercentageBar data={data} total={capacity} tooltipFunc={tooltipFunc} />
  );
}
