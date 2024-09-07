import { apiFactoryWithNamespace } from './apiProxy.ts';
import { KubeObjectInterface, makeKubeObject, StringDict } from './cluster.ts';

export interface KubeConfigMap extends KubeObjectInterface {
  data: StringDict;
}

class ConfigMap extends makeKubeObject<KubeConfigMap>('configMap') {
  static apiEndpoint = apiFactoryWithNamespace('', 'v1', 'configmaps');

  get data() {
    return this.jsonData?.data;
  }
}

export default ConfigMap;
