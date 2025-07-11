import { useTranslation } from 'react-i18next';

import { makePVCStatusLabel } from './ClaimDetails';

import { Link } from '@components/common';
import LabelListItem from '@components/common/LabelListItem';
import ResourceListView from '@components/common/Resource/ResourceListView';
import PersistentVolumeClaim from '@lib/k8s/persistentVolumeClaim';

export default function VolumeClaimList() {
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <ResourceListView
      title={t('Persistent Volume Claims')}
      resourceClass={PersistentVolumeClaim}
      columns={[
        'name',
        'namespace',
        {
          id: 'className',
          label: t('Class Name'),
          getValue: (volumeClaim) => volumeClaim.spec.storageClassName,
          render: (volumeClaim) => {
            const name = volumeClaim.spec.storageClassName;
            if (!name) {
              return '';
            }
            return (
              <Link routeName="storageClass" params={{ name }} tooltip>
                {name}
              </Link>
            );
          },
        },
        {
          id: 'capacity',
          label: t('Capacity'),
          getValue: (volumeClaim) => volumeClaim.status.capacity?.storage,
          gridTemplate: 0.8,
        },
        {
          id: 'accessModes',
          label: t('Access Modes'),
          getValue: (volumeClaim) => volumeClaim.spec.accessModes.join(', '),
          render: (volumeClaim) => <LabelListItem labels={volumeClaim.spec.accessModes || []} />,
        },
        {
          id: 'volumeMode',
          label: t('Volume Mode'),
          getValue: (volumeClaim) => volumeClaim.spec.volumeMode,
        },
        {
          id: 'volume',
          label: t('Volume'),
          getValue: (volumeClaim) => volumeClaim.spec.volumeName,
          render: (volumeClaim) => {
            const name = volumeClaim.spec.volumeName;
            if (!name) {
              return '';
            }
            return (
              <Link routeName="persistentVolume" params={{ name }} tooltip>
                {name}
              </Link>
            );
          },
        },
        {
          id: 'status',
          label: t('translation|Status'),
          getValue: (volume) => volume.status.phase,
          render: (volume) => makePVCStatusLabel(volume),
          gridTemplate: 0.3,
        },
        'age',
      ]}
    />
  );
}
