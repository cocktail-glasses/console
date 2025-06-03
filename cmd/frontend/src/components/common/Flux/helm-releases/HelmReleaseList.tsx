import { useState } from 'react';

import { NotSupported } from '../checkflux';
import Table from '../common/Table';
import { NameLink } from '../helpers';

import SectionBox from '@components/common/SectionBox';
import SectionFilterHeader from '@components/common/SectionFilterHeader';
import { makeCustomResourceClass } from '@lib/k8s/crd';
import { useFilterFunc } from '@lib/util';

export function HelmReleases() {
  return <HelmReleasesList />;
}

export function helmReleaseClass() {
  const helmreleaseGroup = 'helm.toolkit.fluxcd.io';
  const helmreleaseVersion = 'v2';

  return makeCustomResourceClass({
    apiInfo: [{ group: helmreleaseGroup, version: helmreleaseVersion }],
    isNamespaced: true,
    singularName: 'HelmRelease',
    pluralName: 'helmreleases',
  });
}

function HelmReleasesList() {
  const filterFunction = useFilterFunc();
  const [resources, setResources] = useState(null);
  const [error, setError] = useState(null);

  helmReleaseClass().useApiList(setResources, setError);

  if (error?.status === 404) {
    return <NotSupported typeName="Helm Releases" />;
  }

  return (
    <SectionBox title={<SectionFilterHeader title="Helm Releases" />}>
      <Table
        data={resources}
        // @ts-ignore -- TODO Update the sorting param
        defaultSortingColumn={2}
        columns={[NameLink(helmReleaseClass()), 'namespace', 'status', 'source', 'revision', 'message', 'lastUpdated']}
        filterFunction={filterFunction}
      />
    </SectionBox>
  );
}
