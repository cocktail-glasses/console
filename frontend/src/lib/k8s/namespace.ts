import { apiFactory } from './apiProxy.ts';
import { KubeObjectInterface, makeKubeObject } from './cluster.ts';

export interface KubeNamespace extends KubeObjectInterface {
  status: {
    phase: string;
  };
}

class Namespace extends makeKubeObject<KubeNamespace>('namespace') {
  static apiEndpoint = apiFactory('', 'v1', 'namespaces');

  get status() {
    return this.jsonData!.status;
  }
}

export default Namespace;
