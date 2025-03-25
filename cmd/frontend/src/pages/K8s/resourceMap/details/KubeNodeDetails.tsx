import { memo, ReactElement, useEffect } from 'react';

import { Box } from '@mui/system';

import Deployment from '@lib/k8s/deployment';
import Job from '@lib/k8s/job';
import ReplicaSet from '@lib/k8s/replicaSet';
import ConfigDetails from '@pages/K8s/configmap/Details';
import CronJobDetails from '@pages/K8s/cronjob/Details';
import DaemonSetDetails from '@pages/K8s/daemonset/Details';
import EndpointDetails from '@pages/K8s/endpoints/Details';
import HpaDetails from '@pages/K8s/horizontalPodAutoscaler/Details';
import IngressClassDetails from '@pages/K8s/ingress/ClassDetails';
import IngressDetails from '@pages/K8s/ingress/Details';
import LeaseDetails from '@pages/K8s/lease/Details';
import LimitRangeDetails from '@pages/K8s/limitRange/Details';
import NamespaceDetails from '@pages/K8s/namespace/Details';
import NetworkPolicyDetails from '@pages/K8s/networkpolicy/Details';
import NodeDetails from '@pages/K8s/node/Details';
import PodDetails from '@pages/K8s/pod/Details';
import PDBDetails from '@pages/K8s/podDisruptionBudget/Details';
import PriorityClassDetails from '@pages/K8s/priorityClass/Details';
import ResourceQuotaDetails from '@pages/K8s/resourceQuota/Details';
import RoleBindingDetails from '@pages/K8s/role/BindingDetails';
import RoleDetails from '@pages/K8s/role/Details';
import RuntimeClassDetails from '@pages/K8s/runtimeClass/Details';
import SecretDetails from '@pages/K8s/secret/Details';
import ServiceDetails from '@pages/K8s/service/Details';
import ServiceAccountDetails from '@pages/K8s/serviceaccount/Details';
import StatefulSetDetails from '@pages/K8s/statefulset/Details';
import VolumeClaimDetails from '@pages/K8s/storage/ClaimDetails';
import StorageClassDetails from '@pages/K8s/storage/ClassDetails';
import VolumeDetails from '@pages/K8s/storage/VolumeDetails';
import VpaDetails from '@pages/K8s/verticalPodAutoscaler/Details';
import MutatingWebhookConfigList from '@pages/K8s/webhookconfiguration/MutatingWebhookConfigDetails';
import ValidatingWebhookConfigurationDetails from '@pages/K8s/webhookconfiguration/ValidatingWebhookConfigDetails';
import WorkloadDetails from '@pages/K8s/workload/Details';

const kindComponentMap: Record<string, (props: { name?: string; namespace?: string }) => ReactElement> = {
  Pod: PodDetails,
  Deployment: (props) => <WorkloadDetails {...props} workloadKind={Deployment} />,
  ReplicaSet: (props) => <WorkloadDetails {...props} workloadKind={ReplicaSet} />,
  Job: (props) => <WorkloadDetails {...props} workloadKind={Job} />,
  Service: ServiceDetails,
  CronJob: CronJobDetails,
  DaemonSet: DaemonSetDetails,
  ConfigMap: ConfigDetails,
  Endpoints: EndpointDetails,
  HorizontalPodAutoscaler: HpaDetails,
  Ingress: IngressDetails,
  Lease: LeaseDetails,
  LimitRange: LimitRangeDetails,
  Namespace: NamespaceDetails,
  NetworkPolicy: NetworkPolicyDetails,
  Node: NodeDetails,
  PodDisruptionBudget: PDBDetails,
  PriorityClass: PriorityClassDetails,
  ResourceQuota: ResourceQuotaDetails,
  ClusterRole: RoleDetails,
  Role: RoleDetails,
  RoleBinding: RoleBindingDetails,
  RuntimeClass: RuntimeClassDetails,
  Secret: SecretDetails,
  ServiceAccount: ServiceAccountDetails,
  StatefulSet: StatefulSetDetails,
  PersistentVolumeClaim: VolumeClaimDetails,
  StorageClass: StorageClassDetails,
  PersistentVolume: VolumeDetails,
  VerticalPodAutoscaler: VpaDetails,
  MutatingWebhookConfiguration: MutatingWebhookConfigList,
  ValidatingWebhookConfiguration: ValidatingWebhookConfigurationDetails,
  IngressClass: IngressClassDetails,
};

export const canRenderDetails = (maybeKind: string) =>
  Object.entries(kindComponentMap).find(([key]) => key.toLowerCase() === maybeKind?.toLowerCase()) !== undefined;

function DetailsNotFound() {
  return null;
}

/**
 * Shows details page for a given Kube resource
 */
export const KubeObjectDetails = memo(
  ({ resource }: { resource: { kind: string; metadata: { name: string; namespace?: string } } }) => {
    const kind = resource.kind;
    const { name, namespace } = resource.metadata;

    const Component =
      Object.entries(kindComponentMap).find(([key]) => key.toLowerCase() === kind?.toLowerCase())?.[1] ??
      DetailsNotFound;

    useEffect(() => {
      if (!kindComponentMap[kind]) {
        console.error('No details component for kind ${kind} was found. See KubeNodeDetails.tsx for more info');
      }
    }, [kind, kindComponentMap]);

    return (
      <Box sx={{ overflow: 'hidden' }}>
        <Box sx={{ marginTop: '-70px' }}>
          <Component name={name} namespace={namespace} />
        </Box>
      </Box>
    );
  }
);
