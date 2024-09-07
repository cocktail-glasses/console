import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';

import { CpuCircularChart, MemoryCircularChart, NodesStatusCircleChart, PodsStatusCircleChart } from './Charts.tsx';

import { DateLabel, Link, PageGrid, StatusLabel } from '@components/common';
import Empty from '@components/common/EmptyContent.tsx';
import ResourceListView from '@components/common/Resource/ResourceListView.tsx';
import { SectionBox } from '@components/common/SectionBox.tsx';
import ShowHideLabel from '@components/common/ShowHideLabel';
import { LightTooltip } from '@components/common/Tooltip';
import Event from '@lib/k8s/event.ts';
import Node from '@lib/k8s/node.ts';
import Pod from '@lib/k8s/pod.ts';
import { useFilterFunc } from '@lib/util.ts';

export default function Overview() {
  const { t } = useTranslation(['translation']);

  const [pods] = Pod.useList();
  const [nodes] = Node.useList();

  const [nodeMetrics, metricsError] = Node.useMetrics();

  const noMetrics = metricsError?.status === 404;
  const noPermissions = metricsError?.status === 403;

  return (
    <PageGrid>
      <SectionBox title={t('translation|Overview')} py={2} mt={[4, 0, 0]}>
        {noPermissions ? (
          <Empty color="error">{t('translation|No permissions to list pods.')}</Empty>
        ) : (
          <Grid container justifyContent="flex-start" alignItems="stretch" spacing={4}>
            <Grid item xs sx={{ maxWidth: '300px' }}>
              <CpuCircularChart items={nodes} itemsMetrics={nodeMetrics} noMetrics={noMetrics} />
            </Grid>
            <Grid item xs sx={{ maxWidth: '300px' }}>
              <MemoryCircularChart items={nodes} itemsMetrics={nodeMetrics} noMetrics={noMetrics} />
            </Grid>
            <Grid item xs sx={{ maxWidth: '300px' }}>
              <PodsStatusCircleChart items={pods} />
            </Grid>
            <Grid item xs sx={{ maxWidth: '300px' }}>
              <NodesStatusCircleChart items={nodes} />
            </Grid>
          </Grid>
        )}
      </SectionBox>
      <EventsSection />
    </PageGrid>
  );
}

function EventsSection() {
  const EVENT_WARNING_SWITCH_FILTER_STORAGE_KEY = 'EVENT_WARNING_SWITCH_FILTER_STORAGE_KEY';
  const EVENT_WARNING_SWITCH_DEFAULT = true;
  const { t } = useTranslation(['translation', 'glossary']);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const eventsFilter = queryParams.get('eventsFilter');
  const filterFunc = useFilterFunc<Event>(['.jsonData.involvedObject.kind']);
  const [isWarningEventSwitchChecked, setIsWarningEventSwitchChecked] = useState(
    Boolean(
      JSON.parse(
        localStorage.getItem(EVENT_WARNING_SWITCH_FILTER_STORAGE_KEY) || EVENT_WARNING_SWITCH_DEFAULT.toString()
      )
    )
  );
  const [events, eventsError] = Event.useList({ limit: Event.maxLimit });

  const warningActionFilterFunc = (event: Event, search?: string) => {
    if (!filterFunc(event, search)) {
      return false;
    }

    if (isWarningEventSwitchChecked) {
      return event.jsonData.type === 'Warning';
    }

    // Return true because if we reach this point, it means we're only filtering by
    // the default filterFunc (and its result was 'true').
    return true;
  };

  const numWarnings = useMemo(() => events?.filter((e) => e.type === 'Warning').length ?? '?', [events]);

  function makeStatusLabel(event: Event) {
    return (
      <StatusLabel
        status={event.type === 'Normal' ? '' : 'warning'}
        sx={(theme) => ({
          [theme.breakpoints.up('md')]: {
            display: 'unset',
          },
        })}
      >
        {event.reason}
      </StatusLabel>
    );
  }

  function makeObjectLink(event: Event) {
    const obj = event.involvedObjectInstance;
    if (!!obj) {
      return <Link kubeObject={obj} />;
    }

    return event.involvedObject.name;
  }

  return (
    <ResourceListView
      title={t('glossary|Events')}
      headerProps={{
        noNamespaceFilter: false,
        titleSideActions: [
          <FormControlLabel
            checked={isWarningEventSwitchChecked}
            label={t('Only warnings ({{ numWarnings }})', { numWarnings })}
            control={<Switch color="primary" />}
            onChange={(event, checked) => {
              localStorage.setItem(EVENT_WARNING_SWITCH_FILTER_STORAGE_KEY, checked.toString());
              setIsWarningEventSwitchChecked(checked);
            }}
          />,
        ],
      }}
      defaultGlobalFilter={eventsFilter ?? undefined}
      data={events}
      errorMessage={Event.getErrorMessage(eventsError)}
      columns={[
        {
          label: t('Type'),
          getValue: (event) => event.involvedObject.kind,
        },
        {
          label: t('Name'),
          getValue: (event) => event.involvedObjectInstance?.getName() ?? event.involvedObject.name,
          render: (event) => makeObjectLink(event),
          gridTemplate: 1.5,
        },
        'namespace',
        {
          label: t('Reason'),
          getValue: (event) => event.reason,
          render: (event) => (
            <LightTooltip title={event.reason} interactive>
              {makeStatusLabel(event)}
            </LightTooltip>
          ),
        },
        {
          label: t('Message'),
          getValue: (event) => event.message ?? '',
          render: (event) => <ShowHideLabel labelId={event.metadata?.uid || ''}>{event.message || ''}</ShowHideLabel>,
          gridTemplate: 1.5,
        },
        {
          id: 'last-seen',
          label: t('Last Seen'),
          gridTemplate: 'min-content',
          cellProps: { align: 'right' },
          getValue: (event) => -new Date(event.lastOccurrence).getTime(),
          render: (event) => <DateLabel date={event.lastOccurrence} format="mini" />,
        },
      ]}
      filterFunction={warningActionFilterFunc}
      defaultSortingColumn={{ id: 'last-seen', desc: false }}
      id="headlamp-cluster.overview.events"
    />
  );
}
