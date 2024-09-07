import { useTranslation } from 'react-i18next';

import ResourceListView from '@components/common/Resource/ResourceListView.tsx';
import PriorityClass from '@lib/k8s/priorityClass.ts';

export default function PriorityClassList() {
  const { t } = useTranslation(['glossary']);

  return (
    <ResourceListView
      title={t('glossary|PriorityClass')}
      resourceClass={PriorityClass}
      columns={[
        'name',
        {
          id: 'value',
          label: t('translation|Value'),
          getValue: (item) => item.value,
        },
        {
          id: 'globalDefault',
          label: t('translation|Global Default'),
          getValue: (item) => String(item.globalDefault || 'False'),
        },
        'age',
      ]}
    />
  );
}
