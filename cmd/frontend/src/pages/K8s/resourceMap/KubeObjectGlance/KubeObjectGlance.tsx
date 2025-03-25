import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box } from '@mui/system';

import { DeploymentGlance } from './DeploymentGlance';
import { EndpointsGlance } from './EndpointsGlance';
import { PodGlance } from './PodGlance';
import { ReplicaSetGlance } from './ReplicaSetGlance';
import { ServiceGlance } from './ServiceGlance';

import { DateLabel } from '@components/common/Label';
import { Icon } from '@iconify/react';
import { KubeObject } from '@lib/k8s/cluster';
import Deployment from '@lib/k8s/deployment';
import Endpoints from '@lib/k8s/endpoints';
import Event from '@lib/k8s/event';
import Pod from '@lib/k8s/pod';
import ReplicaSet from '@lib/k8s/replicaSet';
import Service from '@lib/k8s/service';

/**
 * Little Popup preview of a Kube object
 */
export const KubeObjectGlance = memo(({ resource }: { resource: KubeObject }) => {
  const { t } = useTranslation();
  const [events, setEvents] = useState<Event[]>([]);
  useEffect(() => {
    Event.objectEvents(resource).then((it) => setEvents(it));
  }, []);

  const kind = resource.kind;

  const sections = [];

  if (kind === 'Pod') {
    sections.push(<PodGlance pod={resource as Pod} />);
  }

  if (kind === 'Deployment') {
    sections.push(<DeploymentGlance deployment={resource as Deployment} />);
  }

  if (kind === 'Service') {
    sections.push(<ServiceGlance service={resource as Service} />);
  }

  if (kind === 'Endpoints') {
    sections.push(<EndpointsGlance endpoints={resource as Endpoints} />);
  }

  if (kind === 'ReplicaSet' || kind === 'StatefulSet') {
    sections.push(<ReplicaSetGlance set={resource as ReplicaSet} />);
  }

  if (events.length > 0) {
    sections.push(
      <Box key="events" mt={2}>
        <Box display="flex" alignItems="center" gap={1} mb={1} fontSize={14}>
          <Icon icon="mdi:message-notification" />
          {t('glossary|Events')}
        </Box>
        {events.slice(0, 5).map((it) => (
          <Box display="flex" gap={1} alignItems="center" mb={0.5} width="100%" key={it.message + it.lastOccurrence}>
            <Box
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              mr="auto"
              maxWidth="300px"
              title={it.message}
            >
              {it.message}
            </Box>
            <DateLabel date={it.lastOccurrence} format="mini" />
          </Box>
        ))}
      </Box>
    );
  }

  return sections;
});
