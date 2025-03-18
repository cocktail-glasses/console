import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { Box, CircularProgress, Paper, Stack, TableSortLabel, Typography } from '@mui/material';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';

import commonStyle from './Common.module.scss';
import style from './Detail.module.scss';
import AddonTabContent from './component/TabContents/AddonTabContent/AddonTabContent';
import ApplicationsTabContent from './component/TabContents/ApplicationsTabContent/ApplicationsTabContent';
import EventsTabContent from './component/TabContents/EventsTabContent/EventsTabContent';
import RbacTabContent from './component/TabContents/RbacTabContent/RbacTabContent';
import {
  age,
  configmapDataSize,
  deploymentReady,
  podReady,
  podRestart,
  secretDataSize,
  serviceExternalIP,
  servicePorts,
} from './utils/k8sAccessor';
import { downloadKubeconfig, getDotStatus, k8sJsonToYaml } from './utils/utils';

import DescriptionItem from '@components/atoms/KaaS/DescriptionItem/DescriptionItem';
import { DotStatus } from '@components/atoms/KaaS/DotStatus';
import AddButton from '@components/molecules/KaaS/Button/AddButton/AddButton';
import BackButton from '@components/molecules/KaaS/Button/BackButton/BackButton';
import ContextMenuButton from '@components/molecules/KaaS/Button/ContextMenuButton/ContextMenuButton';
import DownloadButton from '@components/molecules/KaaS/Button/DownloadButton/DownloadButton';
import DrawerEditor from '@components/molecules/KaaS/DrawerEditor/DrawerEditor';
import SelectField from '@components/molecules/KaaS/Form/SelectField';
import Table from '@components/molecules/KaaS/Table/Table';
import ExpandSection from '@components/organisms/KaaS/ExpandSection/ExpandSection';
import TabsContent from '@components/organisms/KaaS/TabsContent/TabsContent';
import { labelSelectorToQuery } from '@lib/k8s';
import { ApiListOptions, KubeObjectInterface } from '@lib/k8s/cluster';
import ConfigMap, { KubeConfigMap } from '@lib/k8s/configMap';
import Deployment, { KubeDeployment } from '@lib/k8s/deployment';
import Pod, { KubePod } from '@lib/k8s/pod';
import Secret, { KubeSecret } from '@lib/k8s/secret';
import Service, { KubeService } from '@lib/k8s/service';
import { IoClastixKamajiV1alpha1TenantControlPlane, KamajiClastixIoV1alpha1Api as KamajiAPI } from '@lib/kamaji';
import { createColumnHelper } from '@tanstack/react-table';
import { fromNow } from '@utils/date';

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

  if (!tenantControlPlane) return <CircularProgress />;

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
  tenantControlPlane: IoClastixKamajiV1alpha1TenantControlPlane;
}

