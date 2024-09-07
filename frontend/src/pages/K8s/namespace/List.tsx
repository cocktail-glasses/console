import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Link } from '@components/common';
import { StatusLabel } from '@components/common/Label.tsx';
import ResourceListView from '@components/common/Resource/ResourceListView.tsx';
import { ResourceTableFromResourceClassProps, ResourceTableProps } from '@components/common/Resource/ResourceTable.tsx';
import helpers from '@helpers';
import { useCluster } from '@lib/k8s';
import Namespace from '@lib/k8s/namespace.ts';

export default function NamespacesList() {
  const { t } = useTranslation(['glossary', 'translation']);
  const cluster = useCluster();
  // Use the metadata.name field to match the expected format of the ResourceTable component.
  const [allowedNamespaces, setAllowedNamespaces] = useState<{ metadata: { name: string } }[]>([]);

  useEffect(() => {
    if (cluster) {
      const namespaces = helpers.loadClusterSettings(cluster)?.allowedNamespaces || [];
      setAllowedNamespaces(
        namespaces.map((namespace) => ({
          metadata: {
            name: namespace,
          },
        }))
      );
    }
  }, [cluster]);

  function makeStatusLabel(namespace: Namespace) {
    const status = namespace.status.phase;
    return <StatusLabel status={status === 'Active' ? 'success' : 'error'}>{status}</StatusLabel>;
  }

  const resourceTableProps: ResourceTableFromResourceClassProps<Namespace> | ResourceTableProps<Namespace> =
    useMemo(() => {
      if (allowedNamespaces.length > 0) {
        return {
          columns: [
            {
              id: 'name',
              label: t('translation|Name'),
              getValue: (ns) => ns.metadata.name,
              render: ({ metadata }) => (
                <Link
                  routeName={'namespace'}
                  params={{
                    name: metadata.name,
                  }}
                >
                  {metadata.name}
                </Link>
              ),
            },
            {
              id: 'status',
              label: t('translation|Status'),
              getValue: () => 'Unknown',
            },
            {
              id: 'age',
              label: t('translation|Age'),
              getValue: () => 'Unknown',
            },
          ],
          data: allowedNamespaces as unknown as Namespace[],
        };
      }
      return {
        resourceClass: Namespace,
        columns: [
          'name',
          {
            id: 'status',
            label: t('translation|Status'),
            getValue: (ns) => ns.status.phase,
            render: makeStatusLabel,
          },
          'age',
        ],
      };
    }, [allowedNamespaces, t]);

  return (
    <ResourceListView
      title={t('Namespaces')}
      headerProps={{
        noNamespaceFilter: true,
      }}
      {...resourceTableProps}
    />
  );
}
