import { apiFactory } from './apiProxy.ts';
import { KubeObjectInterface, LabelSelector, makeKubeObject } from './cluster.ts';
import { KubeRuleWithOperations, KubeWebhookClientConfig } from './mutatingWebhookConfiguration.ts';

export interface KubeValidatingWebhookConfiguration extends KubeObjectInterface {
  webhooks: {
    admissionReviewVersions: string[];
    clientConfig: KubeWebhookClientConfig;
    failurePolicy?: string;
    matchPolicy?: string;
    name: string;
    namespaceSelector?: {
      matchExpressions: LabelSelector['matchExpressions'];
      matchLabels: LabelSelector['matchLabels'];
    };
    objectSelector?: {
      matchExpressions: LabelSelector['matchExpressions'];
      matchLabels: LabelSelector['matchLabels'];
    };
    rules?: KubeRuleWithOperations[];
    sideEffects?: string;
    timeoutSeconds?: number;
  }[];
}

class ValidatingWebhookConfiguration extends makeKubeObject<KubeValidatingWebhookConfiguration>(
  'ValidatingWebhookConfiguration'
) {
  static apiEndpoint = apiFactory(
    'admissionregistration.k8s.io',
    'v1',
    'validatingwebhookconfigurations'
  );

  get webhooks(): KubeValidatingWebhookConfiguration['webhooks'] {
    return this.jsonData!.webhooks;
  }
}

export default ValidatingWebhookConfiguration;