const TenantClusterInformation = ({ tenantControlPlane }: TenantClusterInformationProps) => {
  const dotStatus = getDotStatus(tenantControlPlane?.status?.kubernetesResources?.version?.status);

  const [isCollapse, setIsCollapse] = useState(true);

  const storage = tenantControlPlane.status?.storage;
  const endpoint = tenantControlPlane.status?.controlPlaneEndpoint;
  const deployment = tenantControlPlane.status?.kubernetesResources?.deployment;
  const created = tenantControlPlane.metadata?.creationTimestamp;
  const detailInfo = [
    { label: 'Cluster ID', value: 'x8r8c99wk6' },
    { label: 'Datastore', value: storage?.dataStoreName || '' },
    { label: 'Endpoint', value: endpoint || '' },
    { label: 'Replicas', value: `${deployment?.availableReplicas || 0}/${deployment?.replicas} pods` },
    { label: 'Created', value: fromNow(created) },
    { label: 'Container Runtime', value: 'containerd' },
  ];

  const [isOpenEditor, setIsOpenEditor] = useState(false);
  const [resourceName, setResourceName] = useState('');
  const [selectedYaml, setSelectedYaml] = useState('');

  const openEditor = (obj: KubeObjectInterface) => {
    setResourceName(`${obj.kind} ${obj.metadata.namespace}/${obj.metadata.name}`);
    setSelectedYaml(k8sJsonToYaml(obj));
    setIsOpenEditor(true);
  };

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
            onClick={() => downloadKubeconfig(tenantControlPlane)}
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
        <SelectField
          sx={{ width: '192px', height: '42px', marginRight: '30px', '.MuiInputBase-root': { height: '42px' } }}
          label="Control Plane"
          value={tenantControlPlane.spec?.kubernetes.version || 'v1.30.2'}
          items={[
            {
              label: tenantControlPlane.spec?.kubernetes.version || '',
              value: tenantControlPlane.spec?.kubernetes.version || '',
            },
          ]}
        />
        <SelectField
          sx={{ width: '192px', height: '42px', marginRight: '30px', '.MuiInputBase-root': { height: '42px' } }}
          label="CNI Plugin"
          value={'1.15.3'}
          items={['1.15.3']}
        />

        {map(detailInfo, (detail) => (
          <DescriptionItem key={detail.label} description={detail} />
        ))}
      </Box>
      <ExpandSection
        label={<strong>ADDITIONAL CLUSTER INFORMATION</strong>}
        isCollapse={isCollapse}
        onChange={() => setIsCollapse((prev) => !prev)}
        data={<ExpandSectionContentV2 tenantControlPlane={tenantControlPlane} openEditor={openEditor} />}
      />
      <DrawerEditor
        title={resourceName}
        value={selectedYaml}
        open={isOpenEditor}
        onClose={() => setIsOpenEditor(false)}
      />
    </Paper>
  );
};

interface OpenEditorProps extends TenantClusterInformationProps {
  openEditor: (obj: KubeObjectInterface) => void;
}

const ExpandSectionContentV2 = ({ tenantControlPlane, openEditor }: OpenEditorProps) => {
  const tabDatas = [
    {
      label: <Typography sx={{ textTransform: 'none' }}>pods</Typography>,
      content: <TCPPods tenantControlPlane={tenantControlPlane} openEditor={openEditor} />,
    },
    {
      label: <Typography sx={{ textTransform: 'none' }}>deployments</Typography>,
      content: <TCPDeployments tenantControlPlane={tenantControlPlane} openEditor={openEditor} />,
    },
    {
      label: <Typography sx={{ textTransform: 'none' }}>services</Typography>,
      content: <TCPServices tenantControlPlane={tenantControlPlane} openEditor={openEditor} />,
    },
    {
      label: <Typography sx={{ textTransform: 'none' }}>secrets</Typography>,
      content: <TCPSecrets tenantControlPlane={tenantControlPlane} openEditor={openEditor} />,
    },
    {
      label: <Typography sx={{ textTransform: 'none' }}>configmaps</Typography>,
      content: <TCPConfigmaps tenantControlPlane={tenantControlPlane} openEditor={openEditor} />,
    },
  ];

  return <TabsContent contentComponent="div" mainProps={{ sx: { width: '100%' } }} tabDatas={tabDatas} />;
};

const relateResourceQuery = (name: string, namespace: string): ApiListOptions => ({
  namespace,
  labelSelector: labelSelectorToQuery({ matchLabels: { 'kamaji.clastix.io/name': name } }),
});

const TCPPods = ({ tenantControlPlane, openEditor }: OpenEditorProps) => {
  const namespace = tenantControlPlane?.metadata?.namespace || '';
  const name = tenantControlPlane?.metadata?.name || '';

  const [list] = Pod.useList(relateResourceQuery(name, namespace));

  const columnHelper = createColumnHelper<KubePod>();

  const columns = [
    columnHelper.accessor('metadata.name', { header: 'Name' }),
    columnHelper.accessor(podReady, { header: 'Ready' }),
    columnHelper.accessor('status.phase', { header: 'Status' }),
    columnHelper.accessor(podRestart, { header: 'Restarts' }),
    columnHelper.accessor(age, { header: 'AGE' }),
    columnHelper.accessor('status.podIP', { header: 'IP' }),
    columnHelper.accessor('spec.nodeName', { header: 'Node' }),
  ];

  return <Table data={list || []} columns={columns} onClickRow={(obj) => openEditor(obj)} />;
};

