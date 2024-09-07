import { useTranslation } from 'react-i18next';

import ResourceListView from '@components/common/Resource/ResourceListView.tsx';
import { Lease } from '@lib/k8s/lease.ts';

export default function LeaseList() {
  const { t } = useTranslation(['glossary', 'translation']);
  return (
    <ResourceListView
      title={t('glossary|Lease')}
      resourceClass={Lease}
      columns={[
        'name',
        'namespace',
        {
          id: 'holder',
          label: t('translation|Holder'),
          getValue: (item) => item?.spec.holderIdentity,
        },
        'age',
      ]}
    />
  );
}
