import { useTranslation } from 'react-i18next';

import LabelListItem from '@components/common/LabelListItem.tsx';
import ResourceListView from '@components/common/Resource/ResourceListView.tsx';
import Endpoints from '@lib/k8s/endpoints.ts';
import { useFilterFunc } from '@lib/util.ts';

export default function EndpointList() {
  const { t } = useTranslation(['glossary', 'translation']);
  const filterFunc = useFilterFunc<Endpoints>([
    '.jsonData.subsets[*].addresses[*].ip',
    '.jsonData.subsets[*].ports[*].port',
    '.jsonData.subsets[*].ports[*].name',
  ]);

  return (
    <ResourceListView
      title={t('glossary|Endpoints')}
      resourceClass={Endpoints}
      filterFunction={filterFunc}
      columns={[
        'name',
        'namespace',
        {
          id: 'addresses',
          label: t('translation|Addresses'),
          getValue: (endpoint) => endpoint.getAddresses().join(', '),
          render: (endpoint) => <LabelListItem labels={endpoint.getAddresses()} />,
          gridTemplate: 1.5,
        },
        'age',
      ]}
    />
  );
}
