import { ReactNode } from 'react';

import { find, findIndex } from 'lodash';

import { DiskMetricsChart } from './components/Chart/DiskMetricsChart/DiskMetricsChart';
import { GenericMetricsChart } from './components/Chart/GenericMetricsChart/GenericMetricsChart';
import { VisibilityButton } from './components/VisibilityButton/VisibilityButton';

import { KubeObject } from '@lib/k8s/KubeObject';
import { DefaultDetailsViewSection, DetailsViewSection } from '@lib/stores/detailViewSection';
import { HeaderAction } from '@lib/stores/headerAction';

export function PrometheusMetrics(resource: KubeObject) {
  if (resource.kind === 'Pod' || resource.kind === 'Job' || resource.kind === 'CronJob') {
    const key = `${resource.kind}_${resource.getNamespace()}_${resource.getName()}`;
    return (
      <GenericMetricsChart
        key={key}
        cpuQuery={`sum(rate(container_cpu_usage_seconds_total{container!='',namespace='${resource.jsonData.metadata.namespace}',pod='${resource.jsonData.metadata.name}'}[1m])) by (pod,namespace)`}
        memoryQuery={`sum(container_memory_working_set_bytes{container!='',namespace='${resource.jsonData.metadata.namespace}',pod=~'${resource.jsonData.metadata.name}'}) by (pod,namespace)`}
        networkRxQuery={`sum(rate(container_network_receive_bytes_total{namespace='${resource.jsonData.metadata.namespace}',pod='${resource.jsonData.metadata.name}'}[1m])) by (pod,namespace)`}
        networkTxQuery={`sum(rate(container_network_transmit_bytes_total{namespace='${resource.jsonData.metadata.namespace}',pod='${resource.jsonData.metadata.name}'}[1m])) by (pod,namespace)`}
        filesystemReadQuery={`sum(rate(container_fs_reads_bytes_total{namespace='${resource.jsonData.metadata.namespace}',pod='${resource.jsonData.metadata.name}'}[1m])) by (pod,namespace)`}
        filesystemWriteQuery={`sum(rate(container_fs_writes_bytes_total{namespace='${resource.jsonData.metadata.namespace}',pod='${resource.jsonData.metadata.name}'}[1m])) by (pod,namespace)`}
      />
    );
  }
  if (
    resource.kind === 'Deployment' ||
    resource.kind === 'StatefulSet' ||
    resource.kind === 'DaemonSet' ||
    resource.kind === 'ReplicaSet'
  ) {
    const key = `${resource.kind}_${resource.getNamespace()}_${resource.getName()}`;
    return (
      <GenericMetricsChart
        key={key}
        cpuQuery={`sum(rate(container_cpu_usage_seconds_total{container!='',namespace='${resource.jsonData.metadata.namespace}',pod=~'${resource.jsonData.metadata.name}-.*'}[1m])) by (pod,namespace)`}
        memoryQuery={`sum(container_memory_working_set_bytes{namespace='${resource.jsonData.metadata.namespace}',pod=~'${resource.jsonData.metadata.name}-.*'}) by (pod,namespace)`}
        networkRxQuery={`sum(rate(container_network_receive_bytes_total{namespace='${resource.jsonData.metadata.namespace}',pod=~'${resource.jsonData.metadata.name}-.*'}[1m])) by (pod,namespace)`}
        networkTxQuery={`sum(rate(container_network_transmit_bytes_total{namespace='${resource.jsonData.metadata.namespace}',pod=~'${resource.jsonData.metadata.name}-.*'}[1m])) by (pod,namespace)`}
        filesystemReadQuery={`sum(rate(container_fs_reads_bytes_total{namespace='${resource.jsonData.metadata.namespace}',pod=~'${resource.jsonData.metadata.name}-.*'}[1m])) by (pod,namespace)`}
        filesystemWriteQuery={`sum(rate(container_fs_writes_bytes_total{namespace='${resource.jsonData.metadata.namespace}',pod=~'${resource.jsonData.metadata.name}-.*'}[1m])) by (pod,namespace)`}
      />
    );
  }

  if (resource.kind === 'PersistentVolumeClaim') {
    const key = `${resource.kind}_${resource.getNamespace()}_${resource.getName()}`;
    return (
      <DiskMetricsChart
        key={key}
        usageQuery={`sum(kubelet_volume_stats_used_bytes{namespace='${resource.jsonData.metadata.namespace}',persistentvolumeclaim='${resource.jsonData.metadata.name}'}) by (persistentvolumeclaim, namespace)`}
        capacityQuery={`sum(kubelet_volume_stats_capacity_bytes{namespace='${resource.jsonData.metadata.namespace}',persistentvolumeclaim='${resource.jsonData.metadata.name}'}) by (persistentvolumeclaim, namespace)`}
      />
    );
  }
}

export const addSubheaderSection = (resource: KubeObject | null, sections: (DetailsViewSection | ReactNode)[]) => {
  // Ignore if there is no resource.
  if (!resource) {
    return sections;
  }

  const prometheusSection = 'prom_metrics';
  if (find(sections, (section: DetailsViewSection) => section.id === prometheusSection)) {
    return sections;
  }

  const detailsHeaderIdx = findIndex(
    sections as DetailsViewSection[],
    (section: DetailsViewSection) => section.id === DefaultDetailsViewSection.MAIN_HEADER
  );
  // There is no header, so we do nothing.
  if (detailsHeaderIdx === -1) {
    return sections;
  }

  sections.splice(detailsHeaderIdx + 1, 0, {
    id: prometheusSection,
    section: PrometheusMetrics(resource),
  });

  return sections;
};

export const addPrometheusMetricsButton = (resource: KubeObject | null, actions: HeaderAction[]) => {
  // Ignore if there is no resource.
  if (!resource) {
    return actions;
  }

  const prometheusAction = 'prom_metrics';
  // If the action is already there, we do nothing.
  if (find(actions, (action: HeaderAction) => action.id === prometheusAction)) {
    return actions;
  }

  actions.splice(0, 0, {
    id: prometheusAction,
    action: <VisibilityButton resource={resource} />,
  });

  return actions;
};
