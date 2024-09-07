import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { DetailsGrid } from '@components/common/Resource';
import { SectionBox } from '@components/common/SectionBox.tsx';
import SimpleTable from '@components/common/SimpleTable.tsx';
import ClusterRole from '@lib/k8s/clusterRole.ts';
import Role from '@lib/k8s/role.ts';

export default function RoleDetails() {
  const { namespace = undefined, name } = useParams<{
    namespace: string | undefined;
    name: string;
  }>();
  const { t } = useTranslation('glossary');

  return (
    <DetailsGrid
      resourceType={!namespace ? ClusterRole : Role}
      name={name}
      namespace={namespace}
      withEvents
      extraSections={(item) =>
        item && [
          {
            id: 'headlamp.role-rules',
            section: (
              <SectionBox title={t('Rules')}>
                <SimpleTable
                  columns={[
                    {
                      label: t('API Groups'),
                      getter: ({ apiGroups = [] }) => apiGroups.join(', '),
                    },
                    {
                      label: t('Resources'),
                      getter: ({ resources = [] }) => resources.join(', '),
                    },
                    {
                      label: t('Non Resources'),
                      getter: ({ nonResources = [] }) => nonResources.join(', '),
                    },
                    {
                      label: t('Verbs'),
                      getter: ({ verbs = [] }) => verbs.join(', '),
                    },
                  ]}
                  data={item.rules || []}
                  reflectInURL="rules"
                />
              </SectionBox>
            ),
          },
        ]
      }
    />
  );
}