const TCPDeployments = ({ tenantControlPlane, openEditor }: OpenEditorProps) => {
  const namespace = tenantControlPlane?.metadata?.namespace || '';
  const name = tenantControlPlane?.metadata?.name || '';

  const [list] = Deployment.useList(relateResourceQuery(name, namespace));

  const columnHelper = createColumnHelper<KubeDeployment>();

  const columns = [
    columnHelper.accessor('metadata.name', { header: 'Name' }),
    columnHelper.accessor(deploymentReady, { header: 'Ready' }),
    columnHelper.accessor('status.updatedReplicas', { header: 'Up to date' }),
    columnHelper.accessor('status.availableReplicas', { header: 'Available' }),
    columnHelper.accessor(age, { header: 'AGE' }),
  ];

  return <Table data={list || []} columns={columns} onClickRow={(obj) => openEditor(obj)} />;
};

const TCPServices = ({ tenantControlPlane, openEditor }: OpenEditorProps) => {
  const namespace = tenantControlPlane?.metadata?.namespace || '';
  const name = tenantControlPlane?.metadata?.name || '';

  const [list] = Service.useList(relateResourceQuery(name, namespace));

  const columnHelper = createColumnHelper<KubeService>();

  const columns = [
    columnHelper.accessor('metadata.name', { header: 'Name' }),
    columnHelper.accessor('spec.type', { header: 'TYPE' }),
    columnHelper.accessor('spec.clusterIP', { header: 'Cluster IP' }),
    columnHelper.accessor(serviceExternalIP, { header: 'External IP' }),
    columnHelper.accessor(servicePorts, { header: 'Port(s)' }),
    columnHelper.accessor(age, { header: 'AGE' }),
  ];

  return <Table data={list || []} columns={columns} onClickRow={(obj) => openEditor(obj)} />;
};

const TCPSecrets = ({ tenantControlPlane, openEditor }: OpenEditorProps) => {
  const namespace = tenantControlPlane?.metadata?.namespace || '';
  const name = tenantControlPlane?.metadata?.name || '';

  const [list] = Secret.useList(relateResourceQuery(name, namespace));

  const columnHelper = createColumnHelper<KubeSecret>();

  const columns = [
    columnHelper.accessor('metadata.name', { header: 'Name' }),
    columnHelper.accessor('type', { header: 'Type' }),
    columnHelper.accessor(secretDataSize, { header: 'Data' }),
    columnHelper.accessor(age, { header: 'AGE' }),
  ];

  return <Table data={list || []} columns={columns} onClickRow={(obj) => openEditor(obj)} />;
};

const TCPConfigmaps = ({ tenantControlPlane, openEditor }: OpenEditorProps) => {
  const namespace = tenantControlPlane?.metadata?.namespace || '';
  const name = tenantControlPlane?.metadata?.name || '';

  const [list] = ConfigMap.useList(relateResourceQuery(name, namespace));

  const columnHelper = createColumnHelper<KubeConfigMap>();

  const columns = [
    columnHelper.accessor('metadata.name', { header: 'Name' }),
    columnHelper.accessor(configmapDataSize, { header: 'Data' }),
    columnHelper.accessor(age, { header: 'AGE' }),
  ];

  return <Table data={list || []} columns={columns} onClickRow={(obj) => openEditor(obj)} />;
};

// const ExpandSectionContent = () => {
//   interface AdditionalClusterInformation {
//     title: string;
//     content: (data: Description) => ReactElement;
//     data: Description[];
//   }

