import { lazy } from 'react';
import { generatePath } from 'react-router';

import { isUndefined } from 'lodash';

import { getCluster, getClusterPrefixedPath } from './cluster';
import { RouteURLProps } from './router';

import DaemonSet from '@lib/k8s/daemonSet';
import Deployment from '@lib/k8s/deployment';
import Job from '@lib/k8s/job';
import ReplicaSet from '@lib/k8s/replicaSet';
import StatefulSet from '@lib/k8s/statefulSet';
import Clusters from '@pages/Clusters/Clusters';
import Home from '@pages/Home';
import k8sClusterOverview from '@pages/K8s/cluster/Overview';
import k8sConfigmapDetails from '@pages/K8s/configmap/Details';
import k8sConfigmapList from '@pages/K8s/configmap/List';
import k8sCustomResourceDetails from '@pages/K8s/crd/CustomResourceDetails';
import k8sCrsInstanceList from '@pages/K8s/crd/CustomResourceInstancesList';
import k8sCustomResourceList from '@pages/K8s/crd/CustomResourceList';
import k8sCustomResourceDefinitionDetails from '@pages/K8s/crd/Details';
import k8sCustomResourceDefinitionList from '@pages/K8s/crd/List';
import k8sCronjobDetails from '@pages/K8s/cronjob/Details';
import k8sCronjobList from '@pages/K8s/cronjob/List';
import k8sDaemonsetDetails from '@pages/K8s/daemonset/Details';
import k8sDaemonsetList from '@pages/K8s/daemonset/List';
import k8sDeploymentsList from '@pages/K8s/deployments/List';
import k8sEndpointsDetails from '@pages/K8s/endpoints/Details';
import k8sEndpointsList from '@pages/K8s/endpoints/List';
import k8sGatewayClassDetails from '@pages/K8s/gateway/ClassDetails';
import k8sGatewayClassList from '@pages/K8s/gateway/ClassList';
import k8sGrpcRouteDetails from '@pages/K8s/gateway/GRPCRouteDetails';
import k8sGrpcRouteList from '@pages/K8s/gateway/GRPCRouteList';
import k8sGatewayDetails from '@pages/K8s/gateway/GatewayDetails';
import k8sGatewayList from '@pages/K8s/gateway/GatewayList';
import k8sHttpRouteDetails from '@pages/K8s/gateway/HTTPRouteDetails';
import k8sHttpRouteList from '@pages/K8s/gateway/HTTPRouteList';
import k8sHorizontalPodAutoscalerDetails from '@pages/K8s/horizontalPodAutoscaler/Details';
import k8sHorizontalPodAutoscalerList from '@pages/K8s/horizontalPodAutoscaler/List';
import k8sIngressClassDetails from '@pages/K8s/ingress/ClassDetails';
import k8sIngressClassList from '@pages/K8s/ingress/ClassList';
import k8sIngressDetails from '@pages/K8s/ingress/Details';
import k8sIngressList from '@pages/K8s/ingress/List';
import k8sJobList from '@pages/K8s/job/List';
import k8sLeaseList from '@pages/K8s/lease/List';
import k8sLeaseDetails from '@pages/K8s/lease/List';
import k8sLimitRangeDetails from '@pages/K8s/limitRange/Details';
import k8sLimitRangeList from '@pages/K8s/limitRange/List';
import k8sNamespaceDetails from '@pages/K8s/namespace/Details';
import k8sNamespaceList from '@pages/K8s/namespace/List';
import k8sNetworkpolicyDetails from '@pages/K8s/networkpolicy/Details';
import k8sNetworkpolicyList from '@pages/K8s/networkpolicy/List';
import k8sNodeDetails from '@pages/K8s/node/Details';
import k8sNodeList from '@pages/K8s/node/List';
import k8sPodDetails from '@pages/K8s/pod/Details';
import k8sPodList from '@pages/K8s/pod/List';
import k8sPodDisruptionBudgetDetails from '@pages/K8s/podDisruptionBudget/Details';
import k8sPodDisruptionBudgetList from '@pages/K8s/podDisruptionBudget/List';
import k8sPriorityClassDetails from '@pages/K8s/priorityClass/Details';
import k8sPriorityClassList from '@pages/K8s/priorityClass/List';
import k8sReplicasetList from '@pages/K8s/replicaset/List';
import k8sResourceQuotaDetails from '@pages/K8s/resourceQuota/Details';
import k8sResourceQuotaList from '@pages/K8s/resourceQuota/List';
import k8sRoleBindingDetails from '@pages/K8s/role/BindingDetails';
import k8sRoleBindingList from '@pages/K8s/role/BindingList';
import k8sRoleDetails from '@pages/K8s/role/Details';
import k8sRoleList from '@pages/K8s/role/List';
import k8sRuntimeClassDetails from '@pages/K8s/runtimeClass/Details';
import k8sRuntimeClassList from '@pages/K8s/runtimeClass/List';
import k8sSecretDetails from '@pages/K8s/secret/Details';
import k8sSecretList from '@pages/K8s/secret/List';
import k8sServiceDetails from '@pages/K8s/service/Details';
import k8sServiceList from '@pages/K8s/service/List';
import k8sServiceaccountDetails from '@pages/K8s/serviceaccount/Details';
import k8sServiceaccountList from '@pages/K8s/serviceaccount/List';
import k8sStatefulsetDetails from '@pages/K8s/statefulset/Details';
import k8sStatefulsetList from '@pages/K8s/statefulset/List';
import k8sStorageClaimDetails from '@pages/K8s/storage/ClaimDetails';
import k8sStorageClaimList from '@pages/K8s/storage/ClaimList';
import k8sStorageClassDetails from '@pages/K8s/storage/ClassDetails';
import k8sStorageClassList from '@pages/K8s/storage/ClassList';
import k8sStorageVolumeDetails from '@pages/K8s/storage/VolumeDetails';
import k8sStorageVolumeList from '@pages/K8s/storage/VolumeList';
import k8sVerticalPodAutoscalerDetails from '@pages/K8s/verticalPodAutoscaler/Details';
import k8sVerticalPodAutoscalerList from '@pages/K8s/verticalPodAutoscaler/List';
import k8sWebhookconfigurationMutatingWebhookConfigDetails from '@pages/K8s/webhookconfiguration/MutatingWebhookConfigDetails';
import k8sWebhookconfigurationMutatingWebhookConfigList from '@pages/K8s/webhookconfiguration/MutatingWebhookConfigList';
import k8sWebhookconfigurationValidatingWebhookConfigDetails from '@pages/K8s/webhookconfiguration/ValidatingWebhookConfigDetails';
import k8sWebhookconfigurationValidatingWebhookConfigList from '@pages/K8s/webhookconfiguration/ValidatingWebhookConfigList';
import k8sWorkloadDetails from '@pages/K8s/workload/Details';
import k8sWorkloadOverview from '@pages/K8s/workload/Overview';
import KaaSCreate from '@pages/KaaS/clusters/Create';
import KaaSDetail from '@pages/KaaS/clusters/Detail';
import KaaSList from '@pages/KaaS/clusters/List';
import Settings from '@pages/Settings';
import { UsersDetail, UsersList } from '@pages/Users';

