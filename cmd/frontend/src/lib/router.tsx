// sort-imports-ignore
// 이 파일에서는 preitter import 정렬을 무시합니다. kubeObject 클래스 때문에 @pages와 @lib의 임포트 순서가 중요합니다.
import React, { Children, ReactNode, useEffect } from 'react';
import { generatePath, useLocation, useNavigationType } from 'react-router';

import { groupBy, isUndefined, mapValues, reduce, toLower } from 'lodash';

import Clusters from '@pages/Clusters/Clusters';
import Home from '@pages/Home';
import K8sClusterOverview from '@pages/K8s/cluster/Overview';
import K8sConfigmapDetails from '@pages/K8s/configmap/Details';
import K8sConfigmapList from '@pages/K8s/configmap/List';
import K8sCustomResourceDetails from '@pages/K8s/crd/CustomResourceDetails';
import K8sCrsInstanceList from '@pages/K8s/crd/CustomResourceInstancesList';
import K8sCustomResourceList from '@pages/K8s/crd/CustomResourceList';
import K8sCustomResourceDefinitionDetails from '@pages/K8s/crd/Details';
import K8sCustomResourceDefinitionList from '@pages/K8s/crd/List';
import K8sCronjobDetails from '@pages/K8s/cronjob/Details';
import K8sCronjobList from '@pages/K8s/cronjob/List';
// import K8sDaemonsetDetails from '@pages/K8s/daemonset/Details';
import K8sDaemonsetList from '@pages/K8s/daemonset/List';
import K8sDeploymentsList from '@pages/K8s/deployments/List';
import K8sEndpointsDetails from '@pages/K8s/endpoints/Details';
import K8sEndpointsList from '@pages/K8s/endpoints/List';
import K8sGatewayClassDetails from '@pages/K8s/gateway/ClassDetails';
import K8sGatewayClassList from '@pages/K8s/gateway/ClassList';
import K8sGrpcRouteDetails from '@pages/K8s/gateway/GRPCRouteDetails';
import K8sGrpcRouteList from '@pages/K8s/gateway/GRPCRouteList';
import K8sGatewayDetails from '@pages/K8s/gateway/GatewayDetails';
import K8sGatewayList from '@pages/K8s/gateway/GatewayList';
import K8sHttpRouteDetails from '@pages/K8s/gateway/HTTPRouteDetails';
import K8sHttpRouteList from '@pages/K8s/gateway/HTTPRouteList';
import K8sHorizontalPodAutoscalerDetails from '@pages/K8s/horizontalPodAutoscaler/Details';
import K8sHorizontalPodAutoscalerList from '@pages/K8s/horizontalPodAutoscaler/List';
import K8sIngressClassDetails from '@pages/K8s/ingress/ClassDetails';
import K8sIngressClassList from '@pages/K8s/ingress/ClassList';
import K8sIngressDetails from '@pages/K8s/ingress/Details';
import K8sIngressList from '@pages/K8s/ingress/List';
import K8sJobList from '@pages/K8s/job/List';
import K8sLeaseDetails from '@pages/K8s/lease/Details';
import K8sLeaseList from '@pages/K8s/lease/List';
import K8sLimitRangeDetails from '@pages/K8s/limitRange/Details';
import K8sLimitRangeList from '@pages/K8s/limitRange/List';
import K8sNamespaceDetails from '@pages/K8s/namespace/Details';
import K8sNamespaceList from '@pages/K8s/namespace/List';
import K8sNetworkpolicyDetails from '@pages/K8s/networkpolicy/Details';
import K8sNetworkpolicyList from '@pages/K8s/networkpolicy/List';
import K8sNodeDetails from '@pages/K8s/node/Details';
import K8sNodeList from '@pages/K8s/node/List';
import K8sPodDetails from '@pages/K8s/pod/Details';
import K8sPodList from '@pages/K8s/pod/List';
import K8sPodDisruptionBudgetDetails from '@pages/K8s/podDisruptionBudget/Details';
import K8sPodDisruptionBudgetList from '@pages/K8s/podDisruptionBudget/List';
import K8sPriorityClassDetails from '@pages/K8s/priorityClass/Details';
import K8sPriorityClassList from '@pages/K8s/priorityClass/List';
import K8sReplicasetList from '@pages/K8s/replicaset/List';
import K8sResourceQuotaDetails from '@pages/K8s/resourceQuota/Details';
import K8sResourceQuotaList from '@pages/K8s/resourceQuota/List';
import K8sRoleBindingDetails from '@pages/K8s/role/BindingDetails';
import K8sRoleBindingList from '@pages/K8s/role/BindingList';
import K8sRoleDetails from '@pages/K8s/role/Details';
import K8sRoleList from '@pages/K8s/role/List';
import K8sRuntimeClassDetails from '@pages/K8s/runtimeClass/Details';
import K8sRuntimeClassList from '@pages/K8s/runtimeClass/List';
import K8sSecretDetails from '@pages/K8s/secret/Details';
import K8sSecretList from '@pages/K8s/secret/List';
import K8sServiceDetails from '@pages/K8s/service/Details';
import K8sServiceList from '@pages/K8s/service/List';
import K8sServiceaccountDetails from '@pages/K8s/serviceaccount/Details';
import K8sServiceaccountList from '@pages/K8s/serviceaccount/List';
// import K8sStatefulsetDetails from '@pages/K8s/statefulset/Details';
import K8sStatefulsetList from '@pages/K8s/statefulset/List';
import K8sStorageClaimDetails from '@pages/K8s/storage/ClaimDetails';
import K8sStorageClaimList from '@pages/K8s/storage/ClaimList';
import K8sStorageClassDetails from '@pages/K8s/storage/ClassDetails';
import K8sStorageClassList from '@pages/K8s/storage/ClassList';
import K8sStorageVolumeDetails from '@pages/K8s/storage/VolumeDetails';
import K8sStorageVolumeList from '@pages/K8s/storage/VolumeList';
import K8sVerticalPodAutoscalerDetails from '@pages/K8s/verticalPodAutoscaler/Details';
import K8sVerticalPodAutoscalerList from '@pages/K8s/verticalPodAutoscaler/List';
import K8sWebhookconfigurationMutatingWebhookConfigDetails from '@pages/K8s/webhookconfiguration/MutatingWebhookConfigDetails';
import K8sWebhookconfigurationMutatingWebhookConfigList from '@pages/K8s/webhookconfiguration/MutatingWebhookConfigList';
import K8sWebhookconfigurationValidatingWebhookConfigDetails from '@pages/K8s/webhookconfiguration/ValidatingWebhookConfigDetails';
import K8sWebhookconfigurationValidatingWebhookConfigList from '@pages/K8s/webhookconfiguration/ValidatingWebhookConfigList';
import K8sWorkloadDetails from '@pages/K8s/workload/Details';
import K8sWorkloadOverview from '@pages/K8s/workload/Overview';
import KaaSCreate from '@pages/KaaS/clusters/Create';
import KaaSDetail from '@pages/KaaS/clusters/Detail';
import KaaSList from '@pages/KaaS/clusters/List';
import Settings from '@pages/Settings';
import { UsersDetail, UsersList } from '@pages/Users';

