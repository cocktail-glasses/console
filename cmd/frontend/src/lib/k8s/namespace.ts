import { KubeCondition } from './cluster';
import { KubeObject, KubeObjectInterface } from './KubeObject';

export interface KubeNamespace extends KubeObjectInterface {
  status: {
    phase: string;
    conditions?: KubeCondition[];
  };
}

class Namespace extends KubeObject<KubeNamespace> {
  static kind = 'Namespace';
  static apiName = 'namespaces';
  static apiVersion = 'v1';
  static isNamespaced = false;

  get status() {
    return this.jsonData.status;
  }

  /**
   * This function validates the custom namespace input matches the crieria for DNS-1123 label names.
   * @returns true if the namespace is valid, false otherwise.
   * @params namespace: string
   * @see https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-label-names
   */
  static isValidNamespaceFormat(namespace: string) {
    // Validates that the namespace is under 64 characters.
    if (namespace.length > 63) {
      return false;
    }

    // Validates that the namespace contains only lowercase alphanumeric characters or '-',
    const regex = new RegExp('^[a-z0-9]([-a-z0-9]*[a-z0-9])?$');

    return regex.test(namespace);
  }
}

export default Namespace;
