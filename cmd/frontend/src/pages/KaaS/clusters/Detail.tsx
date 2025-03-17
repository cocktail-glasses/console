import React, { useEffect, useState, ReactElement } from 'react';
import { useParams } from 'react-router';

import { Done, Close } from '@mui/icons-material';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TableSortLabel,
  Typography,
} from '@mui/material';

import get from 'lodash/get';
import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';

import commonStyle from './Common.module.scss';
import style from './Detail.module.scss';
import AddonTabContent from './component/TabContents/AddonTabContent/AddonTabContent';
import ApplicationsTabContent from './component/TabContents/ApplicationsTabContent/ApplicationsTabContent';
import EventsTabContent from './component/TabContents/EventsTabContent/EventsTabContent';
import RbacTabContent from './component/TabContents/RbacTabContent/RbacTabContent';
import { getDotStatus } from './utils';

import DescriptionItem, { Description } from '@components/atoms/KaaS/DescriptionItem/DescriptionItem';
import { DotStatus, DotStatusEnum } from '@components/atoms/KaaS/DotStatus';
import AddButton from '@components/molecules/KaaS/Button/AddButton/AddButton';
import BackButton from '@components/molecules/KaaS/Button/BackButton/BackButton';
import ContextMenuButton from '@components/molecules/KaaS/Button/ContextMenuButton/ContextMenuButton';
import DownloadButton from '@components/molecules/KaaS/Button/DownloadButton/DownloadButton';
import Table from '@components/molecules/KaaS/Table/Table';
import ExpandSection from '@components/organisms/KaaS/ExpandSection/ExpandSection';
import TabsContent from '@components/organisms/KaaS/TabsContent/TabsContent';
import { IoClastixKamajiV1alpha1TenantControlPlane, KamajiClastixIoV1alpha1Api as KamajiAPI } from '@lib/kamaji';
import { createColumnHelper } from '@tanstack/react-table';

export default function Detail() {
  const { managementNamespace, name } = useParams<{
    managementNamespace: string;
    name: string;
  }>();

  const [tenantControlPlane, setTenantControlPlane] = useState<IoClastixKamajiV1alpha1TenantControlPlane>();
  useEffect(() => {
    if (isEmpty(name) || isEmpty(managementNamespace)) return;

    const kamajiAPI = new KamajiAPI(undefined, '/k8s');
    kamajiAPI
      .readKamajiClastixIoV1alpha1NamespacedTenantControlPlane(name!, managementNamespace!)
      .then((res) => res.data)
      .then((res) => setTenantControlPlane(res));
  }, [managementNamespace, name]);

  return (
    <Stack sx={{ paddingBottom: '40px' }}>
      <BackButton url="/kaas/clusters" />
      <TenantClusterInformation tenantControlPlane={tenantControlPlane} />
      <TenantClusterNodes />
      <TenantClusterResources />
    </Stack>
  );
}

interface TenantClusterInformationProps {
  tenantControlPlane?: IoClastixKamajiV1alpha1TenantControlPlane;
}

