import React from 'react';

import { NotSupported } from '../checkflux';
import SourceLink from '../common/Link';
import Table from '../common/Table';
import { NameLink } from '../helpers';

import { DateLabel } from '@components/common/Label';
import SectionBox from '@components/common/SectionBox';
import SectionFilterHeader from '@components/common/SectionFilterHeader';
import ShowHideLabel from '@components/common/ShowHideLabel';
import { KubeObjectClass } from '@lib/k8s/KubeObject';
import { makeCustomResourceClass } from '@lib/k8s/crd';
import { useFilterFunc } from '@lib/util';
import YAML from 'yaml';

const imageGroup = 'image.toolkit.fluxcd.io';
const imageVersion = 'v1beta2';
export const IMAGE_AUTOMATION_BETA_VERSION = 'v1beta2';

export function imageRepositoriesClass() {
  return makeCustomResourceClass({
    apiInfo: [{ group: imageGroup, version: imageVersion }],
    isNamespaced: true,
    singularName: 'ImageRepository',
    pluralName: 'imagerepositories',
  });
}

export function imagePolicyClass() {
  return makeCustomResourceClass({
    apiInfo: [{ group: imageGroup, version: imageVersion }],
    isNamespaced: true,
    singularName: 'ImagePolicy',
    pluralName: 'imagepolicies',
  });
}

export function imageUpdateAutomationClass(): KubeObjectClass {
  return makeCustomResourceClass({
    apiInfo: [{ group: imageGroup, version: imageVersion }],
    isNamespaced: true,
    singularName: 'ImageUpdateAutomation',
    pluralName: 'imageupdateautomations',
  });
}

export function ImageAutomation() {
  return (
    <>
      <ImageRepositoryList resourceClass={imageRepositoriesClass()} />
      <ImagePolicyList resourceClass={imagePolicyClass()} />
      <ImageUpdateAutomationList resourceClass={imageUpdateAutomationClass()} />
    </>
  );
}

function ImageUpdateAutomationList(props: { resourceClass: KubeObjectClass }) {
  const { resourceClass } = props;
  const filterFunction = useFilterFunc();
  const [resources, setResources] = React.useState(null);
  const [error, setError] = React.useState(null);

  resourceClass.useApiList(setResources, setError);

  if (error?.status === 404) {
    return <NotSupported typeName="Image Update Automations" />;
  }

  return (
    <SectionBox title="Image Update Automations">
      <Table
        data={resources}
        columns={[
          NameLink(resourceClass),
          'namespace',
          'status',
          {
            header: 'Last Push',
            accessorFn: (item) => <DateLabel date={item.jsonData.status?.lastPushTime} format="mini" />,
          },
          {
            header: 'Git',
            accessorFn: (item) =>
              item.jsonData.spec.git?.checkout?.ref && (
                <ShowHideLabel labelId={item?.metadata.uid}>
                  {YAML.stringify(item.jsonData.spec.git.checkout.ref)}
                </ShowHideLabel>
              ),
          },
          {
            header: 'Interval',
            accessorFn: (item) => item.jsonData.spec.interval,
            gridTemplate: 'min-content',
          },
          {
            header: 'Update',
            accessorFn: (item) => item.jsonData.spec.update && YAML.stringify(item.jsonData.spec.update),
          },
          'age',
        ]}
        filterFunction={filterFunction}
      />
    </SectionBox>
  );
}

function ImagePolicyList(props: { resourceClass: KubeObjectClass }) {
  const { resourceClass } = props;
  const filterFunction = useFilterFunc();
  const [resources, setResources] = React.useState(null);
  const [error, setError] = React.useState(null);

  resourceClass.useApiList(setResources, setError);

  if (error?.status === 404) {
    return <NotSupported typeName="Image Update Policies" />;
  }

  return (
    <SectionBox title="Image Policies">
      <Table
        data={resources}
        columns={[
          NameLink(resourceClass),
          'namespace',
          'status',
          {
            header: 'Policy',
            accessorFn: (item) => item.jsonData.spec.policy && YAML.stringify(item.jsonData.spec.policy),
          },
          {
            header: 'Latest',
            accessorFn: (item) => item.jsonData.status?.latestImage,
          },
          'age',
        ]}
        filterFunction={filterFunction}
      />
    </SectionBox>
  );
}

function ImageRepositoryList(props: { resourceClass: KubeObjectClass }) {
  const { resourceClass } = props;
  const filterFunction = useFilterFunc();
  const [resources, setResources] = React.useState(null);
  const [error, setError] = React.useState(null);

  resourceClass.useApiList(setResources, setError);

  if (error?.status === 404) {
    return <NotSupported typeName="Image Repositories" />;
  }

  return (
    <SectionBox title={<SectionFilterHeader title="Image Repositories" />}>
      <Table
        data={resources}
        columns={[
          NameLink(resourceClass),
          'namespace',
          'status',
          {
            header: 'Image',
            accessorFn: (item) => <SourceLink wrap url={item.jsonData.spec.image} />,
          },
          {
            header: 'Tags',
            accessorFn: (item) => item.jsonData.status.lastScanResult?.tagCount,
            gridTemplate: 'min-content',
          },
          {
            header: 'Secret Ref',
            accessorFn: (item) => item.jsonData.spec?.secretRef?.name || '-',
          },
          {
            header: 'Interval',
            accessorFn: (item) => item.jsonData.spec.interval,
            gridTemplate: 'min-content',
          },
          'age',
        ]}
        filterFunction={filterFunction}
      />
    </SectionBox>
  );
}
