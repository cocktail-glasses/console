import { apiFactoryWithNamespace } from './apiProxy.ts';
import {
  KubeContainer,
  KubeMetadata,
  KubeObjectInterface,
  LabelSelector,
  makeKubeObject,
} from './cluster.ts';
import { KubePodSpec } from './pod.ts';

export interface KubeDeployment extends KubeObjectInterface {
  spec: {
    selector?: LabelSelector;
    strategy?: {
      type: string;
      [otherProps: string]: any;
    };
    template: {
      metadata?: KubeMetadata;
      spec: KubePodSpec;
    };
    [otherProps: string]: any;
  };
  status: {
    [otherProps: string]: any;
  };
}

class Deployment extends makeKubeObject<KubeDeployment>('Deployment') {
  static apiEndpoint = apiFactoryWithNamespace('apps', 'v1', 'deployments', true);

  get spec() {
    return this.getValue('spec');
  }

  get status() {
    return this.getValue('status');
  }

  getContainers(): KubeContainer[] {
    return this.spec?.template?.spec?.containers || [];
  }

  getMatchLabelsList(): string[] {
    const labels = this.spec.selector.matchLabels || {};
    return Object.keys(labels).map(key => `${key}=${labels[key]}`);
  }
}

export default Deployment;
