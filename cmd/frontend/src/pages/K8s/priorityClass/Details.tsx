import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { DetailsGrid } from '@components/common';
import PriorityClass from '@lib/k8s/priorityClass';

export default function PriorityClassDetails(props: { name?: string }) {
  const params = useParams<{ namespace: string; name: string }>();
  const { name = params.name } = props;
  const { t } = useTranslation(['translation']);

  return (
    <DetailsGrid
      resourceType={PriorityClass}
      name={name}
      withEvents
      extraInfo={(item) =>
        item && [
          {
            name: t('translation|Value'),
            value: item.value,
          },
          {
            name: t('translation|Global Default'),
            value: item.globalDefault || 'False',
          },
          {
            name: t('translation|Preemption Policy'),
            value: item.preemptionPolicy,
          },
          {
            name: t('translation|Description'),
            value: item.description,
          },
        ]
      }
    />
  );
}
