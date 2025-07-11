import { useTranslation } from 'react-i18next';

import { HoverInfoLabel } from '@components/common';
import ResourceListView from '@components/common/Resource/ResourceListView';
import IngressClass from '@lib/k8s/ingressClass';

export default function IngressClassList() {
  const { t } = useTranslation('glossary');

  return (
    <ResourceListView
      title={t('Ingress Classes')}
      headerProps={{
        noNamespaceFilter: true,
      }}
      resourceClass={IngressClass}
      columns={[
        // {
        //   id: 'default',
        //   label: '',
        //   gridTemplate: 0.1,
        //   getValue: (resource) => (resource?.isDefault ? t('Default Ingress Class') : null),
        //   render: (resource: IngressClass) => (resource && resource.isDefault ? <DefaultLabel /> : null),
        //   sort: false,
        //   disableFiltering: true,
        // },
        'name',
        {
          id: 'controller',
          label: t('Controller'),
          getValue: (ingressClass: IngressClass) => ingressClass.spec?.controller,
        },
        'age',
      ]}
    />
  );
}

export function DefaultLabel() {
  const { t } = useTranslation('glossary');
  return <HoverInfoLabel label="" hoverInfo={t('Default Ingress Class')} icon="mdi:star" />;
}
