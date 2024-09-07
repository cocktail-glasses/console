import { useEffect, useRef, useState } from 'react';
import { matchPath, useLocation } from 'react-router-dom';

import { cloneDeep, isEqual } from 'lodash';

import { ConfigState } from 'redux/configSlice.ts';
import { useTypedSelector } from 'redux/reducers/reducers.tsx';
import { getCluster, getClusterPrefixedPath } from '../util.ts';
import { ApiError, clusterRequest } from './apiProxy.ts';
import { Cluster, KubeObject, LabelSelector, StringDict } from './cluster.ts';
import ClusterRole from './clusterRole.ts';
import ClusterRoleBinding from './clusterRoleBinding.ts';
import ConfigMap from './configMap.ts';
import CustomResourceDefinition from './crd.ts';
import CronJob from './cronJob.ts';
import DaemonSet from './daemonSet.ts';
import Deployment from './deployment.ts';
import Endpoints from './endpoints.ts';
import HPA from './hpa.ts';
import Ingress from './ingress.ts';
import IngressClass from './ingressClass.ts';
import Job from './job.ts';
import { Lease } from './lease.ts';
import { LimitRange } from './limitRange.tsx';
import Namespace from './namespace.ts';
import NetworkPolicy from './networkpolicy.tsx';
import Node from './node.ts';
import PersistentVolume from './persistentVolume.ts';
import PersistentVolumeClaim from './persistentVolumeClaim.ts';
import Pod from './pod.ts';
import PodDisruptionBudget from './podDisruptionBudget.ts';
import PriorityClass from './priorityClass.ts';
import ReplicaSet from './replicaSet.ts';
import ResourceQuota from './resourceQuota.ts';
import Role from './role.ts';
import RoleBinding from './roleBinding.ts';
import { RuntimeClass } from './runtime.ts';
import Secret from './secret.ts';
import Service from './service.ts';
import ServiceAccount from './serviceAccount.ts';
import StatefulSet from './statefulSet.ts';
import StorageClass from './storageClass.ts';

const classList = [
  ClusterRole,
  ClusterRoleBinding,
  ConfigMap,
  CustomResourceDefinition,
  CronJob,
  DaemonSet,
  Deployment,
  Endpoints,
  LimitRange,
  Lease,
  ResourceQuota,
  HPA,
  PodDisruptionBudget,
  PriorityClass,
  Ingress,
  IngressClass,
  Job,
  Namespace,
  NetworkPolicy,
  Node,
  PersistentVolume,
  PersistentVolumeClaim,
  Pod,
  ReplicaSet,
  Role,
  RoleBinding,
  RuntimeClass,
  Secret,
  Service,
  ServiceAccount,
  StatefulSet,
  StorageClass,
];

const resourceClassesDict: {
  [className: string]: KubeObject;
} = {};

classList.forEach((cls) => {
  // Ideally this should just be the class name, but until we ensure the class name is consistent
  // (in what comes to the capitalization), we use this lazy approach.
  const className: string = cls.className.charAt(0).toUpperCase() + cls.className.slice(1);
  resourceClassesDict[className] = cls;
});

export const ResourceClasses = resourceClassesDict;

/** Hook for getting or fetching the clusters configuration.
 * This gets the clusters from the redux store. The redux store is updated
 * when the user changes the configuration. The configuration is stored in
 * the local storage. When stateless clusters are present, it combines the
 * stateless clusters with the clusters from the redux store.
 * @returns the clusters configuration.
 * */
export function useClustersConf(): ConfigState['allClusters'] {
  const state = useTypedSelector((state) => state.config);
  const clusters = cloneDeep(state.clusters || {});
  const allClusters = cloneDeep(state.allClusters || {});
  Object.assign(allClusters, clusters);

  if (state.statelessClusters) {
    // Combine statelessClusters with clusters
    const statelessClusters = cloneDeep(state.statelessClusters || {});
    Object.assign(allClusters, statelessClusters);
  }

  return allClusters;
}

