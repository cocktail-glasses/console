import { useParams } from 'react-router-dom';

import WebhookConfigurationDetails from './Details';

import MutatingWebhookConfiguration from '@lib/k8s/mutatingWebhookConfiguration';

export default function MutatingWebhookConfigList(props: { name?: string }) {
  const params = useParams<{ name: string }>();
  const { name = params.name } = props;

  return <WebhookConfigurationDetails resourceClass={MutatingWebhookConfiguration} name={name as string} />;
}
