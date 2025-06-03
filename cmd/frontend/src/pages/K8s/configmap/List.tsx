import { useTranslation } from 'react-i18next';

import ResourceListView from '@components/common/Resource/ResourceListView';
import ConfigMap from '@lib/k8s/configMap';

export default function ConfigMapList() {
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <ResourceListView
      title={t('glossary|Config Maps')}
      resourceClass={ConfigMap}
      columns={[
        'name',
        'namespace',
        {
          id: 'data',
          label: t('translation|Data'),
          getValue: (configmap: ConfigMap) => Object.keys(configmap.data || {}).length || 0,
          gridTemplate: 0.5,
        },
        'age',
      ]}
    />
  );
}
