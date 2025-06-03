import { get } from 'lodash';
import cond from 'lodash/cond';
import constant from 'lodash/constant';
import curry from 'lodash/curry';
import eq from 'lodash/eq';
import stubTrue from 'lodash/stubTrue';
import toLower from 'lodash/toLower';

import { Status as DotStatus } from '@components/atoms/KaaS/DotStatus/DotStatus';
import { KubeSecret } from '@lib/k8s/secret';
import { IoClastixKamajiV1alpha1TenantControlPlane } from '@lib/kamaji';
import yaml from 'js-yaml';

export const getDotStatus = (status?: string): DotStatus => {
  const equal = curry(eq);

  return cond([
    [equal('loading'), constant('warning')],
    [equal('ready'), constant('success')],
    [equal('error'), constant('error')],
    [stubTrue, constant('default')],
  ])(toLower(status)) as DotStatus;
};

export const k8sJsonToYaml = (obj: any) => yaml.dump(get(obj, 'jsonData', obj));

export const downloadKubeconfig = async (tcp: IoClastixKamajiV1alpha1TenantControlPlane) => {
  try {
    const name = tcp.status?.kubeconfig?.admin?.secretName;
    const namespace = tcp.metadata?.namespace;

    const res = await fetch(`/k8s/api/v1/namespaces/${namespace}/secrets/${name}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      throw `fetch failed code: ${res.status}`;
    }

    const secret: KubeSecret = await res.json();
    const kubeconfig = atob(secret.data['admin.conf']);

    const blob = new Blob([kubeconfig], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name || '';
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error('error : ', e);
  }
};
