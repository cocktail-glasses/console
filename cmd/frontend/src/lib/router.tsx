// import AuthChooser from '@components/authchooser';
// import KubeConfigLoader from '@components/cluster/KubeConfigLoader';
// import { PageGrid } from '@components/common/Resource/Resource';
// import { DefaultSidebars } from '@lib/Layout/Sidebar';
// import LocaleSelect from 'i18n/LocaleSelect/LocaleSelect';
// import Deployment from 'lib/k8s/deployment';
// import Job from 'lib/k8s/job';
// import ReplicaSet from 'lib/k8s/replicaSet';
// import NotFoundComponent from 'pages/Common/404';
// import Login from 'pages/Auth/Login';
// import OIDCAuth from 'pages/Auth/oidcauth';
// import Clusters from 'pages/Clusters/Clusters';
// import Home from 'pages/Home';
// import AuthToken from 'pages/K8s/account/Auth';
// import ConfigDetails from 'pages/K8s/configmap/Details';
// import ConfigMapList from 'pages/K8s/configmap/List';
// import CustomResourceDetails from 'pages/K8s/crd/CustomResourceDetails';
// import CustomResourceList from 'pages/K8s/crd/CustomResourceList';
// import CustomResourceDefinitionDetails from 'pages/K8s/crd/Details';
// import CustomResourceDefinitionList from 'pages/K8s/crd/List';
// import CronJobDetails from 'pages/K8s/cronjob/Details';
// import CronJobList from 'pages/K8s/cronjob/List';
// import DaemonSetDetails from 'pages/K8s/daemonset/Details';
// import DaemonSetList from 'pages/K8s/daemonset/List';
// import DeploymentsList from 'pages/K8s/deployments/List';
// import EndpointDetails from 'pages/K8s/endpoints/Details';
// import EndpointList from 'pages/K8s/endpoints/List';
// import HpaDetails from 'pages/K8s/horizontalPodAutoscaler/Details';
// import HpaList from 'pages/K8s/horizontalPodAutoscaler/List';
// import IngressClassDetails from 'pages/K8s/ingress/ClassDetails';
// import IngressClassList from 'pages/K8s/ingress/ClassList';
// import IngressDetails from 'pages/K8s/ingress/Details';
// import IngressList from 'pages/K8s/ingress/List';
// import JobsList from 'pages/K8s/job/List';
// import { LeaseDetails } from 'pages/K8s/lease/Details';
// import { LeaseList } from 'pages/K8s/lease/List';
// import { LimitRangeDetails } from 'pages/K8s/limitRange/Details';
// import { LimitRangeList } from 'pages/K8s/limitRange/List';
// import NamespaceDetails from 'pages/K8s/namespace/Details';
// import NamespacesList from 'pages/K8s/namespace/List';
// import { NetworkPolicyDetails } from 'pages/K8s/networkpolicy/Details';
// import { NetworkPolicyList } from 'pages/K8s/networkpolicy/List';
// import NodeDetails from 'pages/K8s/node/Details';
// import NodeList from 'pages/K8s/node/List';
// import PodDetails from 'pages/K8s/pod/Details';
// import PodList from 'pages/K8s/pod/List';
// import PDBDetails from 'pages/K8s/podDisruptionBudget/Details';
// import PDBList from 'pages/K8s/podDisruptionBudget/List';
// import PortForwardingList from 'pages/K8s/portforward';
// import PriorityClassDetails from 'pages/K8s/priorityClass/Details';
// import PriorityClassList from 'pages/K8s/priorityClass/List';
// import ReplicaSetList from 'pages/K8s/replicaset/List';
// import ResourceQuotaDetails from 'pages/K8s/resourceQuota/Details';
// import ResourceQuotaList from 'pages/K8s/resourceQuota/List';
// import RoleBindingDetails from 'pages/K8s/role/BindingDetails';
// import RoleBindingList from 'pages/K8s/role/BindingList';
// import RoleDetails from 'pages/K8s/role/Details';
// import RoleList from 'pages/K8s/role/List';
// import { RuntimeClassDetails } from 'pages/K8s/runtimeClass/Details';
// import { RuntimeClassList } from 'pages/K8s/runtimeClass/List';
// import SecretDetails from 'pages/K8s/secret/Details';
// import SecretList from 'pages/K8s/secret/List';
// import ServiceDetails from 'pages/K8s/service/Details';
// import ServiceList from 'pages/K8s/service/List';
// import ServiceAccountDetails from 'pages/K8s/serviceaccount/Details';
// import ServiceAccountList from 'pages/K8s/serviceaccount/List';
// import StatefulSetDetails from 'pages/K8s/statefulset/Details';
// import StatefulSetList from 'pages/K8s/statefulset/List';
// import PersistentVolumeClaimDetails from 'pages/K8s/storage/ClaimDetails';
// import PersistentVolumeClaimList from 'pages/K8s/storage/ClaimList';
// import StorageClassDetails from 'pages/K8s/storage/ClassDetails';
// import StorageClassList from 'pages/K8s/storage/ClassList';
// import PersistentVolumeDetails from 'pages/K8s/storage/VolumeDetails';
// import PersistentVolumeList from 'pages/K8s/storage/VolumeList';
// import VpaDetails from 'pages/K8s/verticalPodAutoscaler/Details';
// import VpaList from 'pages/K8s/verticalPodAutoscaler/List';
// import MutatingWebhookConfigurationDetails from 'pages/K8s/webhookconfiguration/MutatingWebhookConfigDetails';
// import MutatingWebhookConfigList from 'pages/K8s/webhookconfiguration/MutatingWebhookConfigList';
// import ValidatingWebhookConfigurationDetails from 'pages/K8s/webhookconfiguration/ValidatingWebhookConfigDetails';
// import ValidatingWebhookConfigurationList from 'pages/K8s/webhookconfiguration/ValidatingWebhookConfigList';
// import WorkloadDetails from 'pages/K8s/workload/Details';
// import WorkloadOverview from 'pages/K8s/workload/Overview';
// import NotificationList from 'pages/Notifications/List';
// import PluginSettings from 'pages/PluginSettings';
// // import PluginSettingsDetails from 'pages/PluginSettings/PluginSettingsDetails';
// import Settings from 'pages/Settings';
// import SettingsCluster from 'pages/Settings/SettingsCluster';
// import SettingsClusters from 'pages/Settings/SettingsClusters';
// import { UsersList, UsersDetail } from 'pages/Users'
import { generatePath } from 'react-router';

