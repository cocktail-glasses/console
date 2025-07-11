import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { SectionBox, SimpleTable } from '@components/common';
import { ContainersSection, DetailsGrid, MetadataDictGrid, OwnedPodsSection } from '@components/common/Resource';
import DaemonSet from '@lib/k8s/daemonSet';

interface TolerationsSection {
  resource: DaemonSet;
  t: (...args: any[]) => string;
}

function TolerationsSection(props: TolerationsSection) {
  const { resource, t } = props;

  if (!resource) {
    return null;
  }

  const tolerations = resource.spec.template.spec?.tolerations || [];

  function getEffectString(effect: string, seconds?: number) {
    if (effect === 'NoExecute' && seconds === undefined) {
      const secondsLabel = seconds === undefined ? 'forever' : `${seconds}s`;
      return `${effect} (${secondsLabel})`;
    }

    return effect;
  }

  return (
    <SectionBox title={t('Tolerations')}>
      <SimpleTable
        data={tolerations}
        columns={[
          {
            label: t('translation|Key'),
            getter: (toleration) => toleration.key,
            sort: true,
          },
          {
            label: t('translation|Operator'),
            getter: (toleration) => toleration.operator,
            sort: true,
          },
          {
            label: t('translation|Value'),
            getter: (toleration) => toleration.value,
            sort: true,
          },
          {
            label: t('translation|Effect'),
            getter: (toleration) => getEffectString(toleration.effect, toleration.tolerationSeconds),
            sort: true,
          },
        ]}
        reflectInURL="tolerations"
      />
    </SectionBox>
  );
}

export default function DaemonSetDetails(props: { name?: string; namespace?: string }) {
  const params = useParams<{ namespace: string; name: string }>();
  const { name = params.name, namespace = params.namespace } = props;
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <DetailsGrid
      resourceType={DaemonSet}
      name={name}
      namespace={namespace}
      withEvents
      extraInfo={(item) =>
        item && [
          {
            name: t('Update Strategy'),
            value: item?.spec.updateStrategy.type,
          },
          {
            name: t('Selector'),
            value: <MetadataDictGrid dict={item.spec.selector.matchLabels || {}} />,
          },
          {
            name: t('Node Selector'),
            value: <MetadataDictGrid dict={item.spec.template.spec.nodeSelector || {}} />,
          },
        ]
      }
      extraSections={(item) => [
        {
          id: 'headlamp.daemonset-owned-pods',
          section: <OwnedPodsSection resource={item?.jsonData} />,
        },
        {
          id: 'headlamp.daemonset-tolerations',
          section: <TolerationsSection resource={item} t={t} />,
        },
        {
          id: 'headlamp.daemonset-containers',
          section: <ContainersSection resource={item?.jsonData} />,
        },
      ]}
    />
  );
}
