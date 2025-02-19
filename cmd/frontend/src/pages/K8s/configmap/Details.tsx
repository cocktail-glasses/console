import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import EmptyContent from '@components/common/EmptyContent';
import { DataField, DetailsGrid } from '@components/common/Resource';
import { SectionBox } from '@components/common/SectionBox';
import { NameValueTable, NameValueTableRow } from '@components/common/SimpleTable';
import ConfigMap from '@lib/k8s/configMap';

export default function ConfigDetails() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const { t } = useTranslation(['translation']);

  return (
    <DetailsGrid
      resourceType={ConfigMap}
      name={name as string}
      namespace={namespace}
      withEvents
      extraSections={(item) =>
        item && [
          {
            id: 'headlamp.configmap-data',
            section: () => {
              const itemData = item?.data || [];
              const mainRows: NameValueTableRow[] = Object.entries(itemData).map((item: unknown[]) => ({
                name: item[0] as string,
                value: <DataField label={item[0] as string} disableLabel value={item[1] as string} />,
              }));
              return (
                <SectionBox title={t('translation|Data')}>
                  {mainRows.length === 0 ? (
                    <EmptyContent>{t('No data in this config map')}</EmptyContent>
                  ) : (
                    <NameValueTable rows={mainRows} />
                  )}
                </SectionBox>
              );
            },
          },
        ]
      }
    />
  );
}