import DaemonSet from '@lib/k8s/daemonSet';
import Deployment from '@lib/k8s/deployment';
import Job from '@lib/k8s/job';
import ReplicaSet from '@lib/k8s/replicaSet';
import StatefulSet from '@lib/k8s/statefulSet';
import { getCluster, getClusterPrefixedPath } from '@lib/util';
import { useAtomValue, useSetAtom } from 'jotai';
import { routeLavel } from './stores';

const K8sResourceMap = React.lazy(() =>
  import('@pages/K8s/resourceMap/GraphView').then((it) => ({ default: it.default }))
);

export type RouteGroupTable = {
  [id: string]: RouteGroup;
};

export type RouteGroup = {
  indexId: string;
  routes: Route[];
  // URL에 cluster prefix 여부
  useClusterURL?: boolean;
};

export type Route = {
  id: string;
  path: string;
  element: () => ReactNode;
  index?: boolean;
  props?: any;

  // URL에 cluster prefix 여부
  useClusterURL?: boolean;
};

const Routes: RouteGroupTable = {
  home: {
    indexId: 'home',
    routes: [
      { id: 'home', path: '/home', element: () => <Home /> },
      { id: 'main', path: '/', element: () => <Home /> },
    ],
    useClusterURL: false,
  },
  users: {
    indexId: 'users',
    routes: [
      { id: 'users', path: '/users', element: () => <UsersList /> },
      { id: 'userCreate', path: '/users/create', element: () => <UsersDetail /> },
      { id: 'userDetail', path: '/users/:name', element: () => <UsersDetail /> },
    ],
    useClusterURL: false,
  },
  settings: {
    indexId: 'settings',
    routes: [{ id: 'settings', path: '/settings', element: () => <Settings /> }],
    useClusterURL: false,
  },
  // k8s
  clusters: {
    indexId: 'clusters',
    routes: [
      {
        id: 'clusters',
        path: '/clusters',

        element: () => <Clusters />,
      },
    ],
    useClusterURL: false,
  },
  cluster: {
    indexId: 'cluster',
    routes: [
      {
        id: 'cluster',
        path: '/cluster',

        element: () => <K8sClusterOverview />,
      },
    ],
  },
  namespaces: {
    indexId: 'namespaces',
    routes: [
      {
        id: 'namespaces',
        path: '/namespaces',

        element: () => <K8sNamespaceList />,
      },
      {
        id: 'namespace',
        path: '/namespace/:name',

        element: () => <K8sNamespaceDetails />,
      },
    ],
  },
  nodes: {
    indexId: 'nodes',
    routes: [
      {
        id: 'nodes',
        path: '/nodes',

        element: () => <K8sNodeList />,
      },
      {
        id: 'node',
        path: '/nodes/:name',

        element: () => <K8sNodeDetails />,
      },
    ],
  },
  workloads: {
    indexId: 'workloads',
    routes: [
      {
        id: 'workloads',
        path: '/workloads',

        element: () => <K8sWorkloadOverview />,
      },
    ],
  },
  pods: {
    indexId: 'pods',
    routes: [
      {
        id: 'pods',
        path: '/pods',

        element: () => <K8sPodList />,
      },
      {
        id: 'pod',
        path: '/pods/:namespace/:name',

        element: () => <K8sPodDetails />,
      },
    ],
  },
  deployments: {
    indexId: 'deployments',
    routes: [
      {
        id: 'deployments',
        path: '/deployments',

        element: () => <K8sDeploymentsList />,
      },
      {
        id: 'deployment',
        path: '/deployments/:namespace/:name',

        element: () => <K8sWorkloadDetails workloadKind={Deployment} />,
      },
    ],
  },
  statefulSets: {
    indexId: 'statefulSets',
    routes: [
      {
        id: 'statefulSets',
        path: '/statefulsets',

        element: () => <K8sStatefulsetList />,
      },
      {
        id: 'statefulSet',
        path: '/statefulsets/:namespace/:name',

        element: () => <K8sWorkloadDetails workloadKind={StatefulSet} />,
      },
    ],
  },
  daemonSets: {
    indexId: 'daemonSets',
    routes: [
      {
        id: 'daemonSets',
        path: '/daemonsets',

        element: () => <K8sDaemonsetList />,
      },
      {
        id: 'daemonSet',
        path: '/daemonsets/:namespace/:name',

        element: () => <K8sWorkloadDetails workloadKind={DaemonSet} />,
      },
    ],
  },
  replicaSets: {
    indexId: 'replicaSets',
    routes: [
      {
        id: 'replicaSets',
        path: '/replicasets',

        element: () => <K8sReplicasetList />,
      },
      {
        id: 'replicaSet',
        path: '/replicasets/:namespace/:name',

        element: () => <K8sWorkloadDetails workloadKind={ReplicaSet} />,
      },
    ],
  },
  jobs: {
    indexId: 'jobs',
    routes: [
      {
        id: 'jobs',
        path: '/jobs',

        element: () => <K8sJobList />,
      },
      {
        id: 'job',
        path: '/jobs/:namespace/:name',

        element: () => <K8sWorkloadDetails workloadKind={Job} />,
      },
    ],
  },
  cronJobs: {
    indexId: 'cronJobs',
    routes: [
      {
        id: 'cronJobs',
        path: '/cronjobs',

        element: () => <K8sCronjobList />,
      },
      {
        id: 'cronJob',
        path: '/cronjobs/:namespace/:name',

        element: () => <K8sCronjobDetails />,
      },
    ],
  },

  persistentVolumeClaims: {
    indexId: 'persistentVolumeClaims',
    routes: [
      {
        id: 'persistentVolumeClaims',
        path: '/storage/persistentvolumeclaims',

        element: () => <K8sStorageClaimList />,
      },
      {
        id: 'persistentVolumeClaim',
        path: '/storage/persistentvolumeclaims/:namespace/:name',

        element: () => <K8sStorageClaimDetails />,
      },
    ],
  },
  persistentVolumes: {
    indexId: 'persistentVolumes',
    routes: [
      {
        id: 'persistentVolumes',
        path: '/storage/persistentvolumes',

        element: () => <K8sStorageVolumeList />,
      },
      {
        id: 'persistentVolume',
        path: '/storage/persistentvolumes/:name',

        element: () => <K8sStorageVolumeDetails />,
      },
    ],
  },
  storageClasses: {
    indexId: 'storageClasses',
    routes: [
      {
        id: 'storageClasses',
        path: '/storage/classes',

        element: () => <K8sStorageClassList />,
      },
      {
        id: 'storageClass',
        path: '/storage/classes/:name',

        element: () => <K8sStorageClassDetails />,
      },
    ],
  },

  services: {
    indexId: 'services',
    routes: [
      {
        id: 'services',
        path: '/services',

        element: () => <K8sServiceList />,
      },
      {
        id: 'service',
        path: '/services/:namespace/:name',

        element: () => <K8sServiceDetails />,
      },
    ],
  },
  endpoints: {
    indexId: 'endpoints',
    routes: [
      {
        id: 'endpoints',
        path: '/endpoints',

        element: () => <K8sEndpointsList />,
      },
      {
        id: 'endpoint',
        path: '/endpoints/:namespace/:name',

        element: () => <K8sEndpointsDetails />,
      },
    ],
  },
  ingresses: {
    indexId: 'ingresses',
    routes: [
      {
        id: 'ingresses',
        path: '/ingresses',

        element: () => <K8sIngressList />,
      },
      {
        id: 'ingress',
        path: '/ingresses/:namespace/:name',

        element: () => <K8sIngressDetails />,
      },
    ],
  },
  ingressclasses: {
    indexId: 'ingressclasses',
    routes: [
      {
        id: 'ingressclasses',
        path: '/ingressclasses',

        element: () => <K8sIngressClassList />,
      },
      {
        id: 'ingressclass',
        path: '/ingressclasses/:name',

        element: () => <K8sIngressClassDetails />,
      },
    ],
  },
  networkPolicies: {
    indexId: 'networkPolicies',
    routes: [
      {
        id: 'networkPolicies',
        path: '/networkPolicies',

        element: () => <K8sNetworkpolicyList />,
      },
      {
        id: 'networkPolicy',
        path: '/networkPolicies/:namespace/:name',

        element: () => <K8sNetworkpolicyDetails />,
      },
    ],
  },

  gateways: {
    indexId: 'gateways',
    routes: [
      {
        id: 'gateways',
        path: '/gateways',

        element: () => <K8sGatewayList />,
      },
      {
        id: 'gateway',
        path: '/gateways/:namespace/:name',

        element: () => <K8sGatewayDetails />,
      },
    ],
  },

  gatewayclasses: {
    indexId: 'gatewayclasses',
    routes: [
      {
        id: 'gatewayclasses',
        path: '/gatewayclasses',

        element: () => <K8sGatewayClassList />,
      },
      {
        id: 'gatewayclass',
        path: '/gatewayclasses/:name',

        element: () => <K8sGatewayClassDetails />,
      },
    ],
  },

  httproutes: {
    indexId: 'httproutes',
    routes: [
      {
        id: 'httproutes',
        path: '/httproutes',

        element: () => <K8sHttpRouteList />,
      },
      {
        id: 'httprout',
        path: '/httproutes/:namespace/:name',

        element: () => <K8sHttpRouteDetails />,
      },
    ],
  },

  grpcroutes: {
    indexId: 'grpcroutes',
    routes: [
      {
        id: 'grpcroutes',
        path: '/grpcroutes',

        element: () => <K8sGrpcRouteList />,
      },
      {
        id: 'grpcrout',
        path: '/grpcroutes/:namespace/:name',

        element: () => <K8sGrpcRouteDetails />,
      },
    ],
  },

  serviceAccounts: {
    indexId: 'serviceAccounts',
    routes: [
      {
        id: 'serviceAccounts',
        path: '/serviceaccounts',

        element: () => <K8sServiceaccountList />,
      },
      {
        id: 'serviceAccount',
        path: '/serviceaccounts/:namespace/:name',

        element: () => <K8sServiceaccountDetails />,
      },
    ],
  },
  roles: {
    indexId: 'roles',
    routes: [
      {
        id: 'roles',
        path: '/roles',

        element: () => <K8sRoleList />,
      },
      {
        id: 'role',
        path: '/roles/:namespace/:name',

        element: () => <K8sRoleDetails />,
      },
      {
        id: 'clusterRoles',
        path: '/roles',
        element: () => <K8sRoleList />,
      },
      {
        id: 'clusterrole',
        path: '/clusterroles/:name',

        element: () => <K8sRoleDetails />,
      },
    ],
  },
  roleBindings: {
    indexId: 'roleBindings',
    routes: [
      {
        id: 'roleBindings',
        path: '/roleBindings',

        element: () => <K8sRoleBindingList />,
      },
      {
        id: 'roleBinding',
        path: '/roleBinding/:namespace/:name',

        element: () => <K8sRoleBindingDetails />,
      },
      {
        id: 'clusterRoleBindings',
        path: '/rolebindings',
        element: () => <K8sRoleBindingDetails />,
      },
      {
        id: 'clusterRoleBinding',
        path: '/clusterrolebinding/:name',

        element: () => <K8sRoleBindingDetails />,
      },
    ],
  },

  configMaps: {
    indexId: 'configMaps',
    routes: [
      {
        id: 'configMaps',
        path: '/configmaps',

        element: () => <K8sConfigmapList />,
      },
      {
        id: 'configMap',
        path: '/configmaps/:namespace/:name',

        element: () => <K8sConfigmapDetails />,
      },
    ],
  },
  secrets: {
    indexId: 'secrets',
    routes: [
      {
        id: 'secrets',
        path: '/secrets',

        element: () => <K8sSecretList />,
      },
      {
        id: 'secret',
        path: '/secrets/:namespace/:name',

        element: () => <K8sSecretDetails />,
      },
    ],
  },
  horizontalPodAutoscalers: {
    indexId: 'horizontalPodAutoscalers',
    routes: [
      {
        id: 'horizontalPodAutoscalers',
        path: '/horizontalpodautoscalers',

        element: () => <K8sHorizontalPodAutoscalerList />,
      },
      {
        id: 'horizontalPodAutoscaler',
        path: '/horizontalpodautoscalers/:namespace/:name',

        element: () => <K8sHorizontalPodAutoscalerDetails />,
      },
    ],
  },
  verticalPodAutoscalers: {
    indexId: 'verticalPodAutoscalers',
    routes: [
      {
        id: 'verticalPodAutoscalers',
        path: '/verticalpodautoscalers',

        element: () => <K8sVerticalPodAutoscalerList />,
      },
      {
        id: 'verticalPodAutoscaler',
        path: '/verticalpodautoscalers/:namespace/:name',

        element: () => <K8sVerticalPodAutoscalerDetails />,
      },
    ],
  },
  podDisruptionBudgets: {
    indexId: 'podDisruptionBudgets',
    routes: [
      {
        id: 'podDisruptionBudgets',
        path: '/poddisruptionbudgets',

        element: () => <K8sPodDisruptionBudgetList />,
      },
      {
        id: 'podDisruptionBudget',
        path: '/poddisruptionbudgets/:namespace/:name',

        element: () => <K8sPodDisruptionBudgetDetails />,
      },
    ],
  },
  resourceQuotas: {
    indexId: 'resourceQuotas',
    routes: [
      {
        id: 'resourceQuotas',
        path: '/resourcequotas',

        element: () => <K8sResourceQuotaList />,
      },
      {
        id: 'resourceQuota',
        path: '/resourcequotas/:namespace/:name',

        element: () => <K8sResourceQuotaDetails />,
      },
    ],
  },
  limitRanges: {
    indexId: 'limitRanges',
    routes: [
      {
        id: 'limitRanges',
        path: '/limitranges',

        element: () => <K8sLimitRangeList />,
      },
      {
        id: 'limitRange',
        path: '/limitranges/:namespace/:name',

        element: () => <K8sLimitRangeDetails />,
      },
    ],
  },
  priorityClasses: {
    indexId: 'priorityClasses',
    routes: [
      {
        id: 'priorityClasses',
        path: '/priorityclasses',

        element: () => <K8sPriorityClassList />,
      },
      {
        id: 'priorityClass',
        path: '/priorityclasses/:name',

        element: () => <K8sPriorityClassDetails />,
      },
    ],
  },
  runtimeClasses: {
    indexId: 'runtimeClasses',
    routes: [
      {
        id: 'runtimeClasses',
        path: '/runtimeclasses',

        element: () => <K8sRuntimeClassList />,
      },
      {
        id: 'runtimeClass',
        path: '/runtimeclasses/:name',

        element: () => <K8sRuntimeClassDetails />,
      },
    ],
  },
  leases: {
    indexId: 'leases',
    routes: [
      {
        id: 'leases',
        path: '/leases',

        element: () => <K8sLeaseList />,
      },
      {
        id: 'lease',
        path: '/leases/:namespace/:name',

        element: () => <K8sLeaseDetails />,
      },
    ],
  },
  mutatingWebhookConfigurations: {
    indexId: 'mutatingWebhookConfigurations',
    routes: [
      {
        id: 'mutatingWebhookConfigurations',
        path: '/mutatingwebhookconfigurations',

        element: () => <K8sWebhookconfigurationMutatingWebhookConfigList />,
      },
      {
        id: 'mutatingWebhookConfiguration',
        path: '/mutatingwebhookconfigurations/:name',

        element: () => <K8sWebhookconfigurationMutatingWebhookConfigDetails />,
      },
    ],
  },
  validatingWebhookConfigurations: {
    indexId: 'validatingWebhookConfigurations',
    routes: [
      {
        id: 'validatingWebhookConfigurations',
        path: '/validatingwebhookconfigurations',

        element: () => <K8sWebhookconfigurationValidatingWebhookConfigList />,
      },
      {
        id: 'validatingWebhookConfiguration',
        path: '/validatingwebhookconfigurations/:name',

        element: () => <K8sWebhookconfigurationValidatingWebhookConfigDetails />,
      },
    ],
  },
  crds: {
    indexId: 'crds',
    routes: [
      {
        id: 'crds',
        path: '/crds',

        element: () => <K8sCustomResourceDefinitionList />,
      },
      {
        id: 'crd',
        path: '/crds/:name',

        element: () => <K8sCustomResourceDefinitionDetails />,
      },
      {
        id: 'customresource',
        path: '/customresources/:crd/:namespace/:crName',

        element: () => <K8sCustomResourceDetails />,
      },
      {
        id: 'customresources',
        path: '/customresources/:crd',

        element: () => <K8sCustomResourceList />,
      },
    ],
  },
  crs: {
    indexId: 'crs',
    routes: [
      {
        id: 'crs',
        path: '/crs',

        element: () => <K8sCrsInstanceList />,
      },
    ],
  },
  maps: {
    indexId: 'maps',
    routes: [
      {
        id: 'maps',
        path: '/maps',

        element: () => <K8sResourceMap height="calc(100vh - 64px)" />,
      },
    ],
  },
  tenantClusters: {
    indexId: 'tenantClusters',
    routes: [
      {
        id: 'tenantClusters',
        path: '/kaas/clusters',

        element: () => <KaaSList />,
      },
      {
        id: 'tenantCluster',
        path: '/kaas/clusters/:managementNamespace/:name',

        element: () => <KaaSDetail />,
      },
      {
        id: 'tenantClusterCreate',
        path: '/kaas/clusters/create',

        element: () => <KaaSCreate />,
      },
    ],
    useClusterURL: false,
  },
};

