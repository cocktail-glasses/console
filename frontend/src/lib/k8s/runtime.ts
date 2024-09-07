import { apiFactory } from './apiProxy.ts';
import { KubeObjectInterface, makeKubeObject } from './cluster.ts';

export interface KubeRuntimeClass extends KubeObjectInterface {
  handler: string;
}

export class RuntimeClass extends makeKubeObject<KubeRuntimeClass>('RuntimeClass') {
  static apiEndpoint = apiFactory('node.k8s.io', 'v1', 'runtimeclasses');

  get spec() {
    return this.jsonData!.spec;
  }

  static get pluralName() {
    return 'runtimeclasses';
  }

  static get listRoute() {
    return this.pluralName;
  }
}
