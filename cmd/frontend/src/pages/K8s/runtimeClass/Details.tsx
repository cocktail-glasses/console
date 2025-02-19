import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import { DetailsGrid } from '@components/common';
import { RuntimeClass } from '@lib/k8s/runtime';

export default function RuntimeClassDetails() {
  const { t } = useTranslation(['translation']);
  const { namespace, name } = useParams<{ namespace: string; name: string }>();

  return (
    <DetailsGrid
      resourceType={RuntimeClass}
      name={name}
      namespace={namespace}
      withEvents
      extraInfo={(item) =>
        item && [
          {
            name: t('translation|Handler'),
            value: item?.jsonData?.handler,
          },
        ]
      }
    />
  );
}
