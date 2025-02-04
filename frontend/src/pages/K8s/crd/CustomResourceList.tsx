import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';

import { Link, Loader, PageGrid, SectionHeader } from '@components/common';
import BackLink from '@components/common/BackLink';
import Empty from '@components/common/EmptyContent.tsx';
import ResourceListView from '@components/common/Resource/ResourceListView.tsx';
import { ResourceTableColumn, ResourceTableProps } from '@components/common/Resource/ResourceTable.tsx';
import { KubeObject } from '@lib/k8s/cluster.ts';
import CRD, { KubeCRD } from '@lib/k8s/crd.ts';
import { localeDate } from '@lib/util.ts';
import { JSONPath } from 'jsonpath-plus';

export default function CustomResourceList() {
  const { t } = useTranslation(['glossary', 'translation']);
  const { crd: crdName } = useParams<{ crd: string }>();
  const [crd, error] = CRD.useGet(crdName as string);

  if (!crd && !error) {
    return <Loader title={t('translation|Loading custom resource definition')} />;
  }

  if (!!error) {
    return (
      <Empty color="error">
        {t('translation|Error getting custom resource definition {{ crdName }}: {{ errorMessage }}', {
          crdName,
          errorMessage: error,
        })}
      </Empty>
    );
  }

  return <CustomResourceListRenderer crd={crd} />;
}

function CustomResourceLink(props: { resource: KubeCRD; crd: CRD; [otherProps: string]: any }) {
  const { resource, crd, ...otherProps } = props;

  return (
    <Link
      sx={{ cursor: 'pointer' }}
      routeName="customresource"
      params={{
        crName: resource.metadata.name,
        crd: crd.metadata.name,
        namespace: resource.metadata.namespace || '-',
      }}
      {...otherProps}
    >
      {resource.metadata.name}
    </Link>
  );
}

export interface CustomResourceListProps {
  crd: CRD;
}

function CustomResourceListRenderer(props: CustomResourceListProps) {
  const { crd } = props;
  const { t } = useTranslation('glossary');

  return (
    <PageGrid>
      <BackLink />
      <SectionHeader
        title={crd.spec.names.kind}
        actions={[
          <Box mr={2}>
            <Link routeName="crd" params={{ name: crd.metadata.name }}>
              {t('glossary|CRD: {{ crdName }}', { crdName: crd.metadata.name })}
            </Link>
          </Box>,
        ]}
      />
      <CustomResourceListTable crd={crd} />
    </PageGrid>
  );
}

function getValueWithJSONPath(item: KubeCRD, jsonPath: string): string {
  let value: string | object | undefined;
  try {
    // Extract the value from the json item
    value = JSONPath({ path: '$' + jsonPath, json: item.jsonData });
  } catch (err) {
    console.error(`Failed to get value from JSONPath ${jsonPath} on CR item ${item}`);
  }

  // Make sure the value will be represented in string form (to account for
  // e.g. cases where we may get an array).
  return value?.toString() || '';
}

export interface CustomResourceTableProps {
  crd: CRD;
  title?: string;
}

export function CustomResourceListTable(props: CustomResourceTableProps) {
  const { t } = useTranslation(['glossary', 'translation']);
  const { crd, title = '' } = props;

  const apiGroup = useMemo(() => {
    return crd.getMainAPIGroup();
  }, [crd]);

  const CRClass = useMemo(() => {
    return crd.makeCRClass();
  }, [crd]);

  if (!CRClass) {
    return <Empty>{t('translation|No custom resources found')}</Empty>;
  }

  const additionalPrinterCols = useMemo(() => {
    const currentVersion = apiGroup[1];
    const colsFromSpec =
      crd.jsonData.spec.versions.find((version: KubeCRD['spec']['versions'][number]) => version.name === currentVersion)
        ?.additionalPrinterColumns || [];
    const cols: ResourceTableColumn<KubeCRD>[] = [];
    for (let i = 0; i < colsFromSpec.length; i++) {
      const idx = i;
      const colSpec = colsFromSpec[idx];
      // Skip creation date because we already show it by default
      if (colSpec.jsonPath === '.metadata.creationTimestamp') {
        continue;
      }

      cols.push({
        label: colSpec.name,
        getValue: (resource) => {
          let value = getValueWithJSONPath(resource, colSpec.jsonPath);
          if (colSpec.type === 'date') {
            value = localeDate(new Date(value));
          }

          return value;
        },
      });
    }

    return cols;
  }, [crd, apiGroup]);

  const cols = useMemo(() => {
    const colsToDisplay: ResourceTableProps<KubeCRD>['columns'] = [
      {
        label: t('translation|Name'),
        getValue: (resource) => resource.metadata.name,
        render: (resource: KubeObject) => <CustomResourceLink resource={resource} crd={crd} />,
      },
      ...additionalPrinterCols,
      'age',
    ];

    if (crd.isNamespacedScope) {
      colsToDisplay.splice(1, 0, 'namespace');
    }

    return colsToDisplay;
  }, [crd, additionalPrinterCols, t]);

  return (
    <ResourceListView
      title={title}
      headerProps={{
        noNamespaceFilter: !crd.isNamespaced,
      }}
      resourceClass={CRClass}
      columns={cols}
    />
  );
}
