import { apiFactoryWithNamespace } from './apiProxy.ts';
import { KubeObjectInterface, makeKubeObject } from './cluster.ts';

export interface KubeServiceAccount extends KubeObjectInterface {
  secrets: {
    apiVersion: string;
    fieldPath: string;
    kind: string;
    name: string;
    namespace: string;
    uid: string;
  }[];
}

class ServiceAccount extends makeKubeObject<KubeServiceAccount>('serviceAccount') {
  static apiEndpoint = apiFactoryWithNamespace('', 'v1', 'serviceaccounts');

  get secrets(): KubeServiceAccount['secrets'] {
    return this.jsonData!.secrets;
  }
}

export default ServiceAccount;
