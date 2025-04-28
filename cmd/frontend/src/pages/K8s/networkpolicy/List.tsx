import { useTranslation } from 'react-i18next';

import LabelListItem from '@components/common/LabelListItem';
import ResourceListView from '@components/common/Resource/ResourceListView';
import NetworkPolicy from '@lib/k8s/networkpolicy';

export default function NetworkPolicyList() {
  const { t } = useTranslation(['glossary']);
  return (
    <ResourceListView
      title={t('Network Policies')}
      resourceClass={NetworkPolicy}
      columns={[
        'name',
        'namespace',
        {
          id: 'type',
          gridTemplate: 'auto',
          label: t('translation|Type'),
          getValue: (networkpolicy) => {
            const isIngressAvailable =
              networkpolicy.jsonData.spec.ingress && networkpolicy.jsonData.spec.ingress.length > 0;
            const isEgressAvailable =
              networkpolicy.jsonData.spec.egress && networkpolicy.jsonData.spec.egress.length > 0;
            return isIngressAvailable && isEgressAvailable
              ? 'Ingress and Egress'
              : isIngressAvailable
                ? 'Ingress'
                : isEgressAvailable
                  ? 'Egress'
                  : 'None';
          },
        },
        {
          id: 'podSelector',
          gridTemplate: 'auto',
          label: t('Pod Selector'),
          getValue: (networkpolicy) => {
            const podSelector = networkpolicy.jsonData.spec.podSelector;
            return podSelector.matchLabels
              ? Object.keys(podSelector.matchLabels)
                  .map((key) => `${key}=${podSelector.matchLabels[key]}`)
                  .join(', ')
              : null;
          },
          render: (networkpolicy) => {
            const podSelector = networkpolicy.jsonData.spec.podSelector;
            return podSelector.matchLabels ? (
              <LabelListItem
                labels={Object.keys(podSelector.matchLabels).map((key) => `${key}=${podSelector.matchLabels[key]}`)}
              />
            ) : null;
          },
        },
        'age',
      ]}
    />
  );
}
