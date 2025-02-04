import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import Grid from '@mui/material/Grid';

import { WorkloadCircleChart } from './Charts.tsx';

import Link from '@components/common/Link.tsx';
import { PageGrid, ResourceLink } from '@components/common/Resource';
import ResourceListView from '@components/common/Resource/ResourceListView.tsx';
import { SectionBox } from '@components/common/SectionBox.tsx';
import { useCluster } from '@lib/k8s';
import { ApiError } from '@lib/k8s/apiProxy.ts';
import { KubeObject, Workload } from '@lib/k8s/cluster.ts';
import CronJob from '@lib/k8s/cronJob.ts';
import DaemonSet from '@lib/k8s/daemonSet.ts';
import Deployment from '@lib/k8s/deployment.ts';
import Job from '@lib/k8s/job.ts';
import Pod from '@lib/k8s/pod.ts';
import ReplicaSet from '@lib/k8s/replicaSet.ts';
import StatefulSet from '@lib/k8s/statefulSet.ts';
import { getReadyReplicas, getTotalReplicas } from '@lib/util.ts';

interface WorkloadDict {
  [key: string]: Workload[];
}

export default function Overview() {
  const [workloadsData, setWorkloadsData] = useState<WorkloadDict>({});
  const location = useLocation();
  const { t } = useTranslation('glossary');
  const cluster = useCluster();

  useEffect(() => {
    setWorkloadsData({});
  }, [cluster]);

  function setWorkloads(newWorkloads: WorkloadDict) {
    setWorkloadsData((workloads) => ({
      ...workloads,
      ...newWorkloads,
    }));
  }

  function getPods(item: Workload) {
    return `${getReadyReplicas(item)}/${getTotalReplicas(item)}`;
  }

  function sortByReplicas(w1: Workload, w2: Workload) {
    const totalReplicasDiff = getTotalReplicas(w1) - getTotalReplicas(w2);
    if (totalReplicasDiff === 0) {
      return getReadyReplicas(w1) - getReadyReplicas(w2);
    }

    return totalReplicasDiff;
  }

  // Get all items except the pods since those shouldn't be shown in the table (only the chart).
  function getJointItems() {
    let joint: Workload[] = [];

    // Return null if no items are yet loaded, so we show the spinner in the table.
    if (Object.keys(workloadsData).length === 0) {
      return null;
    }

    // Get all items except the pods since those shouldn't be shown in the table (only the chart).
    for (const [key, items] of Object.entries(workloadsData)) {
      if (key === 'Pod') {
        continue;
      }
      joint = joint.concat(items);
    }
    return joint;
  }

  const workloads: KubeObject[] = [Pod, Deployment, StatefulSet, DaemonSet, ReplicaSet, Job, CronJob];

  workloads.forEach((workloadClass: KubeObject) => {
    workloadClass.useApiList(
      (items: InstanceType<typeof workloadClass>[]) => {
        setWorkloads({ [workloadClass.className]: items });
      },
      (err: ApiError) => {
        console.error(`Workloads list: Failed to get list for ${workloadClass.className}: ${err}`);
        setWorkloads({ [workloadClass.className]: [] });
      }
    );
  });

  function ChartLink(workload: KubeObject) {
    const linkName = workload.pluralName;
    return <Link routeName={linkName}>{linkName}</Link>;
  }

  return (
    <PageGrid>
      <SectionBox py={2} mt={1}>
        <Grid container justifyContent="flex-start" alignItems="flex-start" spacing={2}>
          {workloads.map((workload) => (
            <Grid item lg={3} md={4} xs={6} key={workload.name}>
              <WorkloadCircleChart
                workloadData={workloadsData[workload.name] || null}
                // @todo: Use a plural from from the class itself when we have it
                title={ChartLink(workload)}
                partialLabel={t('translation|Failed')}
                totalLabel={t('translation|Running')}
              />
            </Grid>
          ))}
        </Grid>
      </SectionBox>
      <ResourceListView
        title={t('Workloads')}
        columns={[
          'kind',
          {
            id: 'name',
            label: t('translation|Name'),
            getValue: (item) => item.metadata.name,
            render: (item) => <ResourceLink resource={item as KubeObject} state={{ backLink: { ...location } }} />,
          },
          'namespace',
          {
            id: 'pods',
            label: t('Pods'),
            getValue: (item) => item && getPods(item),
            sort: sortByReplicas,
          },
          'age',
        ]}
        data={getJointItems()}
        headerProps={{
          noNamespaceFilter: false,
        }}
        id="headlamp-workloads"
      />
    </PageGrid>
  );
}
