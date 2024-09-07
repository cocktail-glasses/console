import { useTranslation } from 'react-i18next';

import ResourceListView from '@components/common/Resource/ResourceListView.tsx';
import ServiceAccount from '@lib/k8s/serviceAccount.ts';

export default function ServiceAccountList() {
  const { t } = useTranslation('glossary');

  return (
    <ResourceListView
      title={t('Service Accounts')}
      resourceClass={ServiceAccount}
      columns={[
        'name',
        'namespace',
        {
          id: 'secrets',
          label: t('Secrets'),
          getValue: (serviceaccount: ServiceAccount) => serviceaccount?.secrets?.length || 0,
          gridTemplate: 0.5,
        },
        'age',
      ]}
    />
  );
}