//   const additionalClusterInformation: AdditionalClusterInformation[] = [
//     {
//       title: 'Control Plane',
//       content: (controlPlane: Description) => (
//         <Box sx={{ marginBottom: '8px' }}>
//           <Box
//             sx={{
//               display: 'flex',
//               marginTop: '6px',
//               marginBottom: '6px',
//               marginRight: '30px',
//             }}
//           >
//             <DotStatus status={DotStatusEnum.SUCCESS} />
//             <Typography variant="subtitle1">{controlPlane.value}</Typography>
//           </Box>
//         </Box>
//       ),
//       data: [
//         { value: 'API Server' },
//         { value: 'etcd' },
//         { value: 'Scheduler' },
//         { value: 'Controller' },
//         { value: 'Machine Controller' },
//         { value: 'Operating System Manager' },
//         { value: 'User Controller Manager' },
//       ],
//     },
//     {
//       title: 'Networking',
//       content: (networking: Description) => {
//         return has(networking, 'label') ? (
//           <DescriptionItem description={networking} />
//         ) : (
//           <Box sx={{ marginBottom: '8px' }}>
//             <Box
//               sx={{
//                 display: 'flex',
//                 marginTop: '6px',
//                 marginBottom: '6px',
//                 marginRight: '30px',
//               }}
//             >
//               <Done />
//               <Typography variant="subtitle1">{networking.value}</Typography>
//             </Box>
//           </Box>
//         );
//       },
//       data: [
//         { label: 'Proxy Mode', value: 'ebpf' },
//         { label: 'Expose Strategy', value: 'NodePort' },
//         { label: 'Pods CIDR', value: '172.26.0.0/16' },
//         { label: 'Services CIDR', value: '10.241.0.0/20' },
//         { label: 'Node CIDR Mask Size', value: '24' },
//         { value: 'Node Local DNS Cache' },
//         { value: 'Konnectivity' },
//       ],
//     },
//     {
//       title: 'OPA',
//       content: (opa: Description) => (
//         <Box sx={{ marginBottom: '8px' }}>
//           <Box
//             sx={{
//               display: 'flex',
//               marginTop: '6px',
//               marginBottom: '6px',
//               marginRight: '30px',
//             }}
//           >
//             <Close />
//             <Typography variant="subtitle1">{opa.value}</Typography>
//           </Box>
//         </Box>
//       ),
//       data: [{ value: 'Policy Control' }],
//     },
//     {
//       title: 'Admission Plugins',
//       content: (admissionPlugin: Description) => (
//         <Box sx={{ marginBottom: '8px' }}>
//           <Box
//             sx={{
//               display: 'flex',
//               marginTop: '6px',
//               marginBottom: '6px',
//               marginRight: '30px',
//             }}
//           >
//             <Close />
//             <Typography variant="subtitle1">{admissionPlugin.value}</Typography>
//           </Box>
//         </Box>
//       ),
//       data: [{ value: 'Pod Security Policy' }, { value: 'Pod Node Selector' }, { value: 'Event Rate Limit' }],
//     },
//     {
//       title: 'Misc',
//       content: (misc: Description) => {
//         return has(misc, 'label') ? (
//           <DescriptionItem description={misc} />
//         ) : (
//           <Box sx={{ marginBottom: '8px' }}>
//             <Box
//               sx={{
//                 display: 'flex',
//                 marginTop: '6px',
//                 marginBottom: '6px',
//                 marginRight: '30px',
//               }}
//             >
//               <DotStatus status={DotStatusEnum.SUCCESS} />
//               <Typography variant="subtitle1">{misc.value}</Typography>
//             </Box>
//           </Box>
//         );
//       },
//       data: [
//         { value: 'Audit Logging' },
//         { value: 'User SSH Key Agent' },
//         { value: 'External CCM/CSI' },
//         { label: 'External CCM/CSI migration', value: 'Not Needed' },
//       ],
//     },
//   ];

//   return map(additionalClusterInformation, (infomration) => (
//     <Box key={infomration.title} sx={{ paddingBottom: '24px', flex: '1 1 33%', maxWidth: '33%' }}>
//       <Typography variant="h6" sx={{ marginBottom: '14px' }}>
//         {infomration.title}
//       </Typography>
//       {map(infomration.data, (data, i) => (
//         <Box key={i}>{infomration.content(data)}</Box>
//       ))}
//     </Box>
//   ));
// };

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
