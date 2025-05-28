import { isEmpty, keyBy, memoize } from 'lodash';

export interface MenuType {
  id: string;
  label: string;
  icon: string;
  route: string;
  group: string;
  parent?: string;
  isVisible?: boolean;
}

export const Menus: MenuType[] = [
  {
    id: 'home',
    label: 'Home',
    icon: 'mdi:home',
    route: 'home',
    group: 'config',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'mdi:settings',
    route: 'settings',
    group: 'config',
  },
  {
    id: 'users',
    label: 'Users',
    icon: 'mdi:account',
    route: 'users',
    parent: 'settings',
    group: 'config',
  },

  {
    id: 'clusters',
    label: 'Clusters',
    icon: 'mdi:hexagon-multiple-outline',
    route: 'clusters',
    group: 'k8s',
  },
  {
    id: 'cluster',
    label: 'Cluster',
    icon: 'mdi:hexagon-multiple-outline',
    route: 'cluster',
    group: 'k8s',
  },
  {
    id: 'namespaces',
    label: 'Namespaces',
    icon: 'mdi:hexagon-multiple-outline',
    route: 'namespaces',
    parent: 'cluster',
    group: 'k8s',
  },
  {
    id: 'nodes',
    label: 'Nodes',
    icon: 'mdi:hexagon-multiple-outline',
    route: 'nodes',
    parent: 'cluster',
    group: 'k8s',
  },

  {
    id: 'workloads',
    label: 'Workloads',
    icon: 'mdi:circle-slice-2',
    route: 'workloads',
    group: 'k8s',
  },
  {
    id: 'pods',
    label: 'Pods',
    icon: 'mdi:circle-slice-2',
    route: 'pods',
    parent: 'workloads',
    group: 'k8s',
  },
  {
    id: 'deployments',
    label: 'Deployments',
    icon: 'mdi:circle-slice-2',
    route: 'deployments',
    parent: 'workloads',
    group: 'k8s',
  },
  {
    id: 'statefulSets',
    label: 'StatefulSets',
    icon: 'mdi:circle-slice-2',
    route: 'statefulSets',
    parent: 'workloads',
    group: 'k8s',
  },
  {
    id: 'daemonSets',
    label: 'DaemonSets',
    icon: 'mdi:circle-slice-2',
    route: 'daemonSets',
    parent: 'workloads',
    group: 'k8s',
  },
  {
    id: 'replicaSets',
    label: 'ReplicaSets',
    icon: 'mdi:circle-slice-2',
    route: 'replicaSets',
    parent: 'workloads',
    group: 'k8s',
  },
  {
    id: 'jobs',
    label: 'Jobs',
    icon: 'mdi:circle-slice-2',
    route: 'jobs',
    parent: 'workloads',
    group: 'k8s',
  },
  {
    id: 'cronJobs',
    label: 'CronJobs',
    icon: 'mdi:circle-slice-2',
    route: 'cronJobs',
    parent: 'workloads',
    group: 'k8s',
  },

  {
    id: 'storage',
    label: 'Storage',
    icon: 'mdi:database',
    route: 'persistentVolumeClaims',
    group: 'k8s',
  },
  {
    id: 'persistentVolumeClaims',
    label: 'Persistent Volume Claims',
    icon: 'mdi:database',
    route: 'persistentVolumeClaims',
    parent: 'storage',
    group: 'k8s',
  },
  {
    id: 'persistentVolumes',
    label: 'Persistent Volumes',
    icon: 'mdi:database',
    route: 'persistentVolumes',
    parent: 'storage',
    group: 'k8s',
  },
  {
    id: 'storageClasses',
    label: 'Storage Classes',
    icon: 'mdi:database',
    route: 'storageClasses',
    parent: 'storage',
    group: 'k8s',
  },

  {
    id: 'network',
    label: 'Network',
    icon: 'mdi:folder-network-outline',
    route: 'services',
    group: 'k8s',
  },
  {
    id: 'services',
    label: 'Services',
    icon: 'mdi:folder-network-outline',
    route: 'services',
    parent: 'network',
    group: 'k8s',
  },
  {
    id: 'endpoints',
    label: 'Endpoints',
    icon: 'mdi:folder-network-outline',
    route: 'endpoints',
    parent: 'network',
    group: 'k8s',
  },
  {
    id: 'ingresses',
    label: 'Ingresses',
    icon: 'mdi:folder-network-outline',
    route: 'ingresses',
    parent: 'network',
    group: 'k8s',
  },
  {
    id: 'ingressclasses',
    label: 'Ingress Classes',
    icon: 'mdi:folder-network-outline',
    route: 'ingressclasses',
    parent: 'network',
    group: 'k8s',
  },
  {
    id: 'networkPolicies',
    label: 'Network Policies',
    icon: 'mdi:folder-network-outline',
    route: 'networkPolicies',
    parent: 'network',
    group: 'k8s',
  },

  {
    id: 'gateway',
    label: 'Gateway',
    icon: 'mdi:lan-connect',
    route: 'gateways',
    group: 'k8s',
  },

  {
    id: 'gateways',
    label: 'Gateways',
    icon: 'mdi:lan-connect',
    route: 'gateways',
    parent: 'gateway',
    group: 'k8s',
  },

  {
    id: 'gatewayclasses',
    label: 'Gateway Classes',
    icon: 'mdi:lan-connect',
    route: 'gatewayclasses',
    parent: 'gateway',
    group: 'k8s',
  },

  {
    id: 'httproutes',
    label: 'HTTP Routes',
    icon: 'mdi:lan-connect',
    route: 'httproutes',
    parent: 'gateway',
    group: 'k8s',
  },

  {
    id: 'grpcroutes',
    label: 'GRPC Routes',
    icon: 'mdi:lan-connect',
    route: 'grpcroutes',
    parent: 'gateway',
    group: 'k8s',
  },

  {
    id: 'security',
    label: 'Security',
    icon: 'mdi:lock',
    route: 'serviceAccounts',
    group: 'k8s',
  },
  {
    id: 'serviceAccounts',
    label: 'Service Accounts',
    icon: 'mdi:lock',
    route: 'serviceAccounts',
    parent: 'security',
    group: 'k8s',
  },
  {
    id: 'roles',
    label: 'Roles',
    icon: 'mdi:lock',
    route: 'roles',
    parent: 'security',
    group: 'k8s',
  },
  {
    id: 'roleBindings',
    label: 'Role Bindings',
    icon: 'mdi:lock',
    route: 'roleBindings',
    parent: 'security',
    group: 'k8s',
  },

  {
    id: 'config',
    label: 'Configuration',
    icon: 'mdi:format-list-checks',
    route: 'configMaps',
    group: 'k8s',
  },
  {
    id: 'configMaps',
    label: 'Config Maps',
    icon: 'mdi:lock',
    route: 'configMaps',
    parent: 'config',
    group: 'k8s',
  },
  {
    id: 'secrets',
    label: 'Secrets',
    icon: 'mdi:lock',
    route: 'secrets',
    parent: 'config',
    group: 'k8s',
  },
  {
    id: 'horizontalPodAutoscalers',
    label: 'HPAs',
    icon: 'mdi:lock',
    route: 'horizontalPodAutoscalers',
    parent: 'config',
    group: 'k8s',
  },
  {
    id: 'verticalPodAutoscalers',
    label: 'VPAs',
    icon: 'mdi:lock',
    route: 'verticalPodAutoscalers',
    parent: 'config',
    group: 'k8s',
  },
  {
    id: 'podDisruptionBudgets',
    label: 'Pod Disruption Budgets',
    icon: 'mdi:lock',
    route: 'podDisruptionBudgets',
    parent: 'config',
    group: 'k8s',
  },
  {
    id: 'resourceQuotas',
    label: 'Resource Quotas',
    icon: 'mdi:lock',
    route: 'resourceQuotas',
    parent: 'config',
    group: 'k8s',
  },
  {
    id: 'limitRanges',
    label: 'Limit Ranges',
    icon: 'mdi:lock',
    route: 'limitRanges',
    parent: 'config',
    group: 'k8s',
  },
  {
    id: 'priorityClasses',
    label: 'Priority Classes',
    icon: 'mdi:lock',
    route: 'priorityClasses',
    parent: 'config',
    group: 'k8s',
  },
  {
    id: 'runtimeClasses',
    label: 'Runtime Classes',
    icon: 'mdi:lock',
    route: 'runtimeClasses',
    parent: 'config',
    group: 'k8s',
  },
  {
    id: 'leases',
    label: 'Leases',
    icon: 'mdi:lock',
    route: 'leases',
    parent: 'config',
    group: 'k8s',
  },
  {
    id: 'mutatingWebhookConfigurations',
    label: 'Mutating Webhook Configurations',
    icon: 'mdi:lock',
    route: 'mutatingWebhookConfigurations',
    parent: 'config',
    group: 'k8s',
  },
  {
    id: 'validatingWebhookConfigurations',
    label: 'Validating Webhook Configurations',
    icon: 'mdi:lock',
    route: 'validatingWebhookConfigurations',
    parent: 'config',
    group: 'k8s',
  },

  {
    id: 'crds',
    label: 'Custom Resources',
    icon: 'mdi:puzzle',
    route: 'crds',
    group: 'k8s',
  },

  {
    id: 'crs',
    label: 'Instances',
    icon: 'mdi:puzzle',
    route: 'crs',
    parent: 'crds',
    group: 'k8s',
  },

  {
    id: 'maps',
    label: 'Map',
    icon: 'mdi:map',
    route: 'maps',
    group: 'k8s',
  },

  {
    id: 'tenantClusters',
    label: 'Clusters',
    icon: 'mdi:hexagon-multiple-outline',
    route: 'tenantClusters',
    group: 'kaas',
  },

  // flux
  {
    id: 'flux',
    label: 'Flux',
    icon: 'simple-icons:flux',
    route: 'overview',
    group: 'k8s',
    // isVisible: false,
  },
  {
    id: 'overview',
    label: 'Overview',
    icon: 'simple-icons:flux',
    route: 'overview',
    group: 'k8s',
    parent: 'flux',
  },
  {
    id: 'kustomizations',
    label: 'Kustomizations',
    icon: 'simple-icons:flux',
    route: 'kustomizations',
    group: 'k8s',
    parent: 'flux',
  },
  {
    id: 'helmreleases',
    label: 'HelmReleases',
    icon: 'simple-icons:flux',
    route: 'helmreleases',
    group: 'k8s',
    parent: 'flux',
  },
  {
    id: 'sources',
    label: 'Sources',
    icon: 'simple-icons:flux',
    route: 'sources',
    group: 'k8s',
    parent: 'flux',
  },
  {
    id: 'imageAutomations',
    label: 'Image Automations',
    icon: 'simple-icons:flux',
    route: 'imageAutomations',
    group: 'k8s',
    parent: 'flux',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: 'simple-icons:flux',
    route: 'notifications',
    group: 'k8s',
    parent: 'flux',
  },
  {
    id: 'canaries',
    label: 'Canaries',
    icon: 'simple-icons:flux',
    route: 'canaries',
    group: 'k8s',
    parent: 'flux',
  },
  {
    id: 'runtime',
    label: 'Flux Runtime',
    icon: 'simple-icons:flux',
    route: 'runtime',
    group: 'k8s',
    parent: 'flux',
  },
];

export interface GroupType {
  id: string;
  label: string;
  icon: string;
}

export const Groups: GroupType[] = [
  { id: 'config', label: 'Configuration', icon: 'mdi:star' },
  { id: 'k8s', label: 'Kubernetes', icon: 'mdi:kubernetes' },
  // { id: "build", label: "Build", icon: "mdi:connection" },
  { id: 'kaas', label: 'KaaS', icon: 'mdi:kamaji' },
];

export const getMenu = (menus: MenuType[], menuId: string) => {
  if (!hasMenu(menus, menuId)) return null;

  const menuTable = transformer(menus, 'id');

  return menuTable[menuId];
};

export const hasMenu = (menus: MenuType[], menuId: string) => hasKeyInArray(menus, menuId);
export const hasGroup = (groups: GroupType[], groupId: string) => hasKeyInArray(groups, groupId);

const transformer = memoize(keyBy);
const hasKeyInArray = <T extends MenuType | GroupType>(arr: T[], key: string): boolean => {
  if (isEmpty(key)) return false;

  const table = transformer(arr, 'id');

  return !!table[key];
};
