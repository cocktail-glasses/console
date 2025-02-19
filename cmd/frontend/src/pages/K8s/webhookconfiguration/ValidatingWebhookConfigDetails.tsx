import { useParams } from 'react-router-dom';

import WebhookConfigurationDetails from './Details';

import ValidatingWebhookConfiguration from '@lib/k8s/validatingWebhookConfiguration';

export default function ValidatingWebhookConfigurationDetails() {
  const { name } = useParams<{ name: string }>();

  return <WebhookConfigurationDetails resourceClass={ValidatingWebhookConfiguration} name={name as string} />;
}
