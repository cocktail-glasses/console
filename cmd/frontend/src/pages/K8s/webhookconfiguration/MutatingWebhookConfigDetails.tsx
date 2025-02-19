import { useParams } from 'react-router-dom';

import WebhookConfigurationDetails from './Details';

import MutatingWebhookConfiguration from '@lib/k8s/mutatingWebhookConfiguration';

export default function MutatingWebhookConfigList() {
  const { name } = useParams<{ name: string }>();

  return <WebhookConfigurationDetails resourceClass={MutatingWebhookConfiguration} name={name as string} />;
}
