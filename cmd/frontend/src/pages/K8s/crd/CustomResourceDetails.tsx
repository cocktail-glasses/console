import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import DetailsViewSection from '@components/DetailsViewSection';
import { HoverInfoLabel, Link, NameValueTableRow, ObjectEventList, SectionBox } from '@components/common';
import Empty from '@components/common/EmptyContent';
import Loader from '@components/common/Loader';
import { ConditionsTable, MainInfoSection, PageGrid } from '@components/common/Resource';
import CustomResourceDefinition, { KubeCRD } from '@lib/k8s/crd';
import { localeDate } from '@lib/util';
import { JSONPath } from 'jsonpath-plus';

export default function CustomResourceDetailsFromURL() {
  const params = useParams() as CustomResourceDetailsProps;

  return <CustomResourceDetails {...params} />;
}

export type CustomResourceDetailsProps = {
  crd: string;
  crName: string;
  namespace: string;
};

export function CustomResourceDetails({ crd: crdName, crName, namespace: ns }: CustomResourceDetailsProps) {
  const { t } = useTranslation('glossary');

  const [crd, error] = CustomResourceDefinition.useGet(crdName);

  const namespace = ns === '-' ? undefined : ns;

  return !crd ? (
    error ? (
      <Empty color="error">
        {t('translation|Error getting custom resource definition {{ crdName }}: {{ errorMessage }}', {
          crdName,
          errorMessage: error.message,
        })}
      </Empty>
    ) : (
      <Loader title={t('translation|Loading custom resource details')} />
    )
  ) : (
    <CustomResourceDetailsRenderer crd={crd} crName={crName} namespace={namespace} />
  );
}

type AdditionalPrinterColumns = KubeCRD['spec']['versions'][0]['additionalPrinterColumns'];

function getExtraColumns(crd: CustomResourceDefinition, apiVersion: string) {
  const version = (crd.jsonData as KubeCRD).spec.versions.find((version) => version.name === apiVersion);
  return version?.additionalPrinterColumns;
}

function getExtraInfo(extraInfoSpec: AdditionalPrinterColumns, item: KubeCRD) {
  const extraInfo: NameValueTableRow[] = [];
  extraInfoSpec.forEach((spec) => {
    // Skip creation date because we already show it by default
    if (spec.jsonPath === '.metadata.creationTimestamp') {
      return;
    }

    let value: string | undefined;
    try {
      // Extract the value from the json item
      value = JSONPath({ path: '$' + spec.jsonPath, json: item });
    } catch (err) {
      console.error(`Failed to get value from JSONPath ${spec.jsonPath} on CR item ${item}`);
      return;
    }

    if (spec.type === 'date' && !!value) {
      value = localeDate(new Date(value));
    } else {
      // Make sure the value will be represented in string form (to account for
      // e.g. cases where we may get an array).
      value = value?.toString();
    }

    const desc = spec.description;

    extraInfo.push({
      name: spec.name,
      value: desc ? <HoverInfoLabel label={value || ''} hoverInfo={desc} /> : value,
      hide: value === '' || value === undefined,
    });
  });

  return extraInfo;
}

export interface CustomResourceDetailsRendererProps {
  crd: CustomResourceDefinition;
  crName: string;
  namespace?: string;
}

function CustomResourceDetailsRenderer(props: CustomResourceDetailsRendererProps) {
  const { crd, crName, namespace } = props;

  const { t } = useTranslation('glossary');

  const CRClass = useMemo(() => crd.makeCRClass(), [crd]);
  const [item, error] = CRClass.useGet(crName, namespace);

  const apiVersion = item?.jsonData.apiVersion?.split('/')[1] || '';
  const extraColumns: AdditionalPrinterColumns = getExtraColumns(crd, apiVersion) || [];

  return !item ? (
    error ? (
      <Empty color="error">
        {t('translation|Error getting custom resource {{ crName }}: {{ errorMessage }}', {
          crName,
          errorMessage: error.message,
        })}
      </Empty>
    ) : (
      <Loader title={t('translation|Loading custom resource details')} />
    )
  ) : (
    <PageGrid>
      <MainInfoSection
        resource={item}
        extraInfo={[
          {
            name: t('glossary|Definition'),
            value: (
              <Link
                routeName="crd"
                params={{
                  name: crd.metadata.name,
                }}
              >
                {crd.metadata.name}
              </Link>
            ),
          },
          ...getExtraInfo(extraColumns, item!.jsonData as KubeCRD),
        ]}
        backLink=""
      />
      {item!.jsonData.status?.conditions && (
        <SectionBox>
          <ConditionsTable resource={item.jsonData} showLastUpdate={false} />
        </SectionBox>
      )}
      <DetailsViewSection resource={item} />
      {item && <ObjectEventList object={item} />}
    </PageGrid>
  );
}
