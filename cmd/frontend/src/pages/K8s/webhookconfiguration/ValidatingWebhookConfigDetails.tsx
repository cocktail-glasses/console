import { useParams } from 'react-router-dom';

import WebhookConfigurationDetails from './Details';

import ValidatingWebhookConfiguration from '@lib/k8s/validatingWebhookConfiguration';

export default function ValidatingWebhookConfigurationDetails(props: { name?: string }) {
  const params = useParams<{ name: string }>();
  const { name = params.name } = props;

  return <WebhookConfigurationDetails resourceClass={ValidatingWebhookConfiguration} name={name as string} />;
}
