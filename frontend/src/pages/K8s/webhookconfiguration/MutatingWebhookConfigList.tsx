import { useTranslation } from 'react-i18next';

import ResourceListView from '@components/common/Resource/ResourceListView.tsx';
import MutatingWebhookConfiguration from '@lib/k8s/mutatingWebhookConfiguration.ts';

export default function MutatingWebhookConfigurationList() {
  const { t } = useTranslation('glossary');

  return (
    <ResourceListView
      title={t('Mutating Webhook Configurations')}
      resourceClass={MutatingWebhookConfiguration}
      columns={[
        'name',
        {
          id: 'webhooks',
          label: t('Webhooks'),
          getValue: (mutatingWebhookConfig) => mutatingWebhookConfig.webhooks?.length || 0,
        },
        'age',
      ]}
    />
  );
}
