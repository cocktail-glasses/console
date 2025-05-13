import React from 'react';

import { NotSupported } from '../checkflux';
import Table from '../common/Table';
import { NameLink } from '../helpers';

import SectionBox from '@components/common/SectionBox';
import SectionFilterHeader from '@components/common/SectionFilterHeader';
import { makeCustomResourceClass } from '@lib/k8s/crd';
import { useFilterFunc } from '@lib/util';

export function Kustomizations() {
  return (
    <div>
      <KustomizationList />
    </div>
  );
}

export function kustomizationClass() {
  const kustomizationGroup = 'kustomize.toolkit.fluxcd.io';
  const kustomizationVersion = 'v1';

  return makeCustomResourceClass({
    apiInfo: [{ group: kustomizationGroup, version: kustomizationVersion }],
    isNamespaced: true,
    singularName: 'Kustomization',
    pluralName: 'kustomizations',
  });
}

function KustomizationList() {
  const filterFunction = useFilterFunc();
  const [resources, setResources] = React.useState(null);
  const [error, setError] = React.useState(null);

  kustomizationClass().useApiList(setResources, setError);

  if (error?.status === 404) {
    return <NotSupported typeName="Kustomizations" />;
  }

  return (
    <SectionBox title={<SectionFilterHeader title="Kustomizations" />}>
      <Table
        data={resources}
        // @ts-ignore -- TODO Update the sorting param
        defaultSortingColumn={2}
        columns={[
          NameLink(kustomizationClass()),
          'namespace',
          'status',
          'source',
          'revision',
          'message',
          'lastUpdated',
        ]}
        filterFunction={filterFunction}
      />
    </SectionBox>
  );
}
