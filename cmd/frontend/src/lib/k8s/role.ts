import { KubeObject, KubeObjectInterface } from './KubeObject';

export interface KubeRole extends KubeObjectInterface {
  rules: {
    apiGroups: string[];
    nonResourceURLs: string[];
    resourceNames: string[];
    resources: string[];
    verbs: string[];
  }[];
}

class Role extends KubeObject<KubeRole> {
  static kind = 'Role';
  static apiName = 'roles';
  static apiVersion = 'rbac.authorization.k8s.io/v1';
  static isNamespaced = true;

  get rules() {
    return this.jsonData.rules;
  }
}

export default Role;
