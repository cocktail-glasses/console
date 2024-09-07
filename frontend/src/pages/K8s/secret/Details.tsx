import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { EmptyContent } from '@components/common';
import { DetailsGrid, SecretField } from '@components/common/Resource';
import { SectionBox } from '@components/common/SectionBox.tsx';
import { NameValueTable, NameValueTableRow } from '@components/common/SimpleTable.tsx';
import Secret from '@lib/k8s/secret.ts';

export default function SecretDetails() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const { t } = useTranslation();

  return (
    <DetailsGrid
      resourceType={Secret}
      name={name}
      namespace={namespace}
      withEvents
      extraInfo={(item) =>
        item && [
          {
            name: t('translation|Type'),
            value: item.type,
          },
        ]
      }
      extraSections={(item) =>
        item && [
          {
            id: 'headlamp.secrets-data',
            section: () => {
              const itemData = item?.data || {};
              const mainRows: NameValueTableRow[] = Object.entries(itemData).map((item: unknown[]) => ({
                name: item[0] as string,
                value: <SecretField value={item[1]} />,
              }));
              return (
                <SectionBox title={t('translation|Data')}>
                  {mainRows.length === 0 ? (
                    <EmptyContent>{t('No data in this secret')}</EmptyContent>
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