import { getCluster } from '@lib/util';

// import store from 'redux/stores/store';

// export interface Route {
//   /** Any valid URL path or array of paths that path-to-regexp@^1.7.0 understands. */
//   path: string;
//   /** When true, will only match if the path matches the location.pathname exactly. */
//   exact?: boolean;
//   /** Human readable name. Capitalized and short. */
//   name?: string;
//   /**
//    * In case this route does *not* need a cluster prefix and context.
//    * @deprecated please use useClusterURL.
//    */
//   noCluster?: boolean;
//   /**
//    * Should URL have the cluster prefix? (default=true)
//    */
//   useClusterURL?: boolean;
//   /** This route does not require Authentication. */
//   noAuthRequired?: boolean;
//   /** The sidebar entry this Route should enable, or null if it shouldn't enable any. If an object is passed with item and sidebar, it will try to enable the given sidebar and the given item. */
//   sidebar: string | null | { item: string | null; sidebar: string | DefaultSidebars };
//   /** Shown component for this route. */
//   component: () => JSX.Element;
//   /** Hide the appbar at the top. */
//   hideAppBar?: boolean;
//   /** Whether the route should be disabled (not registered). */
//   disabled?: boolean;
// }

// const defaultRoutes: {
//   [routeName: string]: Route;
// } = {
//   userLogin: {
//     path: '/user/login',
//     exact: true,
//     name: 'Login',
//     sidebar: null,
//     useClusterURL: false,
//     noAuthRequired: true,
//     component: () => <Login />,
//     hideAppBar: true,
//   },
//   clusters: {
//     path: '/clusters',
//     exact: true,
//     name: 'Clusters',
//     sidebar: {
//       item: 'clusters',
//       sidebar: DefaultSidebars.HOME,
//     },
//     useClusterURL: false,
//     component: () => <Clusters />,
//   },
//   users: {
//     path: '/users',
//     exact: true,
//     name: 'Users',
//     sidebar: {
//       item: 'users',
//       sidebar: DefaultSidebars.HOME
//     },
//     useClusterURL: false,
//     component: () => <UsersList />,
//   },
//   userDetail: {
//     path: '/users/:name',
//     sidebar: null,
//     // sidebar: {
//     //   item: 'users',
//     //   sidebar: DefaultSidebars.HOME
//     // },
//     useClusterURL: false,
//     component: () => <UsersDetail />,
//   },
//   // cluster: {
//   //   path: '/',
//   //   exact: true,
//   //   name: 'Cluster',
//   //   sidebar: 'cluster',
//   //   component: () => <Overview />,
//   // },
//   chooser: {
//     path: '/',
//     exact: true,
//     name: 'Choose a cluster',
//     sidebar: {
//       item: 'home',
//       sidebar: DefaultSidebars.HOME,
//     },
//     useClusterURL: false,
//     noAuthRequired: true,
//     component: () => <Home />,
//   },
//   namespaces: {
//     path: '/namespaces',
//     name: 'Namespaces',
//     exact: true,
//     sidebar: 'namespaces',
//     component: () => <NamespacesList />,
//   },
//   namespace: {
//     path: '/namespaces/:name',
//     sidebar: 'namespaces',
//     component: () => <NamespaceDetails />,
//   },
//   nodes: {
//     path: '/nodes',
//     name: 'Nodes',
//     exact: true,
//     sidebar: 'nodes',
//     component: () => <NodeList />,
//   },
//   node: {
//     path: '/nodes/:name',
//     sidebar: 'nodes',
//     component: () => <NodeDetails />,
//   },
//   storageClasses: {
//     path: '/storage/classes',
//     exact: true,
//     sidebar: 'storageClasses',
//     name: 'Storage Classes',
//     component: () => <StorageClassList />,
//   },
//   storageClass: {
//     path: '/storage/classes/:name',
//     name: 'Storage Classes',
//     sidebar: 'storageClasses',
//     component: () => <StorageClassDetails />,
//   },
//   persistentVolumes: {
//     path: '/storage/persistentvolumes',
//     exact: true,
//     sidebar: 'persistentVolumes',
//     name: 'Persistent Volumes',
//     component: () => <PersistentVolumeList />,
//   },
//   persistentVolume: {
//     path: '/storage/persistentvolumes/:name',
//     exact: true,
//     sidebar: 'persistentVolumes',
//     name: 'Persistent Volume',
//     component: () => <PersistentVolumeDetails />,
//   },
//   persistentVolumeClaims: {
//     path: '/storage/persistentvolumeclaims',
//     exact: true,
//     sidebar: 'persistentVolumeClaims',
//     name: 'Persistent Volume Claims',
//     component: () => <PersistentVolumeClaimList />,
//   },
//   persistentVolumeClaim: {
//     path: '/storage/persistentvolumeclaims/:namespace/:name',
//     sidebar: 'persistentVolumeClaims',
//     exact: true,
//     component: () => <PersistentVolumeClaimDetails />,
//   },
//   workloads: {
//     path: '/workloads',
//     exact: true,
//     name: 'Workloads',
//     sidebar: 'workloads',
//     component: () => <WorkloadOverview />,
//   },
//   DaemonSet: {
//     path: '/daemonsets/:namespace/:name',
//     exact: true,
//     sidebar: 'DaemonSets',
//     component: () => <DaemonSetDetails />,
//   },
//   StatefulSet: {
//     path: '/statefulsets/:namespace/:name',
//     exact: true,
//     sidebar: 'StatefulSets',
//     component: () => <StatefulSetDetails />,
//   },
//   Deployment: {
//     path: '/deployments/:namespace/:name',
//     exact: true,
//     sidebar: 'Deployments',
//     component: () => <WorkloadDetails workloadKind={Deployment} />,
//   },
//   Job: {
//     path: '/jobs/:namespace/:name',
//     exact: true,
//     sidebar: 'Jobs',
//     component: () => <WorkloadDetails workloadKind={Job} />,
//   },
//   CronJob: {
//     path: '/cronjobs/:namespace/:name',
//     exact: true,
//     sidebar: 'CronJobs',
//     component: () => <CronJobDetails />,
//   },
//   Pods: {
//     path: '/pods',
//     exact: true,
//     name: 'Pods',
//     sidebar: 'Pods',
//     component: () => <PodList />,
//   },
//   Pod: {
//     path: '/pods/:namespace/:name',
//     exact: true,
//     sidebar: 'Pods',
//     component: () => <PodDetails />,
//   },
//   services: {
//     path: '/services',
//     exact: true,
//     name: 'Services',
//     sidebar: 'services',
//     component: () => <ServiceList />,
//   },
//   service: {
//     path: '/services/:namespace/:name',
//     exact: true,
//     sidebar: 'services',
//     component: () => <ServiceDetails />,
//   },
//   endpoints: {
//     path: '/endpoints',
//     exact: true,
//     name: 'Endpoints',
//     sidebar: 'endpoints',
//     component: () => <EndpointList />,
//   },
//   endpoint: {
//     path: '/endpoints/:namespace/:name',
//     exact: true,
//     sidebar: 'endpoints',
//     component: () => <EndpointDetails />,
//   },
//   ingresses: {
//     path: '/ingresses',
//     exact: true,
//     name: 'Ingresses',
//     sidebar: 'ingresses',
//     component: () => <IngressList />,
//   },
//   ingress: {
//     path: '/ingresses/:namespace/:name',
//     exact: true,
//     sidebar: 'ingresses',
//     component: () => <IngressDetails />,
//   },
//   ingressclasses: {
//     path: '/ingressclasses',
//     exact: true,
//     name: 'IngressClasses',
//     sidebar: 'ingressclasses',
//     component: () => <IngressClassList />,
//   },
//   ingressclass: {
//     path: '/ingressclasses/:name',
//     exact: true,
//     sidebar: 'ingressclasses',
//     component: () => <IngressClassDetails />,
//   },
//   networkPolicies: {
//     path: '/networkpolicies',
//     exact: true,
//     sidebar: 'NetworkPolicies',
//     component: () => <NetworkPolicyList />,
//   },
//   networkPolicy: {
//     path: '/networkpolicies/:namespace/:name',
//     exact: true,
//     sidebar: 'NetworkPolicies',
//     component: () => <NetworkPolicyDetails />,
//   },
//   DaemonSets: {
//     path: '/daemonsets',
//     exact: true,
//     sidebar: 'DaemonSets',
//     name: 'DaemonSets',
//     component: () => <DaemonSetList />,
//   },
//   Jobs: {
//     path: '/jobs',
//     exact: true,
//     sidebar: 'Jobs',
//     name: 'Jobs',
//     component: () => <JobsList />,
//   },
//   CronJobs: {
//     path: '/cronjobs',
//     exact: true,
//     sidebar: 'CronJobs',
//     name: 'CronJobs',
//     component: () => <CronJobList />,
//   },
//   Deployments: {
//     path: '/deployments',
//     exact: true,
//     sidebar: 'Deployments',
//     name: 'Deployments',
//     component: () => <DeploymentsList />,
//   },
//   StatefulSets: {
//     path: '/statefulsets',
//     exact: true,
//     sidebar: 'StatefulSets',
//     name: 'StatefulSets',
//     component: () => <StatefulSetList />,
//   },
//   ReplicaSets: {
//     path: '/replicasets',
//     exact: true,
//     name: 'ReplicaSets',
//     sidebar: 'ReplicaSets',
//     component: () => <ReplicaSetList />,
//   },
//   ReplicaSet: {
//     path: '/replicasets/:namespace/:name',
//     exact: true,
//     sidebar: 'ReplicaSets',
//     component: () => <WorkloadDetails workloadKind={ReplicaSet} />,
//   },
//   configMaps: {
//     path: '/configmaps',
//     exact: true,
//     name: 'Config Maps',
//     sidebar: 'configMaps',
//     component: () => <ConfigMapList />,
//   },
//   configMap: {
//     path: '/configmaps/:namespace/:name',
//     exact: true,
//     sidebar: 'configMaps',
//     component: () => <ConfigDetails />,
//   },
//   serviceAccounts: {
//     path: '/serviceaccounts',
//     exact: true,
//     name: 'Service Accounts',
//     sidebar: 'serviceAccounts',
//     component: () => <ServiceAccountList />,
//   },
//   serviceAccount: {
//     path: '/serviceaccounts/:namespace/:name',
//     exact: true,
//     sidebar: 'serviceAccounts',
//     component: () => <ServiceAccountDetails />,
//   },
//   roles: {
//     path: '/roles',
//     exact: true,
//     name: 'Roles',
//     sidebar: 'roles',
//     component: () => <RoleList />,
//   },
//   role: {
//     path: '/roles/:namespace/:name',
//     exact: true,
//     sidebar: 'roles',
//     component: () => <RoleDetails />,
//   },
//   clusterrole: {
//     path: '/clusterroles/:name',
//     exact: true,
//     sidebar: 'roles',
//     component: () => <RoleDetails />,
//   },
//   clusterRoles: {
//     path: '/roles',
//     exact: true,
//     sidebar: 'roles',
//     component: () => <RoleList />,
//   },
//   roleBindings: {
//     path: '/rolebindings',
//     exact: true,
//     name: 'Role Bindings',
//     sidebar: 'roleBindings',
//     component: () => <RoleBindingList />,
//   },
//   roleBinding: {
//     path: '/rolebinding/:namespace/:name',
//     exact: true,
//     name: 'Role Binding',
//     sidebar: 'roleBindings',
//     component: () => <RoleBindingDetails />,
//   },
//   clusterRoleBinding: {
//     path: '/clusterrolebinding/:name',
//     exact: true,
//     name: 'Role Binding',
//     sidebar: 'roleBindings',
//     component: () => <RoleBindingDetails />,
//   },
//   clusterRoleBindings: {
//     path: '/rolebindings',
//     exact: true,
//     sidebar: 'roleBindings',
//     component: () => <RoleBindingDetails />,
//   },
//   secrets: {
//     path: '/secrets',
//     exact: true,
//     name: 'Secrets',
//     sidebar: 'secrets',
//     component: () => <SecretList />,
//   },
//   secret: {
//     path: '/secrets/:namespace/:name',
//     exact: true,
//     sidebar: 'secrets',
//     component: () => <SecretDetails />,
//   },
//   horizontalPodAutoscalers: {
//     path: '/horizontalpodautoscalers',
//     exact: true,
//     name: 'Horizontal Pod Autoscalers',
//     sidebar: 'horizontalPodAutoscalers',
//     component: () => <HpaList />,
//   },
//   horizontalPodAutoscaler: {
//     path: '/horizontalpodautoscalers/:namespace/:name',
//     exact: true,
//     name: 'Horizontal Pod Autoscaler',
//     sidebar: 'horizontalPodAutoscalers',
//     component: () => <HpaDetails />,
//   },
//   podDisruptionBudgets: {
//     path: '/poddisruptionbudgets',
//     exact: true,
//     name: 'Pod Disruption Budgets',
//     sidebar: 'podDisruptionBudgets',
//     component: () => <PDBList />,
//   },
//   podDisruptionBudget: {
//     path: '/poddisruptionbudgets/:namespace/:name',
//     exact: true,
//     name: 'Pod Disruption Budget',
//     sidebar: 'podDisruptionBudgets',
//     component: () => <PDBDetails />,
//   },
//   priorityclasses: {
//     path: '/priorityclasses',
//     exact: true,
//     name: 'Priority Classes',
//     sidebar: 'priorityClasses',
//     component: () => <PriorityClassList />,
//   },
//   priorityClass: {
//     path: '/priorityclasses/:name',
//     exact: true,
//     name: 'PriorityClass',
//     sidebar: 'priorityClasses',
//     component: () => <PriorityClassDetails />,
//   },
//   resourceQuotas: {
//     path: '/resourcequotas',
//     exact: true,
//     name: 'Resource Quotas',
//     sidebar: 'resourceQuotas',
//     component: () => <ResourceQuotaList />,
//   },
//   resourceQuota: {
//     path: '/resourcequotas/:namespace/:name',
//     exact: true,
//     name: 'Resource Quota',
//     sidebar: 'resourceQuotas',
//     component: () => <ResourceQuotaDetails />,
//   },
//   leases: {
//     path: '/leases',
//     exact: true,
//     name: 'Leases',
//     sidebar: 'leases',
//     component: () => <LeaseList />,
//   },
//   lease: {
//     path: '/leases/:namespace/:name',
//     exact: true,
//     name: 'Lease',
//     sidebar: 'leases',
//     component: () => <LeaseDetails />,
//   },
//   runtimeClasses: {
//     path: '/runtimeclasses',
//     exact: true,
//     name: 'Runtime Classes',
//     sidebar: 'runtimeClasses',
//     component: () => <RuntimeClassList />,
//   },
//   runtimeClass: {
//     path: '/runtimeclasses/:name',
//     exact: true,
//     name: 'Runtime Class',
//     sidebar: 'runtimeClasses',
//     component: () => <RuntimeClassDetails />,
//   },
//   limitRanges: {
//     path: '/limitranges',
//     exact: true,
//     name: 'Limit Ranges',
//     sidebar: 'limitRanges',
//     component: () => <LimitRangeList />,
//   },
//   limitRange: {
//     path: '/limitranges/:namespace/:name',
//     exact: true,
//     name: 'Limit Range',
//     sidebar: 'limitRanges',
//     component: () => <LimitRangeDetails />,
//   },
//   mutatingWebhookConfigurations: {
//     path: '/mutatingwebhookconfigurations',
//     exact: true,
//     name: 'Mutating Webhook Configurations',
//     sidebar: 'mutatingWebhookConfigurations',
//     component: () => <MutatingWebhookConfigList />,
//   },
//   mutatingWebhookConfiguration: {
//     path: '/mutatingwebhookconfigurations/:name',
//     exact: true,
//     name: 'Mutating Webhook Configuration',
//     sidebar: 'mutatingWebhookConfigurations',
//     component: () => <MutatingWebhookConfigurationDetails />,
//   },
//   validatingWebhookConfigurations: {
//     path: '/validatingwebhookconfigurations',
//     exact: true,
//     name: 'Validating Webhook Configurations',
//     sidebar: 'validatingWebhookConfigurations',
//     component: () => <ValidatingWebhookConfigurationList />,
//   },
//   validatingWebhookConfiguration: {
//     path: '/validatingwebhookconfigurations/:name',
//     exact: true,
//     name: 'Validating Webhook Configuration',
//     sidebar: 'validatingWebhookConfigurations',
//     component: () => <ValidatingWebhookConfigurationDetails />,
//   },
//   verticalPodAutoscalers: {
//     path: '/verticalpodautoscalers',
//     exact: true,
//     name: 'Vertical Pod Autoscalers',
//     sidebar: 'verticalPodAutoscalers',
//     component: () => <VpaList />,
//   },
//   verticalPodAutoscaler: {
//     path: '/verticalpodautoscalers/:namespace/:name',
//     exact: true,
//     name: 'Vertical Pod Autoscaler',
//     sidebar: 'verticalPodAutoscalers',
//     component: () => <VpaDetails />,
//   },
//   token: {
//     path: '/token',
//     exact: true,
//     name: 'Token',
//     sidebar: null,
//     noAuthRequired: true,
//     component: () => <AuthToken />,
//   },
//   oidcAuth: {
//     path: '/auth',
//     name: 'OidcAuth',
//     sidebar: null,
//     noAuthRequired: true,
//     component: () => <OIDCAuth />,
//   },
//   login: {
//     path: '/login',
//     exact: true,
//     name: 'Login',
//     sidebar: null,
//     noAuthRequired: true,
//     component: () => (
//       <AuthChooser>
//         <LocaleSelect />
//       </AuthChooser>
//     ),
//   },
//   crds: {
//     path: '/crds',
//     exact: true,
//     name: 'CRDs',
//     sidebar: 'crds',
//     component: () => <CustomResourceDefinitionList />,
//   },
//   crd: {
//     path: '/crds/:name',
//     exact: true,
//     name: 'CRD',
//     sidebar: 'crds',
//     component: () => <CustomResourceDefinitionDetails />,
//   },
//   customresource: {
//     path: '/customresources/:crd/:namespace/:crName',
//     exact: true,
//     name: 'Custom Resource',
//     sidebar: 'crds',
//     component: () => <CustomResourceDetails />,
//   },
//   customresources: {
//     path: '/customresources/:crd',
//     exact: true,
//     name: 'Custom Resources',
//     sidebar: 'crds',
//     component: () => <CustomResourceList />,
//   },
//   notifications: {
//     path: '/notifications',
//     exact: true,
//     useClusterURL: false,
//     name: 'Notifications',
//     sidebar: {
//       item: 'notifications',
//       sidebar: DefaultSidebars.HOME,
//     },
//     noAuthRequired: true,
//     component: () => (
//       <PageGrid>
//         <NotificationList />
//       </PageGrid>
//     ),
//   },
//   settings: {
//     path: '/settings',
//     exact: true,
//     name: 'Settings',
//     sidebar: {
//       item: 'settings',
//       sidebar: DefaultSidebars.HOME,
//     },
//     useClusterURL: false,
//     noAuthRequired: true,
//     component: () => (
//       <PageGrid>
//         <Settings />
//       </PageGrid>
//     ),
//   },

