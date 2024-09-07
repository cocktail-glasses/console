import { useTranslation } from 'react-i18next';

import { makePVStatusLabel } from './VolumeDetails.tsx';

import { LightTooltip, Link } from '@components/common';
import LabelListItem from '@components/common/LabelListItem.tsx';
import ResourceListView from '@components/common/Resource/ResourceListView.tsx';
import PersistentVolume from '@lib/k8s/persistentVolume.ts';

export default function VolumeList() {
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <ResourceListView
      title={t('Persistent Volumes')}
      headerProps={{
        noNamespaceFilter: true,
      }}
      resourceClass={PersistentVolume}
      columns={[
        'name',
        {
          id: 'className',
          label: t('Class Name'),
          getValue: (volume) => volume.spec.storageClassName ?? '',
          render: (volume) => {
            const name = volume.spec.storageClassName;
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
          getValue: (volume) => volume.spec.capacity.storage,
        },
        {
          id: 'accessModes',
          label: t('Access Modes'),
          getValue: (volume) => volume?.spec?.accesModes?.join(', '),
          render: (volume) => <LabelListItem labels={volume?.spec?.accessModes || []} />,
        },
        {
          id: 'reclaimPolicy',
          label: t('Reclaim Policy'),
          getValue: (volume) => volume.spec.persistentVolumeReclaimPolicy,
        },
        {
          id: 'reason',
          label: t('translation|Reason'),
          getValue: (volume) => volume.status.reason,
          render: (volume) => {
            const reason = volume.status.reason;
            return <LightTooltip title={reason}>{reason}</LightTooltip>;
          },
          show: false,
        },
        {
          id: 'claim',
          label: t('Claim'),
          getValue: (volume) => volume.spec?.claimRef?.name ?? '',
          render: (volume) => {
            const claim = volume.spec.claimRef?.name;
            if (!claim) {
              return null;
            }
            const claimNamespace = volume.spec.claimRef?.namespace;

            return (
              <Link routeName="persistentVolumeClaim" params={{ name: claim, namespace: claimNamespace }} tooltip>
                {claim}
              </Link>
            );
          },
        },
        {
          id: 'status',
          label: t('translation|Status'),
          getValue: (volume) => volume.status?.phase,
          render: (volume) => makePVStatusLabel(volume),
          gridTemplate: 0.3,
        },
        'age',
      ]}
    />
  );
}
