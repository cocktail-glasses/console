import { makeKubeObject } from './KubeObject';
import { KubeRole } from './role';

class ClusterRole extends makeKubeObject<KubeRole>() {
  static kind = 'ClusterRole';
  static apiName = 'clusterroles';
  static apiVersion = 'rbac.authorization.k8s.io/v1';
  static isNamespaced = false;

  get rules() {
    return this.jsonData!.rules;
  }
}

export default ClusterRole;
