import React from 'react';
import { useParams } from 'react-router-dom';

import { ForceReconciliationAction, ResumeAction, SuspendAction, SyncAction } from '../actions/index';
import Flux404 from '../checkflux';
import Link from '../common/Link';
import RemainingTimeDisplay from '../common/RemainingTimeDisplay';
import StatusLabel from '../common/StatusLabel';
import { ObjectEvents } from '../helpers/index';
import {
  bucketRepositoryClass,
  gitRepositoryClass,
  helmChartClass,
  helmRepositoryClass,
  ociRepositoryClass,
} from './SourceList';

import { DateLabel } from '@components/common/Label';
import NameValueTable from '@components/common/NameValueTable';
import { ConditionsTable, MainInfoSection } from '@components/common/Resource';
import SectionBox from '@components/common/SectionBox';

export function FluxSourceDetailView(props: { name?: string; namespace?: string; pluralName?: string }) {
  const params = useParams<{
    namespace: string;
    pluralName: string;
    name: string;
  }>();
  const { name = params.name, namespace = params.namespace, pluralName = params.pluralName } = props;

  const resourceClass = (() => {
    switch (pluralName) {
      case 'gitrepositories':
        return gitRepositoryClass();
      case 'ocirepositories':
        return ociRepositoryClass();
      case 'buckets':
        return bucketRepositoryClass();
      case 'helmrepositories':
        return helmRepositoryClass();
      case 'helmcharts':
        return helmChartClass();
      default:
        return null;
    }
  })();

  if (!resourceClass) {
    return <Flux404 message={`Unknown type ${pluralName}`} />;
  }

  return <SourceDetailView name={name} namespace={namespace} resourceClass={resourceClass} />;
}

function SourceDetailView(props) {
  const { name, namespace, resourceClass } = props;
  const [resource, setResource] = React.useState(null);

  resourceClass.useApiGet(setResource, name, namespace);

  function prepareExtraInfo() {
    const interval = resource?.jsonData.spec?.interval;
    const extraInfo = [
      {
        name: 'Status',
        value: <StatusLabel item={resource} />,
      },
      {
        name: 'Interval',
        value: interval,
      },
      {
        name: 'Ref',
        value: resource?.jsonData.spec?.ref && JSON.stringify(resource?.jsonData.spec?.ref),
      },
      {
        name: 'Timeout',
        value: resource?.jsonData.spec?.timeout,
      },
      {
        name: 'URL',
        value: <Link url={resource?.jsonData.spec?.url} />,
        hide: !resource?.jsonData.spec?.url,
      },
      {
        name: 'Chart',
        hide: !resource?.jsonData.spec?.chart,
        value: resource?.jsonData.spec?.chart,
      },
      {
        name: 'Source Ref',
        hide: !resource?.jsonData.spec?.sourceRef,
        value: resource?.jsonData.spec?.sourceRef && JSON.stringify(resource?.jsonData.spec?.sourceRef),
      },
      {
        name: 'Version',
        value: resource?.jsonData.spec?.version,
        hide: !resource?.jsonData.spec?.version,
      },
      {
        name: 'Suspend',
        value: resource?.jsonData.spec?.suspend ? 'True' : 'False',
      },
    ];

    if (!resource?.jsonData.spec?.suspend) {
      extraInfo.push({
        name: 'Next Reconciliation',
        value: <RemainingTimeDisplay item={resource} />,
      });
    }

    return extraInfo;
  }

  return (
    <>
      <MainInfoSection
        resource={resource}
        actions={[
          <SyncAction resource={resource} />,
          <SuspendAction resource={resource} />,
          <ResumeAction resource={resource} />,
          <ForceReconciliationAction resource={resource} />,
        ]}
        extraInfo={prepareExtraInfo()}
      />
      {resource && <ObjectEvents namespace={namespace} name={name} resourceClass={resourceClass} />}
      {resource && (
        <SectionBox title="Conditions">
          <ConditionsTable resource={resource?.jsonData} showLastUpdate={false} />
        </SectionBox>
      )}

      {resource && <ArtifactTable artifact={resource?.jsonData?.status?.artifact} />}
    </>
  );
}

function ArtifactTable(props) {
  const { artifact } = props;
  if (!artifact) {
    return null;
  }
  return (
    <SectionBox title="Artifact">
      <NameValueTable
        rows={[
          {
            name: 'Digest',
            value: artifact.digest,
          },
          {
            name: 'Last Updated Time',
            value: <DateLabel date={artifact.lastUpdateTime} />,
          },
          {
            name: 'Path',
            value: artifact.path,
          },
          {
            name: 'Revision',
            value: artifact.revision,
          },
          {
            name: 'Size',
            value: artifact.size,
          },
          {
            name: 'URL',
            value: <Link url={artifact.url} wrap />,
          },
        ]}
      />
    </SectionBox>
  );
}
