import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import { DateLabel, DetailsGrid } from '@components/common';
import { Lease } from '@lib/k8s/lease.ts';

export default function LeaseDetails() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const { t } = useTranslation();

  return (
    <DetailsGrid
      resourceType={Lease}
      name={name}
      namespace={namespace}
      withEvents
      extraInfo={(item) =>
        item && [
          {
            name: t('Holder Identity'),
            value: item.spec.holderIdentity,
          },
          {
            name: t('Lease Duration Seconds'),
            value: item.spec.leaseDurationSeconds,
          },
          {
            name: t('Renew Time'),
            value: <DateLabel date={item.spec.renewTime} />,
          },
        ]
      }
    />
  );
}
