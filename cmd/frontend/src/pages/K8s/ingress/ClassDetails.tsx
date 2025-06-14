import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { DetailsGrid } from '@components/common/Resource';
import IngressClass from '@lib/k8s/ingressClass';

export default function IngressClassDetails(props: { name?: string }) {
  const params = useParams<{ name: string }>();
  const { name = params.name } = props;
  const { t } = useTranslation('glossary');

  return (
    <DetailsGrid
      resourceType={IngressClass}
      name={name}
      withEvents
      extraInfo={(item) =>
        item && [
          {
            name: t('translation|Default'),
            value: item.isDefault ? t('translation|Yes') : t('translation|No'),
          },
        ]
      }
    />
  );
}
