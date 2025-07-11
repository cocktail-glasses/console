import { useTranslation } from 'react-i18next';

import ResourceListView from '@components/common/Resource/ResourceListView';
import StorageClass from '@lib/k8s/storageClass';

export default function ClassList() {
  const { t } = useTranslation('glossary');

  return (
    <ResourceListView
      title={t('Storage Classes')}
      headerProps={{
        noNamespaceFilter: true,
      }}
      resourceClass={StorageClass}
      columns={[
        'name',
        {
          id: 'provisioner',
          label: t('Provisioner'),
          getValue: (storageClass) => storageClass.provisioner,
        },
        {
          id: 'reclaimPolicy',
          label: t('Reclaim Policy'),
          getValue: (storageClass) => storageClass.reclaimPolicy,
        },
        {
          id: 'volumeBindingMode',
          label: t('Volume Binding Mode'),
          getValue: (storageClass) => storageClass.volumeBindingMode,
        },
        {
          id: 'allowVolumeExpansion',
          label: t('Allow Volume Expansion'),
          getValue: (storageClass) => storageClass.allowVolumeExpansion,
        },
        'age',
      ]}
    />
  );
}
