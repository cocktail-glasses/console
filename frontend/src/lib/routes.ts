import DaemonSet from "./k8s/daemonSet.ts";
import Deployment from "./k8s/deployment.ts";
import Job from "./k8s/job.ts";
import ReplicaSet from "./k8s/replicaSet.ts";
import StatefulSet from "./k8s/statefulSet.ts";

export interface RoutesType {
  id: string;
  routes: Route[];
}

export interface Route {
  path: string;
  page: string;
  index?: boolean;
  props?: any;
}

export const Routes: RoutesType[] = [
  { id: 'home', routes: [
    { path: '/home', page: 'Home/index', index: true },
    { path: '/', page: 'Home/index', index: true }
  ] },
  { id: 'users', routes: [
    { path: '/users', page: 'Users/List', index: true },
    { path: '/users/create', page: 'Users/Detail' },
    { path: '/users/:name', page: 'Users/Detail' }
  ] },
  { id: 'settings', routes: [{ path: '/settings', page: 'Settings', index: true }] },
  //k8s
  { id: 'clusters', routes: [{ path: '/clusters', page: 'Clusters/Clusters', index: true }] },
  { id: 'cluster', routes: [{ path: '/clusters/cluster', page: 'K8s/cluster/Overview', index: true }] },
  { id: 'namespaces', routes: [
    { path: '/clusters/namespaces', page: 'K8s/namespace/List', index: true },
    { path: '/clusters/:cluster/namespace/:name', page: 'K8s/namespace/Details' }
  ] },
  { id: 'nodes', routes: [
    { path: '/clusters/nodes', page: 'K8s/node/List', index: true },
    { path: '/clusters/:cluster/node/:name', page: 'K8s/node/Details' }
  ] },
  {
    id: 'crds', routes: [
      { path: '/clusters/crds', page: 'K8s/crd/List', index: true }, { path: '/clusters/crds/:name', page: 'K8s/crd/Details' },
      { path: '/clusters/customresources/:crd', page: 'K8s/crd/CustomResourceList' }, { path: '/clusters/customresources/:crd/:namespace/:crName', page: 'K8s/crd/CustomResourceDetails' }
    ]
  },
  { id: 'workloads', routes: [{ path: '/clusters/workloads', page: 'K8s/workload/Overview', index: true }] },
  { id: 'pods', routes: [
    { path: '/clusters/pods', page: 'K8s/pod/List', index: true },
    { path: '/clusters/:cluster/pod/:namespace/:name', page: 'K8s/pod/Details' }
  ] },
  { id: 'deployments', routes: [
    { path: '/clusters/deployments', page: 'K8s/deployments/List', index: true },
    { path: '/clusters/:cluster/deployment/:namespace/:name', page: 'K8s/workload/Details', props: {workloadKind: Deployment} }
  ] },
  { id: 'statefulSets', routes: [
    { path: '/clusters/statefulsets', page: 'K8s/statefulset/List', index: true },
    { path: '/clusters/:cluster/statefulset/:namespace/:name', page: 'K8s/statefulset/Details', props: {workloadKind: StatefulSet} }
  ] },
  { id: 'daemonSets', routes: [
    { path: '/clusters/daemonsets', page: 'K8s/daemonset/List', index: true },
    { path: '/clusters/:cluster/daemonset/:namespace/:name', page: 'K8s/daemonset/Details', props: {workloadKind: DaemonSet} }
  ] },
  { id: 'replicaSets', routes: [
    { path: '/clusters/replicasets', page: 'K8s/replicaset/List', index: true },
    { path: '/clusters/:cluster/replicaset/:namespace/:name', page: 'K8s/workload/Details', props: {workloadKind: ReplicaSet} }
  ] },
  { id: 'jobs', routes: [
    { path: '/clusters/jobs', page: 'K8s/job/List', index: true },
    { path: '/clusters/:cluster/job/:namespace/:name', page: 'K8s/workload/Details', props: {workloadKind: Job} }
  ] },
  { id: 'cronJobs', routes: [
    { path: '/clusters/cronjobs', page: 'K8s/cronjob/List', index: true },
    { path: '/clusters/:cluster/cronjob/:namespace/:name', page: 'K8s/cronjob/Details' }
  ] },

  { id: 'persistentVolumeClaims', routes: [
    { path: '/clusters/storage/persistentvolumeclaims', page: 'K8s/storage/ClaimList', index: true },
    { path: '/clusters/:cluster/persistentvolumeclaim/:namespace/:name', page: 'K8s/storage/ClaimDetails' }] },
  { id: 'persistentVolumes', routes: [
    { path: '/clusters/storage/persistentvolumes', page: 'K8s/storage/VolumeList', index: true },
    { path: '/clusters/:cluster/persistentvolume/:name', page: 'K8s/storage/VolumeDetails' }
  ] },
  { id: 'storageClasses', routes: [
    { path: '/clusters/storage/classes', page: 'K8s/storage/ClassList', index: true },
    { path: '/clusters/:cluster/storageclass/:name', page: 'K8s/storage/ClassDetails' }] },

  { id: 'services', routes: [
    { path: '/clusters/services', page: 'K8s/service/List', index: true },
    { path: '/clusters/:cluster/service/:namespace/:name', page: 'K8s/service/Details' }
  ] },
  { id: 'endpoints', routes: [
    { path: '/clusters/endpoints', page: 'K8s/endpoints/List', index: true },
    { path: '/clusters/:cluster/endpoint/:namespace/:name', page: 'K8s/endpoints/Details' }
  ] },
  { id: 'ingresses', routes: [
    { path: '/clusters/ingresses', page: 'K8s/ingress/List', index: true },
    { path: '/clusters/:cluster/ingress/:namespace/:name', page: 'K8s/ingress/Details' }
  ] },
  { id: 'ingressclasses', routes: [
    { path: '/clusters/ingressclasses', page: 'K8s/ingress/ClassList', index: true },
    { path: '/clusters/:cluster/ingressclass/:name', page: 'K8s/ingress/ClassDetails' }
  ] },
  { id: 'networkPolicies', routes: [
    { path: '/clusters/networkPolicies', page: 'K8s/networkpolicy/List', index: true },
    { path: '/clusters/:cluster/networkPolicy/:namespace/:name', page: 'K8s/networkpolicy/Details' }
  ] },

  { id: 'serviceAccounts', routes: [
    { path: '/clusters/serviceaccounts', page: 'K8s/serviceaccount/List', index: true },
    { path: '/clusters/:cluster/serviceaccount/:namespace/:name', page: 'K8s/serviceaccount/Details' }
  ] },
  {
    id: 'roles', routes: [
      { path: '/clusters/roles', page: 'K8s/role/List', index: true },
      { path: '/clusters/:cluster/role/:namespace/:name', page: 'K8s/role/Details' },
      { path: '/clusters/:cluster/clusterrole/:name', page: 'K8s/role/Details' },
    ]
  },
  {
    id: 'roleBindings', routes: [{ path: '/clusters/roleBindings', page: 'K8s/role/BindingList', index: true }, { path: '/clusters/roleBindings/:namespace/:name', page: 'K8s/role/BindingDetails' },
    { path: '/clusters/clusterrolebinding/:name', page: 'K8s/role/BindingDetails' },
    ]
  },

  { id: 'configMaps', routes: [
    { path: '/clusters/configmaps', page: 'K8s/configmap/List', index: true },
    { path: '/clusters/:cluster/configmap/:namespace/:name', page: 'K8s/configmap/Details' }
  ] },
  { id: 'secrets', routes: [
    { path: '/clusters/secrets', page: 'K8s/secret/List', index: true },
    { path: '/clusters/:cluster/secret/:namespace/:name', page: 'K8s/secret/Details' }] },
  { id: 'horizontalPodAutoscalers', routes: [
    { path: '/clusters/horizontalpodautoscalers', page: 'K8s/horizontalPodAutoscaler/List', index: true },
    { path: '/clusters/:cluster/horizontalpodautoscaler/:namespace/:name', page: 'K8s/horizontalPodAutoscaler/Details' }
  ] },
  { id: 'verticalPodAutoscalers', routes: [
    { path: '/clusters/verticalpodautoscalers', page: 'K8s/verticalPodAutoscaler/List', index: true },
    { path: '/clusters/:cluster/verticalpodautoscaler/:namespace/:name', page: 'K8s/verticalPodAutoscaler/Details' }
  ] },
  { id: 'podDisruptionBudgets', routes: [
    { path: '/clusters/poddisruptionbudgets', page: 'K8s/podDisruptionBudget/List', index: true },
    { path: '/clusters/:cluster/poddisruptionbudget/:namespace/:name', page: 'K8s/podDisruptionBudget/Details' }
  ] },
  { id: 'resourceQuotas', routes: [
    { path: '/clusters/resourcequotas', page: 'K8s/resourceQuota/List', index: true },
    { path: '/clusters/:cluster/resourcequota/:namespace/:name', page: 'K8s/resourceQuota/Details' }
  ] },
  { id: 'limitRanges', routes: [
    { path: '/clusters/limitranges', page: 'K8s/limitRange/List', index: true },
    { path: '/clusters/:cluster/limitrange/:namespace/:name', page: 'K8s/limitRange/Details' }
  ] },
  { id: 'priorityClasses', routes: [
    { path: '/clusters/priorityclasses', page: 'K8s/priorityClass/List', index: true },
    { path: '/clusters/:cluster/priorityclass/:name', page: 'K8s/priorityClass/Details' }
  ] },
  { id: 'runtimeClasses', routes: [
    { path: '/clusters/runtimeclasses', page: 'K8s/runtimeClass/List', index: true },
    { path: '/clusters/:cluster/runtimeclass/:name', page: 'K8s/runtimeClass/Details' }
  ] },
  { id: 'leases', routes: [
    { path: '/clusters/leases', page: 'K8s/lease/List', index: true },
    { path: '/clusters/:cluster/lease/:namespace/:name', page: 'K8s/lease/Details' }
  ] },
  { id: 'mutatingWebhookConfigurations', routes: [
    { path: '/clusters/mutatingwebhookconfigurations', page: 'K8s/webhookconfiguration/MutatingWebhookConfigList', index: true },
    { path: '/clusters/:cluster/mutatingwebhookconfiguration/:name', page: 'K8s/webhookconfiguration/MutatingWebhookConfigDetails' }
  ] },
  { id: 'validatingWebhookConfigurations', routes: [
    { path: '/clusters/validatingwebhookconfigurations', page: 'K8s/webhookconfiguration/ValidatingWebhookConfigList', index: true },
    { path: '/clusters/:cluster/validatingwebhookconfiguration/:name', page: 'K8s/webhookconfiguration/ValidatingWebhookConfigDetails' }
  ] },

]
