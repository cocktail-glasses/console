import { makeKubeObject } from './KubeObject';
import { KubeRoleBinding } from './roleBinding';

class ClusterRoleBinding extends makeKubeObject<KubeRoleBinding>() {
  static kind = 'ClusterRoleBinding';
  static apiName = 'clusterrolebindings';
  static apiVersion = 'rbac.authorization.k8s.io/v1';
  static isNamespaced = false;

  get roleRef() {
    return this.jsonData!.roleRef;
  }

  get subjects(): KubeRoleBinding['subjects'] {
    return this.jsonData!.subjects;
  }
}

export default ClusterRoleBinding;
