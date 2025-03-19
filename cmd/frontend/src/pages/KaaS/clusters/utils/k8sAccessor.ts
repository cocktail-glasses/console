import { filter, has, join, map, reduce, size } from 'lodash';

import { KubeObjectInterface } from '@lib/k8s/cluster';
import { KubeConfigMap } from '@lib/k8s/configMap';
import { KubeDeployment } from '@lib/k8s/deployment';
import { KubePod } from '@lib/k8s/pod';
import { KubeSecret } from '@lib/k8s/secret';
import { KubeService } from '@lib/k8s/service';
import { fromNow } from '@utils/date';

export const age = (obj: KubeObjectInterface) => fromNow(obj.metadata.creationTimestamp);

export const podReady = (pod: KubePod) => {
  const containerStatus = pod.status.containerStatuses;
  const containerReady = filter(containerStatus, 'ready');
  return `${size(containerReady)} / ${size(containerStatus)}`;
};

export const podRestart = (pod: KubePod) => {
  const containerStatus = pod.status.containerStatuses;
  const restarts = reduce(containerStatus, (acc, cs) => acc + cs.restartCount, 0);
  const lastState = containerStatus
    .filter((cs) => has(cs, 'lastState.terminated.finishedAt'))
    .map((cs) => new Date(cs.lastState?.terminated?.finishedAt || new Date()))
    .sort()
    .reverse()[0];

  return `${restarts} ${lastState && `(${fromNow(lastState)})`}`;
};

export const deploymentReady = (deploy: KubeDeployment) => {
  const replicas = deploy.spec?.replicas || '-';
  const availabe = deploy.status?.availableReplicas || 0;

  return `${availabe} / ${replicas}`;
};

export const serviceExternalIP = (svc: KubeService) => {
  const ingress = 'status.loadBalancer.ingress';
  return has(svc, ingress) ? join(map(svc[ingress], 'ip'), ',') : '<NONE>';
};

export const servicePorts = (svc: KubeService) =>
  join(
    map(svc.spec.ports, (port) => `${port.port}/${port.protocol}`),
    ','
  );

export const secretDataSize = (secret: KubeSecret) => size(secret.data);

export const configmapDataSize = (cm: KubeConfigMap) => size(cm.data);
