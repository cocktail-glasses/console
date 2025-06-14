import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { DetailsGrid, SimpleTable } from '@components/common';
import ResourceQuota from '@lib/k8s/resourceQuota';
import { compareUnits, normalizeUnit } from '@lib/util';

export default function ResourceQuotaDetails(props: { name?: string; namespace?: string }) {
  const params = useParams<{ namespace: string; name: string }>();
  const { name = params.name, namespace = params.namespace } = props;
  const { t } = useTranslation(['translation', 'glossary']);

  return (
    <DetailsGrid
      resourceType={ResourceQuota}
      name={name}
      namespace={namespace}
      withEvents
      extraInfo={(item) =>
        item && [
          {
            name: t('translation|Status'),
            value: (
              <SimpleTable
                data={item.resourceStats}
                columns={[
                  {
                    label: t('glossary|Resource'),
                    getter: (item) => item.name,
                  },
                  {
                    label: t('translation|Used'),
                    getter: (item) => {
                      const normalizedUnit = normalizeUnit(item.name, item.used);
                      return compareUnits(item.used, normalizedUnit)
                        ? normalizedUnit
                        : `${item.used} (${normalizedUnit})`;
                    },
                  },
                  {
                    label: t('translation|Hard'),
                    getter: (item) => {
                      const normalizedUnit = normalizeUnit(item.name, item.hard);
                      return compareUnits(item.hard, normalizedUnit)
                        ? normalizedUnit
                        : `${item.hard} (${normalizedUnit})`;
                    },
                  },
                ]}
              />
            ),
          },
        ]
      }
    />
  );
}