export function useCluster() {
  // Make sure we update when changing clusters.
  // @todo: We need a better way to do this.
  const location = useLocation();

  // This function is similar to the getCluster() but uses the location
  // meaning it will return the URL from whatever the router used it (which
  // is more accurate than getting it from window.location like the former).
  function getClusterFromLocation(): string | null {
    const urlPath = location?.pathname;
    const clusterURLMatch = matchPath(
      {
        path: getClusterPrefixedPath(),
      },
      urlPath
    );
    return (!!clusterURLMatch && clusterURLMatch.params.cluster) || null;
  }

  const [cluster, setCluster] = useState<string | null>(getClusterFromLocation());

  useEffect(() => {
    const currentCluster = getClusterFromLocation();
    if (cluster !== currentCluster) {
      setCluster(currentCluster);
    }
  }, [cluster, location]);

  return cluster;
}

export function getVersion(clusterName: string = ''): Promise<StringDict> {
  return clusterRequest('/version', { cluster: clusterName || getCluster() });
}

export type CancellablePromise = Promise<() => void>;

export function useConnectApi(...apiCalls: (() => CancellablePromise)[]) {
  // Use the location to make sure the API calls are changed, as they may depend on the cluster
  // (defined in the URL ATM).
  const cluster = useCluster();

  useEffect(
    () => {
      const cancellables = apiCalls.map((func) => func());

      return function cleanup() {
        for (const cancellablePromise of cancellables) {
          cancellablePromise.then((cancellable) => cancellable());
        }
      };
    },
    // If we add the apiCalls to the dependency list, then it actually
    // results in undesired reloads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cluster]
  );
}

/**
 * See {@link https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#list-and-watch-filtering|Label selector examples},
 * {@link https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#resources-that-support-set-based-requirements|deployment selector example},
 * {@link https://github.com/kubernetes/apimachinery/blob/be3a79b26814a8d7637d70f4d434a4626ee1c1e7/pkg/selection/operator.go#L24|possible operators}, and
 * {@link https://github.com/kubernetes/apimachinery/blob/be3a79b26814a8d7637d70f4d434a4626ee1c1e7/pkg/labels/selector.go#L305|Format rule for expressions}.
 */
export function labelSelectorToQuery(labelSelector: LabelSelector) {
  const segments: string[] = [];

  segments.push(...(matchLabelsSimplifier(labelSelector.matchLabels, true) || []));

  const matchExpressions = labelSelector.matchExpressions ?? [];

  segments.push(...matchExpressionSimplifier(matchExpressions));
  if (segments.length === 0) {
    return '';
  }

  return segments.join(',');
}

export function matchLabelsSimplifier(
  matchLabels: LabelSelector['matchLabels'],
  isEqualSeperator = false
): string[] | '' {
  if (!matchLabels) {
    return '';
  }

  const segments: string[] = [];
  for (const k in matchLabels) {
    if (isEqualSeperator) {
      segments.push(`${k}=${matchLabels[k]}`);
      continue;
    }
    segments.push(`${k}: ${matchLabels[k]}`);
  }

  return segments;
}

export function matchExpressionSimplifier(matchExpressions: LabelSelector['matchExpressions']): string[] | '' {
  if (!matchExpressions) {
    return '';
  }

  const segments: string[] = [];
  for (const expr of matchExpressions) {
    let segment = '';
    if (expr.operator === 'DoesNotExist') {
      segment += '!';
    }

    let needsParensWrap = false;
    const NoLengthLimits = -1;
    let expectedValuesLength = NoLengthLimits;

    segment += expr.key;
    switch (expr.operator) {
      case 'Equals':
        segment += '=';
        expectedValuesLength = 1;
        break;
      case 'DoubleEquals':
        segment += '==';
        expectedValuesLength = 1;
        break;
      case 'NotEquals':
        segment += '!=';
        expectedValuesLength = 1;
        break;
      case 'In':
        segment += ' in ';
        needsParensWrap = true;
        break;
      case 'NotIn':
        segment += ' notin ';
        needsParensWrap = true;
        break;
      case 'GreaterThan':
        segment += '>';
        expectedValuesLength = 1;
        break;
      case 'LessThan':
        segment += '<';
        expectedValuesLength = 1;
        break;
      case 'Exists':
      case 'DoesNotExist':
        expectedValuesLength = 0;
        break;
    }

    let values = '';

    if (expectedValuesLength === 1) {
      values = expr.values[0] ?? '';
    } else if (expectedValuesLength === NoLengthLimits) {
      values = [...(expr.values ?? [])].sort().join(',');
      if (needsParensWrap) {
        values = '(' + values + ')';
      }
    }

    segment += values;
    segments.push(segment);
  }

  return segments;
}

