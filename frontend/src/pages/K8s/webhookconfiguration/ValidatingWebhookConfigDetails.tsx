import { useParams } from 'react-router-dom';

import WebhookConfigurationDetails from './Details.tsx';

import ValidatingWebhookConfiguration from '@lib/k8s/validatingWebhookConfiguration.ts';

export default function ValidatingWebhookConfigurationDetails() {
  const { name } = useParams<{ name: string }>();

  return <WebhookConfigurationDetails resourceClass={ValidatingWebhookConfiguration} name={name as string} />;
}