//   settingsClusters: {
//     path: '/settings/clusters',
//     exact: true,
//     name: 'Clusters',
//     sidebar: 'settingsClusters',
//     useClusterURL: false,
//     noAuthRequired: true,
//     component: () => (
//       <PageGrid>
//         <SettingsClusters />
//       </PageGrid>
//     ),
//   },
//   settingsCluster: {
//     path: '/settings',
//     exact: true,
//     name: 'Cluster Settings',
//     sidebar: 'settingsCluster',
//     noAuthRequired: true,
//     component: () => (
//       <PageGrid>
//         <SettingsCluster />
//       </PageGrid>
//     ),
//   },
//   // DISABLED UNTIL DATA HOOK UP
//   plugins: {
//     path: '/settings/plugins',
//     exact: true,
//     name: 'Plugins',
//     sidebar: {
//       item: 'plugins',
//       sidebar: DefaultSidebars.HOME,
//     },
//     useClusterURL: false,
//     noAuthRequired: true,
//     component: () => <PluginSettings />,
//   },
//   // pluginDetails: {
//   //   path: '/settings/plugins/:name',
//   //   exact: true,
//   //   name: 'Plugin Details',
//   //   sidebar: {
//   //     item: 'plugins',
//   //     sidebar: DefaultSidebars.HOME,
//   //   },
//   //   useClusterURL: false,
//   //   noAuthRequired: true,
//   //   component: () => <PluginSettingsDetails />,
//   // },
//   portforwards: {
//     path: '/portforwards',
//     exact: true,
//     name: 'PortForwards',
//     sidebar: 'portforwards',
//     component: () => <PortForwardingList />,
//   },
//   loadKubeConfig: {
//     path: '/load-kube-config',
//     exact: true,
//     name: 'Load KubeConfig',
//     sidebar: null,
//     useClusterURL: false,
//     noAuthRequired: true,
//     component: () => <KubeConfigLoader />,
//   },
// };

