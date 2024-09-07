import { useTranslation } from 'react-i18next';

import ResourceListView from '@components/common/Resource/ResourceListView.tsx';
import ValidatingWebhookConfiguration from '@lib/k8s/validatingWebhookConfiguration.ts';

export default function ValidatingWebhookConfigurationList() {
  const { t } = useTranslation('glossary');

  return (
    <ResourceListView
      title={t('Validating Webhook Configurations')}
      resourceClass={ValidatingWebhookConfiguration}
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
