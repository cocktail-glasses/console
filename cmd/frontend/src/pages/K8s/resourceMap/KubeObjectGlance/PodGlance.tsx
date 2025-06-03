import { useTranslation } from 'react-i18next';

import { Box } from '@mui/system';

import { StatusLabel } from '@components/common';
import Pod from '@lib/k8s/pod';
import { makePodStatusLabel } from '@pages/K8s/pod/List';

export function PodGlance({ pod }: { pod: Pod }) {
  const { t } = useTranslation();
  return (
    <Box display="flex" gap={1} alignItems="center" mt={2} flexWrap="wrap" key="pod">
      <Box>{makePodStatusLabel(pod)}</Box>
      {pod.spec.containers.map((it) => (
        <StatusLabel status="" key={it.name}>
          {t('glossary|Container')}: {it.name}
        </StatusLabel>
      ))}
      {pod.status?.podIP && <StatusLabel status="">IP: {pod.status?.podIP}</StatusLabel>}
    </Box>
  );
}
