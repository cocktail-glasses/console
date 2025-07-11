import { useTranslation } from 'react-i18next';

import ResourceListView from '@components/common/Resource/ResourceListView';
import { RuntimeClass } from '@lib/k8s/runtime';

export default function RuntimeClassList() {
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <ResourceListView
      title={t('glossary|RuntimeClass')}
      resourceClass={RuntimeClass}
      columns={[
        'name',
        {
          id: 'handler',
          label: t('translation|Handler'),
          getValue: (item) => item?.jsonData?.handler,
        },
        'age',
      ]}
    />
  );
}
