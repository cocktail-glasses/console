import { apiFactoryWithNamespace } from './apiProxy.ts';
import { KubeObjectInterface, makeKubeObject, StringDict } from './cluster.ts';

export interface KubeSecret extends KubeObjectInterface {
  data: StringDict;
  type: string;
}

class Secret extends makeKubeObject<KubeSecret>('secret') {
  static apiEndpoint = apiFactoryWithNamespace('', 'v1', 'secrets');

  get data() {
    return this.jsonData!.data;
  }

  get type() {
    return this.jsonData!.type;
  }
}

export default Secret;
