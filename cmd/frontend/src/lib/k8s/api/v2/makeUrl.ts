import { mainClusterKey } from '@lib/stores/cluster';

/**
 * Formats URL path
 *
 * @example
 * ```ts
 * makeUrl(["my", "path", 5], { name: "hello" })
 * // returns "/my/path/5?name=hello"
 * ```
 *
 * @param urlParts - parts of the path, will be separated by /
 * @param query - query parameters object
 *
 * @returns Formatted URL path
 */
export function makeUrl(urlParts: any[] | string, query: Record<string, any> = {}) {
  const url =
    typeof urlParts === 'string'
      ? urlParts
      : urlParts
          .map((it) => (typeof it === 'string' ? it : String(it)))
          .filter(Boolean)
          .join('/');
  const queryString = new URLSearchParams(query).toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;

  // replace multiple slashes with a single one
  // unless it is part of the protocol
  return fullUrl
    .replace(/clusters\/([^\/]+)(\/.*)?/, (_, cluster, rest = '') => {
      return cluster === mainClusterKey
        ? rest
        : `apis/gateway.open-cluster-management.io/v1alpha1/clustergateways/${cluster}/proxy${rest}`;
    })
    .replace(/([^:]\/)\/+/g, '$1');
}