// 라우트 id를 키로 가지는 라우트 객체를 반환
// {route1Id: route1, route2Id, route2, ...}
const getRouteById = (acc: object, group: RouteGroup) => {
  const routes = mapValues(
    groupBy(group.routes, (route: Route) => toLower(route.id)),
    (route: Route[]) => {
      // groupBy의 value는 array이므로 첫 번째 인덱스 선택
      const isIndex = group.indexId === route[0].id;

      return {
        ...route[0],
        index: isIndex,
        useClusterURL: route[0].useClusterURL,
      };
    }
  );

  return {
    ...acc,
    ...routes,
  };
};

export const routeTable = reduce(Routes, getRouteById, {});

// isUseClusterURL route가 cluster URL을 사용하는지 여부를 반환합니다.
export function isUseClusterURL(route: Route): boolean {
  if (isUndefined(route?.useClusterURL)) {
    // 기본값은 true
    return true;
  }
  return route.useClusterURL;
}

// getRoutePathPattern URL 패턴을 반환합니다. clusterURL을 허용하는 route인 경우 cluster 명을 지정해주면 cluster prefix를 추가합니다.
export function getRoutePathPattern(route: Route, cluster?: string | null) {
  if (!!cluster == false || !isUseClusterURL(route)) {
    return route.path;
  }

  return getClusterPrefixedPath(route.path);
}

// getRoute 라우트 id로 라우트 객체를 조회합니다.
export function getRoute(routeId: string): Route {
  return routeTable[toLower(routeId)];
}

export interface RouteURLProps {
  cluster?: string;
  [prop: string]: any;
}

// createRouteURL URL을 반환합니다.
export function createRouteURL(routeId: string, params: RouteURLProps = {}) {
  const cluster = getCluster();
  const fullParams = {
    cluster,
    ...params,
  };

  const route = getRoute(routeId);
  return generatePath(getRoutePathPattern(route, cluster), fullParams);
}

export function getRoutes() {
  return Routes;
}

export function PreviousRouteProvider({ children }: React.PropsWithChildren<{}>) {
  const location = useLocation();
  const action = useNavigationType();

  const setLocationInfo = useSetAtom(routeLavel);

  useEffect(() => {
    if (action === 'PUSH') {
      setLocationInfo((levels) => levels + 1);
    } else if (action === 'POP') {
      setLocationInfo((levels) => levels - 1);
    }
  }, [location, action]);

  return Children.toArray(children);
}

export function useHasPreviousRoute() {
  const routeLevels = useAtomValue(routeLavel);
  return routeLevels >= 1;
}
