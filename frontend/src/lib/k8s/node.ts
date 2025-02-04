import { useState } from 'react';

import { useConnectApi } from './index.ts';
import { useErrorState } from '../util.ts';
import { ApiError, apiFactory, metrics } from './apiProxy.ts';
import { KubeCondition, KubeMetrics, KubeObjectInterface, makeKubeObject } from './cluster.ts';

export interface KubeNode extends KubeObjectInterface {
  status: {
    addresses: {
      address: string;
      type: string;
    }[];
    allocatable: {
      cpu: any;
      memory: any;
      ephemeralStorage: any;
      hugepages_1Gi: any;
      hugepages_2Mi: any;
      pods: any;
    };
    capacity: {
      cpu: any;
      memory: any;
      ephemeralStorage: any;
      hugepages_1Gi: any;
      hugepages_2Mi: any;
      pods: any;
    };
    conditions: (Omit<KubeCondition, 'lastProbeTime' | 'lastUpdateTime'> & {
      lastHeartbeatTime: string;
    })[];
    nodeInfo: {
      architecture: string;
      bootID: string;
      containerRuntimeVersion: string;
      kernelVersion: string;
      kubeProxyVersion: string;
      kubeletVersion: string;
      machineID: string;
      operatingSystem: string;
      osImage: string;
      systemUUID: string;
    };
  };
  spec: {
    podCIDR: string;
    taints: {
      key: string;
      effect: string;
    }[];
    [otherProps: string]: any;
  };
}

class Node extends makeKubeObject<KubeNode>('node') {
  static apiEndpoint = apiFactory('', 'v1', 'nodes');

  get status(): KubeNode['status'] {
    return this.jsonData!.status;
  }

  get spec(): KubeNode['spec'] {
    return this.jsonData!.spec;
  }

  static useMetrics(): [KubeMetrics[] | null, ApiError | null] {
    const [nodeMetrics, setNodeMetrics] = useState<KubeMetrics[] | null>(null);
    const [error, setError] = useErrorState(setNodeMetrics);

    function setMetrics(metrics: KubeMetrics[]) {
      setNodeMetrics(metrics);

      if (metrics !== null) {
        setError(null);
      }
    }

    useConnectApi(metrics.bind(null, '/apis/metrics.k8s.io/v1beta1/nodes', setMetrics, setError));

    return [nodeMetrics, error];
  }

  getExternalIP(): string {
    return this.status.addresses.find((address) => address.type === 'ExternalIP')?.address || '';
  }

  getInternalIP(): string {
    return this.status.addresses.find((address) => address.type === 'InternalIP')?.address || '';
  }
}

export default Node;
