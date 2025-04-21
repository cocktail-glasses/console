import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { DetailsGrid } from '@components/common/Resource';
import StorageClass from '@lib/k8s/storageClass';

export default function StorageClassDetails(props: { name?: string }) {
  const params = useParams<{ name: string }>();
  const { name = params.name } = props;
  const { t } = useTranslation('glossary');

  return (
    <DetailsGrid
      resourceType={StorageClass}
      name={name}
      withEvents
      extraInfo={(item) =>
        item && [
          {
            name: t('Reclaim Policy'),
            value: item.reclaimPolicy,
          },
          {
            name: t('Binding Mode'),
            value: item.volumeBindingMode,
          },
          {
            name: t('Provisioner'),
            value: item.provisioner,
          },
        ]
      }
    />
  );
}
