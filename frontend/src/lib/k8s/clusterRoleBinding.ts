import { apiFactory } from './apiProxy.ts';
import RoleBinding from './roleBinding.ts';

class ClusterRoleBinding extends RoleBinding {
  static apiEndpoint = apiFactory('rbac.authorization.k8s.io', 'v1', 'clusterrolebindings');

  static get className(): string {
    return 'ClusterRoleBinding';
  }

  get detailsRoute() {
    return 'clusterRoleBinding';
  }
}

export default ClusterRoleBinding;
