import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { CustomResourceListTable } from './CustomResourceList';

import DetailsViewSection from '@components/DetailsViewSection';
import { Link, ObjectEventList } from '@components/common';
import Loader from '@components/common/Loader';
import { ConditionsTable, MainInfoSection, PageGrid } from '@components/common/Resource';
import { SectionBox } from '@components/common/SectionBox';
import SimpleTable from '@components/common/SimpleTable';
import { ApiError } from '@lib/k8s/apiProxy';
import CRD from '@lib/k8s/crd';

export default function CustomResourceDefinitionDetails() {
  const { name } = useParams<{ name: string }>();
  const [item, setItem] = useState<CRD | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const { t } = useTranslation(['glossary', 'translation']);

  CRD.useApiGet(setItem, name, undefined, setError);

  return !item ? (
    <Loader title={t('translation|Loading resource definition details')} />
  ) : (
    <PageGrid>
      <MainInfoSection
        resource={item}
        error={error}
        extraInfo={
          item && [
            {
              name: t('translation|Group'),
              value: item.spec.group,
            },
            {
              name: t('translation|Version'),
              value: item.spec.version,
            },
            {
              name: t('Scope'),
              value: item.spec.scope,
            },
            {
              name: t('Subresources'),
              value: item.spec.subresources && Object.keys(item.spec.subresources).join(' & '),
              hide: !item.spec.subresources,
            },
            {
              name: t('Resource'),
              value: (
                <Link
                  routeName="customresources"
                  params={{
                    crd: item.metadata.name,
                  }}
                >
                  {item.spec.names.kind}
                </Link>
              ),
            },
            {
              name: t('translation|Categories'),
              value: item.getCategories().join(', '),
              hide: item.getCategories().length === 0,
            },
          ]
        }
      />
      <SectionBox title={t('translation|Accepted Names')}>
        <SimpleTable
          data={[item.spec.names]}
          columns={[
            {
              label: t('Plural'),
              datum: 'plural',
            },
            {
              label: t('Singular'),
              datum: 'singular',
            },
            {
              label: t('glossary|Kind'),
              datum: 'kind',
            },
            {
              label: t('List Kind'),
              datum: 'listKind',
            },
          ]}
          reflectInURL="acceptedNames"
        />
      </SectionBox>
      <SectionBox title={t('translation|Versions')}>
        <SimpleTable
          data={item.spec.versions}
          columns={[
            {
              label: t('translation|Name'),
              datum: 'name',
            },
            {
              label: t('Served'),
              getter: (version) => version.storage.toString(),
            },
            {
              label: t('Storage'),
              getter: (version) => version.storage.toString(),
            },
          ]}
          reflectInURL="versions"
        />
      </SectionBox>
      <SectionBox title={t('translation|Conditions')}>
        <ConditionsTable resource={item.jsonData} showLastUpdate={false} />
      </SectionBox>
      <CustomResourceListTable title={t('Objects')} crd={item} />
      <DetailsViewSection resource={item} />
      {item && <ObjectEventList object={item} />}
    </PageGrid>
  );
}