// // The NotFound route  needs to be considered always in the last place when used
// // with the router switch, as any routes added after this one will never be considered.
// // So we do not include it in the default routes in order to always "manually" consider it.
// export const NotFoundRoute = {
//   path: '*',
//   exact: true,
//   name: 'Whoops! This page doesn\'t exist',
//   component: () => <NotFoundComponent />,
//   sidebar: null,
//   noAuthRequired: true,
// };

// export function getRoute(routeName: string) {
//   let routeKey = routeName;
//   for (const key in defaultRoutes) {
//     if (key.toLowerCase() === routeName.toLowerCase()) {
//       // if (key !== routeName) {
//       //   console.warn(`Route name ${routeName} and ${key} are not matching`);
//       // }
//       routeKey = key;
//       break;
//     }
//   }
//   return defaultRoutes[routeKey];
// }

// /**
//  * Should the route use a cluster URL?
//  *
//  * @param route
//  * @returns true when a cluster URL contains cluster in the URL. eg. /c/minikube/my-url
//  *   false, the URL does not contain the cluster. eg. /my-url
//  */
// export function getRouteUseClusterURL(route: Route): boolean {
//   if (route.useClusterURL === undefined && route.noCluster !== undefined) {
//     console.warn('Route.noCluster is deprecated. Please use route.useClusterURL instead.');
//     return route.noCluster;
//   }
//   if (route.useClusterURL === undefined) {
//     // default is true, so undefined === true.
//     return true;
//   }
//   return route.useClusterURL;
// }

