import { useTranslation } from 'react-i18next';

import { makeGatewayStatusLabel } from './ClassList';

import Link from '@components/common/Link';
import ResourceListView from '@components/common/Resource/ResourceListView';
import Gateway from '@lib/k8s/gateway';

export default function GatewayList() {
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <ResourceListView
      title={t('Gateways')}
      resourceClass={Gateway}
      columns={[
        'name',
        'namespace',
        {
          id: 'class',
          label: t('Class Name'),
          getValue: (gateway) => gateway.spec?.gatewayClassName,
          render: (gateway) =>
            gateway.spec?.gatewayClassName ? (
              <Link routeName="gatewayclass" params={{ name: gateway.spec?.gatewayClassName }}>
                {gateway.spec?.gatewayClassName}
              </Link>
            ) : null,
        },
        {
          id: 'conditions',
          label: t('translation|Conditions'),
          getValue: (gateway: Gateway) =>
            gateway.status?.conditions?.find(({ status }: { status: string }) => status === 'True')?.type || null,
          render: (gateway: Gateway) => makeGatewayStatusLabel(gateway.status?.conditions || null),
        },
        {
          id: 'listeners',
          label: t('translation|Listeners'),
          getValue: (gateway: Gateway) => gateway.spec.listeners.length,
        },
        'age',
      ]}
    />
  );
}