const k8sResourceMap = lazy(() => import('@pages/K8s/resourceMap/GraphView').then((it) => ({ default: it.default })));

export interface RoutesType {
  id: string;
  routes: Route[];
  // URL에 cluster prefix 여부
  useClusterURL?: boolean;
}

export interface Route {
  path: string;
  page: string;
  // element?: React.LazyExoticComponent<() => JSX.Element | null>;
  element?: any;
  index?: boolean;
  props?: any;
}

export const Routes: RoutesType[] = [
  {
    id: 'home',
    routes: [
      { path: '/home', page: 'Home', element: Home, index: true },
      { path: '/', page: 'Home', element: Home, index: true },
    ],
    useClusterURL: false,
  },
  {
    id: 'users',
    routes: [
      { path: '/users', page: 'Users/List', element: UsersList, index: true },
      { path: '/users/create', page: 'Users/Detail', element: UsersDetail },
      { path: '/users/:name', page: 'Users/Detail', element: UsersDetail },
    ],
    useClusterURL: false,
  },
  {
    id: 'settings',
    routes: [{ path: '/settings', page: 'Settings', element: Settings, index: true }],
    useClusterURL: false,
  },
  //k8s
  {
    id: 'clusters',
    routes: [
      {
        path: '/clusters',
        page: 'Clusters/Clusters',
        element: Clusters,
        index: true,
      },
    ],
    useClusterURL: false,
  },
  {
    id: 'cluster',
    routes: [
      {
        path: '/cluster',
        page: 'K8s/cluster/Overview',
        element: k8sClusterOverview,
        index: true,
      },
    ],
  },
  {
    id: 'namespaces',
    routes: [
      {
        path: '/namespaces',
        page: 'K8s/namespace/List',
        element: k8sNamespaceList,
        index: true,
      },
      {
        path: '/namespace/:name',
        page: 'K8s/namespace/Details',
        element: k8sNamespaceDetails,
      },
    ],
  },
  {
    id: 'nodes',
    routes: [
      {
        path: '/nodes',
        page: 'K8s/node/List',
        element: k8sNodeList,
        index: true,
      },
      {
        path: '/node/:name',
        page: 'K8s/node/Details',
        element: k8sNodeDetails,
      },
    ],
  },
  {
    id: 'workloads',
    routes: [
      {
        path: '/workloads',
        page: 'K8s/workload/Overview',
        element: k8sWorkloadOverview,
        index: true,
      },
    ],
  },
  {
    id: 'pods',
    routes: [
      {
        path: '/pods',
        page: 'K8s/pod/List',
        element: k8sPodList,
        index: true,
      },
      {
        path: '/pod/:namespace/:name',
        page: 'K8s/pod/Details',
        element: k8sPodDetails,
      },
    ],
  },
  {
    id: 'deployments',
    routes: [
      {
        path: '/deployments',
        page: 'K8s/deployments/List',
        element: k8sDeploymentsList,
        index: true,
      },
      {
        path: '/deployment/:namespace/:name',
        page: 'K8s/workload/Details',
        element: k8sWorkloadDetails,
        props: { workloadKind: Deployment },
      },
    ],
  },
  {
    id: 'statefulSets',
    routes: [
      {
        path: '/statefulsets',
        page: 'K8s/statefulset/List',
        element: k8sStatefulsetList,
        index: true,
      },
      {
        path: '/statefulset/:namespace/:name',
        page: 'K8s/statefulset/Details',
        element: k8sStatefulsetDetails,
        props: { workloadKind: StatefulSet },
      },
    ],
  },
  {
    id: 'daemonSets',
    routes: [
      {
        path: '/daemonsets',
        page: 'K8s/daemonset/List',
        element: k8sDaemonsetList,
        index: true,
      },
      {
        path: '/daemonset/:namespace/:name',
        page: 'K8s/daemonset/Details',
        element: k8sDaemonsetDetails,
        props: { workloadKind: DaemonSet },
      },
    ],
  },
  {
    id: 'replicaSets',
    routes: [
      {
        path: '/replicasets',
        page: 'K8s/replicaset/List',
        element: k8sReplicasetList,
        index: true,
      },
      {
        path: '/replicaset/:namespace/:name',
        page: 'K8s/workload/Details',
        element: k8sWorkloadDetails,
        props: { workloadKind: ReplicaSet },
      },
    ],
  },
  {
    id: 'jobs',
    routes: [
      {
        path: '/jobs',
        page: 'K8s/job/List',
        element: k8sJobList,
        index: true,
      },
      {
        path: '/job/:namespace/:name',
        page: 'K8s/workload/Details',
        element: k8sWorkloadDetails,
        props: { workloadKind: Job },
      },
    ],
  },
  {
    id: 'cronJobs',
    routes: [
      {
        path: '/cronjobs',
        page: 'K8s/cronjob/List',
        element: k8sCronjobList,
        index: true,
      },
      {
        path: '/cronjob/:namespace/:name',
        page: 'K8s/cronjob/Details',
        element: k8sCronjobDetails,
      },
    ],
  },

  {
    id: 'persistentVolumeClaims',
    routes: [
      {
        path: '/storage/persistentvolumeclaims',
        page: 'K8s/storage/ClaimList',
        element: k8sStorageClaimList,
        index: true,
      },
      {
        path: '/persistentvolumeclaim/:namespace/:name',
        page: 'K8s/storage/ClaimDetails',
        element: k8sStorageClaimDetails,
      },
    ],
  },
  {
    id: 'persistentVolumes',
    routes: [
      {
        path: '/storage/persistentvolumes',
        page: 'K8s/storage/VolumeList',
        element: k8sStorageVolumeList,
        index: true,
      },
      {
        path: '/persistentvolume/:name',
        page: 'K8s/storage/VolumeDetails',
        element: k8sStorageVolumeDetails,
      },
    ],
  },
  {
    id: 'storageClasses',
    routes: [
      {
        path: '/storage/classes',
        page: 'K8s/storage/ClassList',
        element: k8sStorageClassList,
        index: true,
      },
      {
        path: '/storageclass/:name',
        page: 'K8s/storage/ClassDetails',
        element: k8sStorageClassDetails,
      },
    ],
  },

  {
    id: 'services',
    routes: [
      {
        path: '/services',
        page: 'K8s/service/List',
        element: k8sServiceList,
        index: true,
      },
      {
        path: '/service/:namespace/:name',
        page: 'K8s/service/Details',
        element: k8sServiceDetails,
      },
    ],
  },
  {
    id: 'endpoints',
    routes: [
      {
        path: '/endpoints',
        page: 'K8s/endpoints/List',
        element: k8sEndpointsList,
        index: true,
      },
      {
        path: '/endpoint/:namespace/:name',
        page: 'K8s/endpoints/Details',
        element: k8sEndpointsDetails,
      },
    ],
  },
  {
    id: 'ingresses',
    routes: [
      {
        path: '/ingresses',
        page: 'K8s/ingress/List',
        element: k8sIngressList,
        index: true,
      },
      {
        path: '/ingress/:namespace/:name',
        page: 'K8s/ingress/Details',
        element: k8sIngressDetails,
      },
    ],
  },
  {
    id: 'ingressclasses',
    routes: [
      {
        path: '/ingressclasses',
        page: 'K8s/ingress/ClassList',
        element: k8sIngressClassList,
        index: true,
      },
      {
        path: '/ingressclass/:name',
        page: 'K8s/ingress/ClassDetails',
        element: k8sIngressClassDetails,
      },
    ],
  },
  {
    id: 'networkPolicies',
    routes: [
      {
        path: '/networkPolicies',
        page: 'K8s/networkpolicy/List',
        element: k8sNetworkpolicyList,
        index: true,
      },
      {
        path: '/networkPolicy/:namespace/:name',
        page: 'K8s/networkpolicy/Details',
        element: k8sNetworkpolicyDetails,
      },
    ],
  },

  {
    id: 'gateways',
    routes: [
      {
        path: '/gateways',
        page: 'K8s/gateway/GatewayList',
        element: k8sGatewayList,
        index: true,
      },
      {
        path: '/gateway:namespace/:name',
        page: 'K8s/gateway/GatewayDetails',
        element: k8sGatewayDetails,
      },
    ],
  },

  {
    id: 'gatewayclasses',
    routes: [
      {
        path: '/gatewayclasses',
        page: 'K8s/gateway/GatewayClassList',
        element: k8sGatewayClassList,
        index: true,
      },
      {
        path: '/gatewayclass/:name',
        page: 'K8s/gateway/GatewayClassDetails',
        element: k8sGatewayClassDetails,
      },
    ],
  },

  {
    id: 'httproutes',
    routes: [
      {
        path: '/httproutes',
        page: 'K8s/gateway/HttpRouteList',
        element: k8sHttpRouteList,
        index: true,
      },
      {
        path: '/httproute/:namespace/:name',
        page: 'K8s/gateway/HttpRouteDetails',
        element: k8sHttpRouteDetails,
      },
    ],
  },

  {
    id: 'grpcroutes',
    routes: [
      {
        path: '/grpcroutes',
        page: 'K8s/gateway/GrpcRouteList',
        element: k8sGrpcRouteList,
        index: true,
      },
      {
        path: '/grpcroute/:namespace/:name',
        page: 'K8s/gateway/GrpcRouteDetails',
        element: k8sGrpcRouteDetails,
      },
    ],
  },

  {
    id: 'serviceAccounts',
    routes: [
      {
        path: '/serviceaccounts',
        page: 'K8s/serviceaccount/List',
        index: true,
        element: k8sServiceaccountList,
      },
      {
        path: '/serviceaccount/:namespace/:name',
        page: 'K8s/serviceaccount/Details',
        element: k8sServiceaccountDetails,
      },
    ],
  },
  {
    id: 'roles',
    routes: [
      {
        path: '/roles',
        page: 'K8s/role/List',
        element: k8sRoleList,
        index: true,
      },
      {
        path: '/role/:namespace/:name',
        page: 'K8s/role/Details',
        element: k8sRoleDetails,
      },
      {
        path: '/clusterrole/:name',
        page: 'K8s/role/Details',
        element: k8sRoleDetails,
      },
    ],
  },
  {
    id: 'roleBindings',
    routes: [
      {
        path: '/roleBindings',
        page: 'K8s/role/BindingList',
        element: k8sRoleBindingList,
        index: true,
      },
      {
        path: '/roleBinding/:namespace/:name',
        page: 'K8s/role/BindingDetails',
        element: k8sRoleBindingDetails,
      },
      {
        path: '/clusterrolebinding/:name',
        page: 'K8s/role/BindingDetails',
        element: k8sRoleBindingDetails,
      },
    ],
  },

  {
    id: 'configMaps',
    routes: [
      {
        path: '/configmaps',
        page: 'K8s/configmap/List',
        element: k8sConfigmapList,
        index: true,
      },
      {
        path: '/configmap/:namespace/:name',
        page: 'K8s/configmap/Details',
        element: k8sConfigmapDetails,
      },
    ],
  },
  {
    id: 'secrets',
    routes: [
      {
        path: '/secrets',
        page: 'K8s/secret/List',
        element: k8sSecretList,
        index: true,
      },
      {
        path: '/secret/:namespace/:name',
        page: 'K8s/secret/Details',
        element: k8sSecretDetails,
      },
    ],
  },
  {
    id: 'horizontalPodAutoscalers',
    routes: [
      {
        path: '/horizontalpodautoscalers',
        page: 'K8s/horizontalPodAutoscaler/List',
        element: k8sHorizontalPodAutoscalerList,
        index: true,
      },
      {
        path: '/horizontalpodautoscaler/:namespace/:name',
        page: 'K8s/horizontalPodAutoscaler/Details',
        element: k8sHorizontalPodAutoscalerDetails,
      },
    ],
  },
  {
    id: 'verticalPodAutoscalers',
    routes: [
      {
        path: '/verticalpodautoscalers',
        page: 'K8s/verticalPodAutoscaler/List',
        element: k8sVerticalPodAutoscalerList,
        index: true,
      },
      {
        path: '/verticalpodautoscaler/:namespace/:name',
        page: 'K8s/verticalPodAutoscaler/Details',
        element: k8sVerticalPodAutoscalerDetails,
      },
    ],
  },
  {
    id: 'podDisruptionBudgets',
    routes: [
      {
        path: '/poddisruptionbudgets',
        page: 'K8s/podDisruptionBudget/List',
        element: k8sPodDisruptionBudgetList,
        index: true,
      },
      {
        path: '/poddisruptionbudget/:namespace/:name',
        page: 'K8s/podDisruptionBudget/Details',
        element: k8sPodDisruptionBudgetDetails,
      },
    ],
  },
  {
    id: 'resourceQuotas',
    routes: [
      {
        path: '/resourcequotas',
        page: 'K8s/resourceQuota/List',
        element: k8sResourceQuotaList,
        index: true,
      },
      {
        path: '/resourcequota/:namespace/:name',
        page: 'K8s/resourceQuota/Details',
        element: k8sResourceQuotaDetails,
      },
    ],
  },
  {
    id: 'limitRanges',
    routes: [
      {
        path: '/limitranges',
        page: 'K8s/limitRange/List',
        element: k8sLimitRangeList,
        index: true,
      },
      {
        path: '/limitrange/:namespace/:name',
        page: 'K8s/limitRange/Details',
        element: k8sLimitRangeDetails,
      },
    ],
  },
  {
    id: 'priorityClasses',
    routes: [
      {
        path: '/priorityclasses',
        page: 'K8s/priorityClass/List',
        element: k8sPriorityClassList,
        index: true,
      },
      {
        path: '/priorityclass/:name',
        page: 'K8s/priorityClass/Details',
        element: k8sPriorityClassDetails,
      },
    ],
  },
  {
    id: 'runtimeClasses',
    routes: [
      {
        path: '/runtimeclasses',
        page: 'K8s/runtimeClass/List',
        element: k8sRuntimeClassList,
        index: true,
      },
      {
        path: '/runtimeclass/:name',
        page: 'K8s/runtimeClass/Details',
        element: k8sRuntimeClassDetails,
      },
    ],
  },
  {
    id: 'leases',
    routes: [
      {
        path: '/leases',
        page: 'K8s/lease/List',
        element: k8sLeaseList,
        index: true,
      },
      {
        path: '/lease/:namespace/:name',
        page: 'K8s/lease/Details',
        element: k8sLeaseDetails,
      },
    ],
  },
  {
    id: 'mutatingWebhookConfigurations',
    routes: [
      {
        path: '/mutatingwebhookconfigurations',
        page: 'K8s/webhookconfiguration/MutatingWebhookConfigList',
        element: k8sWebhookconfigurationMutatingWebhookConfigList,
        index: true,
      },
      {
        path: '/mutatingwebhookconfiguration/:name',
        page: 'K8s/webhookconfiguration/MutatingWebhookConfigDetails',
        element: k8sWebhookconfigurationMutatingWebhookConfigDetails,
      },
    ],
  },
  {
    id: 'validatingWebhookConfigurations',
    routes: [
      {
        path: '/validatingwebhookconfigurations',
        page: 'K8s/webhookconfiguration/ValidatingWebhookConfigList',
        element: k8sWebhookconfigurationValidatingWebhookConfigList,
        index: true,
      },
      {
        path: '/validatingwebhookconfiguration/:name',
        page: 'K8s/webhookconfiguration/ValidatingWebhookConfigDetails',
        element: k8sWebhookconfigurationValidatingWebhookConfigDetails,
      },
    ],
  },
  {
    id: 'crds',
    routes: [
      {
        path: '/crds',
        page: 'K8s/crd/List',
        element: k8sCustomResourceDefinitionList,
        index: true,
      },
      {
        path: '/crds/:name',
        page: 'K8s/crd/Details',
        element: k8sCustomResourceDefinitionDetails,
      },
      {
        path: '/customresources/:crd/:namespace/:crName',
        page: 'K8s/crd/CustomResourceDetails',
        element: k8sCustomResourceDetails,
      },
      {
        path: '/customresources/:crd',
        page: 'K8s/crd/CustomResourceList',
        element: k8sCustomResourceList,
      },
    ],
  },
  {
    id: 'crs',
    routes: [
      {
        path: '/crs',
        page: 'K8s/crd/CustomResourceInstancesList',
        element: k8sCrsInstanceList,
        index: true,
      },
    ],
  },
  {
    id: 'maps',
    routes: [
      {
        path: '/maps',
        page: 'K8s/resourceMap/GraphView',
        element: k8sResourceMap,
        props: { height: 'calc(100vh - 64px)' },
        index: true,
      },
    ],
  },
  {
    id: 'tenantClusters',
    routes: [
      {
        path: '/kaas/clusters',
        page: 'KaaS/clusters/List',
        element: KaaSList,
        index: true,
      },
      {
        path: '/kaas/clusters/:managementNamespace/:name',
        page: 'KaaS/clusters/Detail',
        element: KaaSDetail,
      },
      {
        path: '/kaas/clusters/create',
        page: 'KaaS/clusters/Create',
        element: KaaSCreate,
      },
    ],
    useClusterURL: false,
  },
];

