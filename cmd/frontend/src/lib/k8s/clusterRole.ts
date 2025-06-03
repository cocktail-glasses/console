import { KubeObject } from './KubeObject';
import { KubeRole } from './role';

const makeKubeObject = () => {
  class KubeObjectInternal extends KubeObject<KubeRole> {}
  return KubeObjectInternal;
};

class ClusterRole extends makeKubeObject() {
  static kind = 'ClusterRole';
  static apiName = 'clusterroles';
  static apiVersion = 'rbac.authorization.k8s.io/v1';
  static isNamespaced = false;

  get rules() {
    return this.jsonData!.rules;
  }
}

export default ClusterRole;
