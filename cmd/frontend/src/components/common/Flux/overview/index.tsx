import React, { useEffect } from 'react';

import { Accordion, AccordionDetails, AccordionSummary, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import SourceLink from '../common/Link';
import Table from '../common/Table';
import { useFluxCheck } from '../helpers';
import { IMAGE_AUTOMATION_BETA_VERSION } from '../image-automation/ImageAutomationList';

import { Link, NameValueTable } from '@components/common';
import { StatusLabel } from '@components/common/Label';
import SectionBox from '@components/common/SectionBox';
import TileChart from '@components/common/TileChart';
import { Icon } from '@iconify/react';
import { ResourceClasses } from '@lib/k8s';
import { KubeObject } from '@lib/k8s/KubeObject';
import { apiFactory } from '@lib/k8s/apiProxy';

export function FluxOverview() {
  const [kustomizations] = ResourceClasses.CustomResourceDefinition.useGet(
    'kustomizations.kustomize.toolkit.fluxcd.io'
  );
  const [helmReleases] = ResourceClasses.CustomResourceDefinition.useGet('helmreleases.helm.toolkit.fluxcd.io');
  const [gitRepoCRD] = ResourceClasses.CustomResourceDefinition.useGet('gitrepositories.source.toolkit.fluxcd.io');
  const [ociRepos] = ResourceClasses.CustomResourceDefinition.useGet('ocirepositories.source.toolkit.fluxcd.io');
  const [bucketRepos] = ResourceClasses.CustomResourceDefinition.useGet('buckets.source.toolkit.fluxcd.io');
  const [helmRepos] = ResourceClasses.CustomResourceDefinition.useGet('helmrepositories.source.toolkit.fluxcd.io');
  const [helmCharts] = ResourceClasses.CustomResourceDefinition.useGet('helmcharts.source.toolkit.fluxcd.io');

  const [alerts] = ResourceClasses.CustomResourceDefinition.useGet('alerts.notification.toolkit.fluxcd.io');
  const [providers] = ResourceClasses.CustomResourceDefinition.useGet('providers.notification.toolkit.fluxcd.io');
  const [receivers] = ResourceClasses.CustomResourceDefinition.useGet('receivers.notification.toolkit.fluxcd.io');

  const CRD = React.useMemo(() => {
    const CRD = ResourceClasses.CustomResourceDefinition;
    const isVersionAvailable = CRD.apiEndpoint.apiInfo.find(
      (apiInfo) => apiInfo.version === IMAGE_AUTOMATION_BETA_VERSION
    );
    if (!isVersionAvailable) {
      CRD.apiEndpoint = apiFactory(
        ...CRD.apiEndpoint.apiInfo.map((apiInfo) => {
          const params = [];
          params.push(apiInfo.group);
          params.push(apiInfo.version);
          params.push(apiInfo.resource);
          return params;
        }),
        ['apiextensions.k8s.io', IMAGE_AUTOMATION_BETA_VERSION, 'customresourcedefinitions']
      );
    }

    return CRD;
  }, []);

  const [imageRepository] = CRD.useGet('imagerepositories.image.toolkit.fluxcd.io');
  const [imageUpdateAutomation] = CRD.useGet('imageupdateautomations.image.toolkit.fluxcd.io');
  const [imagePolicy] = CRD.useGet('imagepolicies.image.toolkit.fluxcd.io');

  const fluxCheck = useFluxCheck([
    gitRepoCRD,
    ociRepos,
    bucketRepos,
    helmRepos,
    helmCharts,
    kustomizations,
    alerts,
    providers,
    receivers,
    imageRepository,
    imageUpdateAutomation,
    imagePolicy,
  ]);

  const [pods] = ResourceClasses.Pod.useList({
    namespace: fluxCheck.namespace,
  });

  const controllers = React.useMemo(() => {
    const helmController = pods?.filter((pod) => pod.metadata.labels?.['app'] === 'helm-controller');
    const kustomizeController = pods?.filter((pod) => pod.metadata.labels?.['app'] === 'kustomize-controller');
    const notificationController = pods?.filter((pod) => pod.metadata.labels?.['app'] === 'notification-controller');
    const sourceController = pods?.filter((pod) => pod.metadata.labels?.['app'] === 'source-controller');
    const imageReflectorController = pods?.filter(
      (pod) => pod.metadata.labels?.['app'] === 'image-reflector-controller'
    );
    const imageAutomationController = pods?.filter(
      (pod) => pod.metadata.labels?.['app'] === 'image-automation-controller'
    );

    return helmController?.concat(
      kustomizeController,
      notificationController,
      sourceController,
      imageReflectorController,
      imageAutomationController
    );
  }, [pods]);

  const kustomizationResourceClass = React.useMemo(() => {
    return kustomizations?.makeCRClass();
  }, [kustomizations]);

  const helmReleaseResourceClass = React.useMemo(() => {
    return helmReleases?.makeCRClass();
  }, [helmReleases]);

  const gitRepoResourceClass = React.useMemo(() => {
    return gitRepoCRD?.makeCRClass();
  }, [gitRepoCRD]);

  const ociRepoResourceClass = React.useMemo(() => {
    return ociRepos?.makeCRClass();
  }, [ociRepos]);

  const bucketRepoResourceClass = React.useMemo(() => {
    return bucketRepos?.makeCRClass();
  }, [bucketRepos]);

  const helmRepoResourceClass = React.useMemo(() => {
    return helmRepos?.makeCRClass();
  }, [helmRepos]);

  const helmChartResourceClass = React.useMemo(() => {
    return helmCharts?.makeCRClass();
  }, [helmCharts]);

  const imageRepositoryClass = React.useMemo(() => {
    return imageRepository?.makeCRClass();
  }, [imageRepository]);

  const imageUpdateAutomationClass = React.useMemo(() => {
    return imageUpdateAutomation?.makeCRClass();
  }, [imageUpdateAutomation]);

  const imagePolicyClass = React.useMemo(() => {
    return imagePolicy?.makeCRClass();
  }, [imagePolicy]);

  return (
    <>
      <SectionBox title="Flux Overview">
        <Box
          display="flex"
          justifyContent="space-between"
          sx={{
            flexWrap: 'wrap',
          }}
        >
          <Box width="300px" m={2}>
            {kustomizationResourceClass && <FluxOverviewChart resourceClass={kustomizationResourceClass} />}
          </Box>
          <Box width="300px" m={2}>
            {helmReleaseResourceClass && <FluxOverviewChart resourceClass={helmReleaseResourceClass} />}
          </Box>
          <Box width="300px" m={2}>
            {gitRepoResourceClass && <FluxOverviewChart resourceClass={gitRepoResourceClass} />}
          </Box>
          <Box width="300px" m={2}>
            {ociRepoResourceClass && <FluxOverviewChart resourceClass={ociRepoResourceClass} />}
          </Box>
          <Box width="300px" m={2}>
            {bucketRepoResourceClass && <FluxOverviewChart resourceClass={bucketRepoResourceClass} />}
          </Box>
          <Box width="300px" m={2}>
            {helmRepoResourceClass && <FluxOverviewChart resourceClass={helmRepoResourceClass} />}
          </Box>
          <Box width="300px" m={2}>
            {helmChartResourceClass && <FluxOverviewChart resourceClass={helmChartResourceClass} />}
          </Box>
          <Box width="300px" m={2}>
            {alerts && <FluxOverviewChart resourceClass={alerts.makeCRClass()} />}
          </Box>
          <Box width="300px" m={2}>
            {providers && <FluxOverviewChart resourceClass={providers.makeCRClass()} />}
          </Box>
          <Box width="300px" m={2}>
            {receivers && <FluxOverviewChart resourceClass={receivers.makeCRClass()} />}
          </Box>
          <Box width="300px" m={2}>
            {imageRepositoryClass && <FluxOverviewChart resourceClass={imageRepositoryClass} />}
          </Box>
          <Box width="300px" m={2}>
            {imagePolicyClass && <FluxOverviewChart resourceClass={imagePolicyClass} />}
          </Box>
          <Box width="300px" m={2}>
            {imageUpdateAutomationClass && <FluxOverviewChart resourceClass={imageUpdateAutomationClass} />}
          </Box>
        </Box>
      </SectionBox>
      <SectionBox title="Flux Checks">
        <Accordion>
          <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
            <Box p={1} sx={{ display: 'flex', alignItems: 'center' }} gap={1}>
              <Box>Version Information</Box>
              <Box>
                <StatusLabel status={fluxCheck.version ? 'success' : 'warning'}>
                  {fluxCheck.version || 'Unknown'}
                </StatusLabel>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box p={2} display="flex" gap={2}>
              {fluxCheck.isBoostrapped ? (
                <StatusLabel status="success">
                  <Box display="flex" aligItems="center">
                    <Box mt={0.2} mr={0.1}>
                      <Icon icon="mdi:check" width={16} height={16} />
                    </Box>
                    Boostrapped
                  </Box>{' '}
                </StatusLabel>
              ) : (
                <StatusLabel status="error">
                  <Box display="flex" aligItems="center">
                    <Box mt={0.2} mr={0.1}>
                      <Icon icon="mdi:close" width={16} height={16} />
                    </Box>{' '}
                    Not Bootstrapped
                  </Box>
                </StatusLabel>
              )}
              {fluxCheck.distribution && (
                <StatusLabel status="success">
                  <Box display="flex" aligItems="center">
                    <Box mt={0.2} mr={0.1}>
                      <Icon icon="mdi:check" width={16} height={16} />
                    </Box>
                    Distribution: {fluxCheck.distribution}
                  </Box>{' '}
                </StatusLabel>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
            <Box p={1}>
              <Box>Controllers</Box>
              {/* show status whether all controllers are ready or not */}
              {controllers?.length > 0 &&
                (controllers?.every((controller) => controller.status?.phase === 'Running') ? (
                  <StatusLabel status="success">
                    <Box display="flex" aligItems="center">
                      <Box mt={0.2} mr={0.1}>
                        <Icon icon="mdi:check" width={16} height={16} />
                      </Box>
                      All Controllers Ready
                    </Box>{' '}
                  </StatusLabel>
                ) : (
                  <StatusLabel status="warning">
                    <Box display="flex" aligItems="center">
                      <Box mt={0.2} mr={0.1}>
                        <Icon icon="mdi:close" width={16} height={16} />
                      </Box>{' '}
                      Some Controllers Are Not Ready
                    </Box>
                  </StatusLabel>
                ))}
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box p={2}>
              <Controllers controllers={controllers} />
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
            <Box p={1}>
              <Box>CRDs</Box>
              {/* see if all crds check passed */}
              {fluxCheck.allCrdsSuccessful ? (
                <StatusLabel status="success">
                  <Box display="flex" aligItems="center">
                    <Box mt={0.2} mr={0.1}>
                      <Icon icon="mdi:check" width={16} height={16} />
                    </Box>
                    All Checks Passed
                  </Box>{' '}
                </StatusLabel>
              ) : (
                <StatusLabel status="warning">
                  <Box display="flex" aligItems="center">
                    <Box mt={0.2} mr={0.1}>
                      <Icon icon="mdi:close" width={16} height={16} />
                    </Box>{' '}
                    Some CRDs Are Not Ready
                  </Box>
                </StatusLabel>
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box p={2}>
              <CRDs />
            </Box>
          </AccordionDetails>
        </Accordion>
      </SectionBox>
    </>
  );
}

function FluxOverviewChart({ resourceClass }) {
  const [crds] = resourceClass.useList();
  const theme = useTheme();

  function prepareLink(name) {
    switch (name) {
      case 'gitrepositories':
        return 'sources'; // return '/flux/sources';
      case 'ocirepositories':
        return 'sources'; // return '/flux/sources';
      case 'buckets':
        return 'sources'; // return '/flux/sources';
      case 'helmrepositories':
        return 'sources'; // return '/flux/sources';
      case 'helmcharts':
        return 'sources'; // return '/flux/sources';
      case 'kustomizations':
        return 'kustomizations'; // return '/flux/kustomizations';
      case 'helmreleases':
        return 'helmreleases'; // return '/flux/helmreleases';
      case 'alerts':
        return 'notifications'; // return '/flux/notifications';
      case 'providers':
        return 'notifications'; // return '/flux/notifications';
      case 'receivers':
        return 'notifications'; // return '/flux/notifications';
      case 'imagerepositories':
        return 'image-automations'; // return '/flux/image-automations';
      case 'imageupdateautomations':
        return 'image-automations'; // return '/flux/image-automations';
      case 'imagepolicies':
        return 'image-automations'; // return '/flux/image-automations';
    }

    return '';
  }

  function prepareName(name) {
    switch (name) {
      case 'gitrepositories':
        return 'Git Repositories';
      case 'ocirepositories':
        return 'OCI Repositories';
      case 'buckets':
        return 'Buckets';
      case 'helmrepositories':
        return 'Helm Repositories';
      case 'helmcharts':
        return 'Helm Charts';
      case 'kustomizations':
        return 'Kustomizations';
      case 'helmreleases':
        return 'Helm Releases';
      case 'alerts':
        return 'Alerts';
      case 'providers':
        return 'Providers';
      case 'receivers':
        return 'Receivers';
      case 'imagerepositories':
        return 'Image Repositories';
      case 'imageupdateautomations':
        return 'Image Update Automations';
      case 'imagepolicies':
        return 'Image Policies';
    }

    return '';
  }

  function getStatus(customResources: KubeObject[]) {
    let success: number = 0;
    let failed: number = 0;
    let suspended: number = 0;

    for (const resource of customResources) {
      if (!resource.jsonData.status) {
        success++;
      } else if (resource.jsonData.spec?.suspend) {
        suspended++;
      } else if (
        resource.jsonData.status.conditions?.some(
          (condition) => condition.type === 'Ready' && condition.status === 'True'
        )
      ) {
        success++;
      } else {
        failed++;
      }
    }

    return [success, failed, suspended];
  }

  function makeData() {
    if (crds) {
      const total = crds.length;
      const [success, failed, suspended] = getStatus(crds);

      // Calculate actual percentages
      // Use Math.round to ensure whole numbers
      const successPercent = total > 0 ? Math.round((success / total) * 100) : 0;
      const failedPercent = total > 0 ? Math.round((failed / total) * 100) : 0;
      const suspendedPercent = total > 0 ? Math.round((suspended / total) * 100) : 0;

      // Ensure percentages add up to 100%
      let adjustedSuccessPercent = successPercent;
      let adjustedFailedPercent = failedPercent;
      let adjustedSuspendedPercent = suspendedPercent;

      const sum = successPercent + failedPercent + suspendedPercent;
      if (sum !== 100 && total > 0) {
        const diff = 100 - sum;
        // Add the difference to the largest segment
        if (successPercent >= failedPercent && successPercent >= suspendedPercent) {
          adjustedSuccessPercent += diff;
        } else if (failedPercent >= successPercent && failedPercent >= suspendedPercent) {
          adjustedFailedPercent += diff;
        } else {
          adjustedSuspendedPercent += diff;
        }
      }

      return [
        {
          name: 'success',
          value: adjustedSuccessPercent,
          fill: theme.palette.chartStyles.fillColor,
        },
        {
          name: 'failed',
          value: adjustedFailedPercent,
          fill: '#DC7501',
        },
        {
          name: 'suspended',
          value: adjustedSuspendedPercent,
          fill: '#FDE100',
        },
      ];
    }
    return [];
  }

  function makeLegend() {
    if (crds) {
      const total = crds.length;
      const [success, failed, suspended] = getStatus(crds);

      return (
        <Box>
          <Box>
            <Link routeName={prepareLink(resourceClass.apiName)}>{prepareName(resourceClass.apiName)}</Link>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Box>
                {success}/{total} running
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Box>
                {failed}/{total} failed
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box>
                {suspended}/{total} suspended
              </Box>
            </Box>
          </Box>
        </Box>
      );
    }

    return null;
  }

  function getLabel() {
    if (crds) {
      const total = crds.length;
      if (total === 0) return '0%';

      const [success] = getStatus(crds);

      const percentage = Math.round((success / total) * 100);

      return `${percentage}%`;
    }
    return '0%';
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <TileChart data={makeData()} total={100} label={getLabel()} legend={makeLegend()} />
    </Box>
  );
}

function Controllers({ controllers }) {
  return (
    <Table
      data={controllers}
      columns={[
        {
          extends: 'name',
          routeName: 'pod',
        },
        {
          header: 'Namespace',
          accessorKey: 'metadata.namespace',
          Cell: ({ row: { original: item } }) => (
            <Link routeName="namespace" params={{ name: item.metadata.namespace }}>
              {item.metadata.namespace}
            </Link>
          ),
        },
        {
          header: 'Status',
          accessorFn: (item) => item?.status.phase,
        },
        {
          header: 'Image',
          accessorFn: (item) => <SourceLink url={item.spec.containers[0].image} />,
        },
      ]}
    />
  );
}

function CRDs() {
  const [crds] = ResourceClasses.CustomResourceDefinition.useList();
  const [fluxCrds, setFluxCrds] = React.useState([]);
  useEffect(() => {
    if (crds) setFluxCrds(crds?.filter((crd) => crd.metadata.name.includes('fluxcd.')));
  }, [crds]);

  const rows = React.useMemo(() => {
    return fluxCrds.map((crd) => {
      return {
        name: (
          <Link routeName={'crd'} params={{ name: crd.metadata.name }}>
            {crd.metadata.name}
          </Link>
        ),
        value: crd?.status?.storedVersions.join(', '),
      };
    });
  }, [fluxCrds]);
  return (
    <>
      <NameValueTable rows={rows} />
    </>
  );
}
