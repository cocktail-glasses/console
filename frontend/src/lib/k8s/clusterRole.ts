import { apiFactory } from './apiProxy.ts';
import Role from './role.ts';

class ClusterRole extends Role {
  static apiEndpoint = apiFactory('rbac.authorization.k8s.io', 'v1', 'clusterroles');

  static get className() {
    return 'ClusterRole';
  }

  get detailsRoute() {
    return 'clusterRole';
  }
}

export default ClusterRole;