/** Hook to get the version of the clusters given by the parameter.
 *
 * @param clusters
 * @returns a map with cluster -> version-info, and a map with cluster -> error.
 */
export function useClustersVersion(clusters: Cluster[]) {
  const [clusterNames, setClusterNames] = useState<string[]>(Object.values(clusters).map((c) => c.name));
  const [versions, setVersions] = useState<{ [cluster: string]: StringDict }>({});
  const [errors, setErrors] = useState<{ [cluster: string]: ApiError | null }>({});
  const versionFetchInterval = 10000; // ms
  const cancelledRef = useRef(false);
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    const newClusterNames = Object.values(clusters).map((c) => c.name);
    if (isEqual(newClusterNames, clusterNames)) {
      return;
    }

    setClusterNames(newClusterNames);
    lastUpdateRef.current = Date.now();
  }, [clusters, clusterNames]);

  useEffect(() => {
    const newVersions: typeof versions = {};
    const newErrors: typeof errors = {};

    function updateValues() {
      if (cancelledRef.current) {
        return;
      }

      setVersions((currentVersions) => {
        const newVersionsToSet = { ...currentVersions };
        Object.keys(newErrors).forEach((clusterName) => {
          if (!!newErrors[clusterName]) {
            delete newVersionsToSet[clusterName];
          }
        });
        return { ...newVersionsToSet, ...newVersions };
      });
      setErrors((currentErrors) => {
        const newErrorsToSet = { ...currentErrors };
        Object.keys(newVersions).forEach((clusterName) => {
          newErrorsToSet[clusterName] = null;
        });
        return { ...newErrorsToSet, ...newErrors };
      });
    }

    clusterNames.forEach((clusterName) => {
      getVersion(clusterName)
        .then((version) => {
          newVersions[clusterName] = version;
        })
        .catch((err) => {
          newErrors[clusterName] = err;
        })
        .finally(() => {
          updateValues();
        });
    });
  }, [clusterNames]);

  useEffect(() => {
    cancelledRef.current = false;
    // Trigger periodically
    const timeout = setInterval(() => {
      if (cancelledRef.current) {
        return;
      }

      if (Date.now() - lastUpdateRef.current > versionFetchInterval - 1) {
        setClusterNames(clusterNames);
      }
    }, versionFetchInterval);

    return function cleanup() {
      cancelledRef.current = true;
      clearInterval(timeout);
    };
  }, []);

  return [versions, errors] as const;
}

// Other exports that can be used by plugins:
export * as cluster from './cluster.ts';
export * as clusterRole from './clusterRole.ts';
export * as clusterRoleBinding from './clusterRoleBinding.ts';
export * as configMap from './configMap.ts';
export * as crd from './crd.ts';
export * as cronJob from './cronJob.ts';
export * as daemonSet from './daemonSet.ts';
export * as deployment from './deployment.ts';
export * as event from './event.ts';
export * as ingress from './ingress.ts';
export * as ingressClass from './ingressClass.ts';
export * as job from './job.ts';
export * as namespace from './namespace.ts';
export * as node from './node.ts';
export * as persistentVolume from './persistentVolume.ts';
export * as persistentVolumeClaim from './persistentVolumeClaim.ts';
export * as pod from './pod.ts';
export * as replicaSet from './replicaSet.ts';
export * as role from './role.ts';
export * as roleBinding from './roleBinding.ts';
export * as secret from './secret.ts';
export * as service from './service.ts';
export * as serviceAccount from './serviceAccount.ts';
export * as statefulSet from './statefulSet.ts';
export * as storageClass from './storageClass.ts';
