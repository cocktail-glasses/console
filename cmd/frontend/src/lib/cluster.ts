import { matchPath } from 'react-router-dom';

import { Auth } from './auth';

import helpers from '@helpers';

// import { CLUSTERS_PREFIX } from './k8s/apiProxy';

/**
 * @returns A path prefixed with cluster path, and the given path.
 *
 * The given path does not start with a /, it will be added.
 */
export function getClusterPrefixedPath(path?: string | null) {
  const baseClusterPath = '/clusters/:cluster';
  if (!path) {
    return baseClusterPath;
  }
  return baseClusterPath + (path[0] === '/' ? '' : '/') + path;
}

/**
 * @returns The current cluster name, or null if not in a cluster context.
 */
export function getCluster(url?: string): string | null {
  const urlPath = url || window.location.pathname;
  const clusterURLMatch = matchPath(
    {
      path: getClusterPrefixedPath(),
      caseSensitive: false,
      end: false,
    },
    urlPath
  );
  return (!!clusterURLMatch && clusterURLMatch.params.cluster) || null;
}

/** Returns cluster URL parameter from the current path or the given path */
export function getClusterPathParam(maybeUrlPath?: string): string | undefined {
  const prefix = helpers.getBaseUrl();
  const urlPath = maybeUrlPath ?? window.location.pathname.slice(prefix.length);

  const clusterURLMatch = matchPath(
    {
      path: getClusterPrefixedPath(),
      caseSensitive: false,
      end: false,
    },
    urlPath
  );

  return clusterURLMatch?.params?.cluster;
}

export function getClustersPrefix() {
  console.log('getClustersPrefix()', Auth.getInstance().getAccountSeq);
  // const urlPath = window.location.pathname;
  // const clusterURLMatch = matchPath(
  //   {
  //     path: 'a/:account',
  //     caseSensitive: false,
  //     end: false,
  //   },
  //   urlPath,
  // );
  // console.log('clusterURLMatch', clusterURLMatch)
  // const { account, cluster } = clusterURLMatch.params;
  // console.log('1')
  // if (!clusterURLMatch?.params.cluster) {
  //   console.log('2', clusterURLMatch?.params.cluster)
  //   return `/${CLUSTERS_PREFIX}/${clusterURLMatch?.params.cluster}`
  // }
  // console.log('3', account)
  // return `/${Auth.getInstance().getAccountSeq}`;
  return '/';
}

/**
 * Get list of selected clusters.
 *
 * @param returnWhenNoClusters return this value when no clusters are found.
 * @param urlPath optional, path string containing cluster parameters.
 * @returns the cluster group from the URL.
 */
export function getSelectedClusters(returnWhenNoClusters: string[] = [], urlPath?: string): string[] {
  const clusterFromURL = getClusterPathParam(urlPath);
  return clusterFromURL?.split('+') || returnWhenNoClusters;
}
