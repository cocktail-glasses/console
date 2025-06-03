import { Tooltip } from '@mui/material';

import { StatusLabel as HLStatusLabel } from '@components/common/Label';
import { KubeCRD } from '@lib/k8s/crd';

interface StatusLabelProps {
  item: KubeCRD;
}

export default function StatusLabel(props: StatusLabelProps) {
  const { item } = props;
  const ready = item?.jsonData?.status?.conditions?.find((c) => c.type === 'Ready');

  if (!ready) {
    return <span>-</span>;
  }

  if (item?.jsonData?.spec?.suspend) {
    return <HLStatusLabel status="warning">Suspended</HLStatusLabel>;
  }
  if (ready.status === 'Unknown') {
    return <HLStatusLabel status="warning">Reconciling…</HLStatusLabel>;
  }

  if (ready.reason === 'DependencyNotReady') {
    return (
      <HLStatusLabel status={'warning'}>
        <Tooltip title={ready.message}>{'Waiting'}</Tooltip>
      </HLStatusLabel>
    );
  }

  const isReady = ready.status === 'True';
  return (
    <HLStatusLabel status={isReady ? 'success' : 'error'}>
      <Tooltip title={ready.message}>{isReady ? 'Ready' : 'Failed'}</Tooltip>
    </HLStatusLabel>
  );
}