export const routeTable = Routes.reduce((ret: object, route: RoutesType) => ({ ...ret, [route.id]: route }), {});

// isUseClusterURL route가 cluster URL을 사용하는지 여부를 반환합니다.
export function isUseClusterURL(route: RoutesType): boolean {
  if (isUndefined(route?.useClusterURL)) {
    // 기본값은 true
    return true;
  }
  return route.useClusterURL;
}

// getRouteIndexPath 인덱스 URL 패턴을 반환합니다. clusterURL을 허용하는 route인 경우 cluster 명을 지정해주면 cluster prefix를 추가합니다.
export function getRouteIndexPathPattern(route: RoutesType, cluster?: string | null) {
  const indexRoute = route.routes.find((route) => route.index);

  return indexRoute ? getRoutePathPattern(indexRoute, route, cluster) : '';
}

// getRoutePathPattern URL 패턴을 반환합니다. clusterURL을 허용하는 route인 경우 cluster 명을 지정해주면 cluster prefix를 추가합니다.
export function getRoutePathPattern(route: Route, parentRoute: RoutesType, cluster?: string | null) {
  if (!!cluster == false || !isUseClusterURL(parentRoute)) {
    return route.path;
  }

  return getClusterPrefixedPath(route.path);
}

// TODO index url만 지원 가능.. headlamp에서 사용하는 router.tsx/createRouteURL을 제거하고 통합된 url 생성 로직 필요
// createRouteIndexURL 인덱스 URL을 반환합니다.
export function createRouteIndexURL(routeId: string, params: RouteURLProps = {}) {
  const cluster = getCluster();
  const fullParams = {
    cluster,
    ...params,
  };

  const route = routeTable[routeId];
  return generatePath(getRouteIndexPathPattern(route, cluster), fullParams);
}
