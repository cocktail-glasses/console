import { get } from 'lodash';
import { ApiReq } from './api';

export const cocktailApi = {
  auth: {
    login: <ApiReq>{ path: '/sso/login', method: 'POST' },
  },
  cluster: {
    conditions: <ApiReq>{ path: '/api/cluster/v2/conditions', method: 'GET' },
  },
  user: {
    list: <ApiReq>{ path: '/api/account/1/users', method: 'GET' },
    detail: <ApiReq>{ path: '/api/account/1/user/', method: 'GET' },
    create: <ApiReq>{ path: '/api/account/1/user', method: 'POST' },
    update: <ApiReq>{ path: '/api/account/1/user/', method: 'PUT' },
    delete: <ApiReq>{ path: '/api/account/1/user/', method: 'DELETE' },
  },
};

export const monitoringAPi = {
  dashboardServicemapCpuTop: <ApiReq>{
    path: '/v4/target/controls-dashboard/metric/control-dashboard-servicemap-cpu-top/result/transition',
    method: 'GET',
  },
};

export const metricApi = {
  clusters: <ApiReq>{ path: '/metric-api/api/v1/clusters', method: 'GET' },
  nodes: <ApiReq>{ path: '/metric-api/api/v1/nodes', method: 'GET' },
  volumes: <ApiReq>{ path: '/metric-api/api/v1/volumes', method: 'GET' },
  storageClasses: <ApiReq>{ path: '/metric-api/api/v1/storageclasses', method: 'GET' },
  podStatus: <ApiReq>{ path: '/metric-api/api/v1/pod/status', method: 'POST' },
  resource: {
    container: <ApiReq>{ path: '/metric-api/api/v1/resource/container', method: 'POST' },
    pod: <ApiReq>{ path: '/metric-api/api/v1/resource/pod', method: 'POST' },
    workload: <ApiReq>{ path: '/metric-api/api/v1/resource/workload', method: 'POST' },
    namespace: <ApiReq>{ path: '/metric-api/api/v1/resource/namespace', method: 'POST' },
  },
};

export function getRequest(api: string, path: string) {
  let req;
  switch (api) {
    case 'cocktail':
      req = get(cocktailApi, path);
      break;
    case 'monitoring':
      req = get(monitoringAPi, path);
      break;
    case 'metric':
      req = get(metricApi, path);
      break;
    default:
      break;
  }
  return req;
}

export const UriPrefix = '/a/:account'