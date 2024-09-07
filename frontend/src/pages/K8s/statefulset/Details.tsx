import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { ContainersSection, DetailsGrid, MetadataDictGrid, OwnedPodsSection } from '@components/common/Resource';
import { StringDict } from '@lib/k8s/cluster.ts';
import StatefulSet from '@lib/k8s/statefulSet.ts';

export default function StatefulSetDetails() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const { t } = useTranslation('glossary');

  return (
    <DetailsGrid
      resourceType={StatefulSet}
      name={name}
      namespace={namespace}
      withEvents
      extraInfo={(item) =>
        item && [
          {
            name: t('Update Strategy'),
            value: item.spec.updateStrategy.type,
          },
          {
            name: t('Selector'),
            value: <MetadataDictGrid dict={item.spec.selector.matchLabels as StringDict} />,
          },
        ]
      }
      extraSections={(item) =>
        item && [
          {
            id: 'headlamp.statefulset-owned-pods',
            section: <OwnedPodsSection resource={item?.jsonData} />,
          },
          {
            id: 'headlamp.statefulset-containers',
            section: <ContainersSection resource={item?.jsonData} />,
          },
        ]
      }
    />
  );
}