// export function getRoutePath(route: Route) {
//   if (route.path === NotFoundRoute.path) {
//     return route.path;
//   }
//   if (!getRouteUseClusterURL(route)) {
//     return route.path;
//   }

//   return getClusterPrefixedPath(route.path);
// }

export interface RouteURLProps {
  cluster?: string;
  [prop: string]: any;
}
export function createRouteURL(routeName: string, params: any = {}) {
  const cluster = getCluster() || 0;
  const fullParams = {
    cluster,
    ...params,
  };
  // const path = ['', 'clusters', ':cluster']
  const path = ['', 'clusters'];
  if (fullParams) {
    path.push();
  }
  if (routeName !== '') {
    path.push(routeName.toLocaleLowerCase());
  }
  Object.entries(params).forEach(([k, v]) => {
    if (k !== 'cluster' && v !== undefined) {
      path.push(`:${k}`);
    }
  });
  // Object.keys(params).forEach(k => {
  //   if (k !== 'cluster') {
  //     path.push(`:${k}`)
  //   }
  // })
  // console.log("path", path, fullParams);
  return generatePath(path.join('/'), fullParams);
}
// export function createRouteURL(routeName: string, params: RouteURLProps = {}) {
//   const storeRoutes = store.getState().routes.routes;
//   const route = (storeRoutes && storeRoutes[routeName]) || getRoute(routeName);

//   if (!route) {
//     return '';
//   }

//   let cluster: string | null = params.cluster || null;
//   if (!cluster && getRouteUseClusterURL(route)) {
//     cluster = getCluster();
//     if (!cluster) {
//       return '/';
//     }
//   }
//   const fullParams = {
//     ...params,
//   };

//   // Add cluster to the params if it is not already there
//   if (!fullParams.cluster && !!cluster) {
//     fullParams.cluster = cluster;
//   }

//   const url = getRoutePath(route);
//   return generatePath(url, fullParams);
// }

// export function getDefaultRoutes() {
//   return defaultRoutes;
// }