const TenantClusterInformation: React.FC<TenantClusterInformationProps> = ({ tenantControlPlane }) => {
  const dotStatus = getDotStatus(tenantControlPlane?.status?.kubernetesResources?.version?.status);

  const [isCollapse, setIsCollapse] = useState(true);

  const detailInfo = [
    { label: 'Cluster ID', value: 'x8r8c99wk6' },
    { label: 'Created', value: 'a month ago' },
    { label: 'Seed', value: 'kubermatic' },
    { label: 'Region', value: 'KR (Seoul)' },
    { label: 'Provider', value: 'KubeVirt' },
    { label: 'Preset', value: 'kubevirt-p' },
    { label: 'Container Runtime', value: 'containerd' },
    { label: 'SSH Keys', value: 'openstack' },
  ];

  interface AdditionalClusterInformation {
    title: string;
    content: (data: Description) => ReactElement;
    data: Description[];
  }

  const additionalClusterInformation: AdditionalClusterInformation[] = [
    {
      title: 'Control Plane',
      content: (controlPlane: Description) => (
        <Box sx={{ marginBottom: '8px' }}>
          <Box
            sx={{
              display: 'flex',
              marginTop: '6px',
              marginBottom: '6px',
              marginRight: '30px',
            }}
          >
            <DotStatus status={DotStatusEnum.SUCCESS} />
            <Typography variant="subtitle1">{controlPlane.value}</Typography>
          </Box>
        </Box>
      ),
      data: [
        { value: 'API Server' },
        { value: 'etcd' },
        { value: 'Scheduler' },
        { value: 'Controller' },
        { value: 'Machine Controller' },
        { value: 'Operating System Manager' },
        { value: 'User Controller Manager' },
      ],
    },
    {
      title: 'Networking',
      content: (networking: Description) => {
        return has(networking, 'label') ? (
          <DescriptionItem description={networking} />
        ) : (
          <Box sx={{ marginBottom: '8px' }}>
            <Box
              sx={{
                display: 'flex',
                marginTop: '6px',
                marginBottom: '6px',
                marginRight: '30px',
              }}
            >
              <Done />
              <Typography variant="subtitle1">{networking.value}</Typography>
            </Box>
          </Box>
        );
      },
      data: [
        { label: 'Proxy Mode', value: 'ebpf' },
        { label: 'Expose Strategy', value: 'NodePort' },
        { label: 'Pods CIDR', value: '172.26.0.0/16' },
        { label: 'Services CIDR', value: '10.241.0.0/20' },
        { label: 'Node CIDR Mask Size', value: '24' },
        { value: 'Node Local DNS Cache' },
        { value: 'Konnectivity' },
      ],
    },
    {
      title: 'OPA',
      content: (opa: Description) => (
        <Box sx={{ marginBottom: '8px' }}>
          <Box
            sx={{
              display: 'flex',
              marginTop: '6px',
              marginBottom: '6px',
              marginRight: '30px',
            }}
          >
            <Close />
            <Typography variant="subtitle1">{opa.value}</Typography>
          </Box>
        </Box>
      ),
      data: [{ value: 'Policy Control' }],
    },
    {
      title: 'Admission Plugins',
      content: (admissionPlugin: Description) => (
        <Box sx={{ marginBottom: '8px' }}>
          <Box
            sx={{
              display: 'flex',
              marginTop: '6px',
              marginBottom: '6px',
              marginRight: '30px',
            }}
          >
            <Close />
            <Typography variant="subtitle1">{admissionPlugin.value}</Typography>
          </Box>
        </Box>
      ),
      data: [{ value: 'Pod Security Policy' }, { value: 'Pod Node Selector' }, { value: 'Event Rate Limit' }],
    },
    {
      title: 'Misc',
      content: (misc: Description) => {
        return has(misc, 'label') ? (
          <DescriptionItem description={misc} />
        ) : (
          <Box sx={{ marginBottom: '8px' }}>
            <Box
              sx={{
                display: 'flex',
                marginTop: '6px',
                marginBottom: '6px',
                marginRight: '30px',
              }}
            >
              <DotStatus status={DotStatusEnum.SUCCESS} />
              <Typography variant="subtitle1">{misc.value}</Typography>
            </Box>
          </Box>
        );
      },
      data: [
        { value: 'Audit Logging' },
        { value: 'User SSH Key Agent' },
        { value: 'External CCM/CSI' },
        { label: 'External CCM/CSI migration', value: 'Not Needed' },
      ],
    },
  ];

  return (
    <Paper className={style.mainContainer}>
      <Box
        className={style.title}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex' }}>
          <DotStatus status={dotStatus} />
          <h2>{get(tenantControlPlane, 'metadata.name', '')}</h2>
        </Box>
        <Box sx={{ display: 'flex', gap: '10px' }}>
          <DownloadButton
            label="Get Kubeconfig"
            size="large"
            textTransform="none"
            sx={{ backgroundColor: '#00b2b2' }}
          />
          <ContextMenuButton />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          paddingLeft: '60px',
          paddingRight: '60px',
          paddingTop: '8px',
        }}
      >
        <FormControl sx={{ width: '192px', height: '62px', marginRight: '30px' }}>
          <InputLabel variant="outlined">Control Plane</InputLabel>
          <Select variant="outlined" value="1.29.4" label="Control Plane" size="small">
            <MenuItem value="1.29.4">1.29.4</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ width: '192px', height: '62px', marginRight: '30px' }}>
          <InputLabel variant="outlined">CNI Plugin</InputLabel>
          <Select variant="outlined" value="1.15.3" label="CNI Plugin" size="small">
            <MenuItem value="1.15.3">1.15.3</MenuItem>
          </Select>
        </FormControl>
        {map(detailInfo, (detail) => (
          <DescriptionItem key={detail.label} description={detail} />
        ))}
      </Box>
      <ExpandSection
        label={<strong>ADDITIONAL CLUSTER INFORMATION</strong>}
        isCollapse={isCollapse}
        onChange={() => setIsCollapse((prev) => !prev)}
        data={map(additionalClusterInformation, (infomration) => (
          <Box key={infomration.title} sx={{ paddingBottom: '24px', flex: '1 1 33%', maxWidth: '33%' }}>
            <Typography variant="h6" sx={{ marginBottom: '14px' }}>
              {infomration.title}
            </Typography>
            {map(infomration.data, (data, i) => (
              <Box key={i}>{infomration.content(data)}</Box>
            ))}
          </Box>
        ))}
      />
    </Paper>
  );
};

interface TenantClusterNode {
  name: string;
  replicas: number;
  kubeletVersion: string;
  operatingSystem: string;
  created: string;
}

const TenantClusterNodes = () => {
  const columnHelper = createColumnHelper<TenantClusterNode>();

  const columns = [
    columnHelper.accessor('name', {
      header: () => (
        <TableSortLabel active={true} direction={'asc'}>
          Name
        </TableSortLabel>
      ),
    }),
    columnHelper.accessor('replicas', { header: 'Replicas' }),
    columnHelper.accessor('kubeletVersion', { header: 'Kubelet Version' }),
    columnHelper.accessor('operatingSystem', { header: 'Operating System' }),
    columnHelper.accessor('created', { header: 'Created' }),
  ];

  return (
    <Paper className={style.mainContainer}>
      <Box
        className={style.title}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginLeft: '30px',
        }}
      >
        <Box>
          <h2>Machine Deployments</h2>
        </Box>
        <Box>
          <AddButton
            label="Add Machine Deployment"
            size="large"
            textTransform="none"
            className={commonStyle.kaasPrimaryColor}
          />
        </Box>
      </Box>
      <Table data={[]} columns={columns} emptyMessage="No machine deployments available." />
    </Paper>
  );
};

const TenantClusterResources = () => {
  const tabDatas = [
    { label: 'Events', content: <EventsTabContent /> },
    { label: 'RBAC', content: <RbacTabContent /> },
    { label: 'Addons', content: <AddonTabContent /> },
    { label: 'Applications', content: <ApplicationsTabContent /> },
  ];

  return <TabsContent tabDatas={tabDatas} />;
};
