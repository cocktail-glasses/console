import { MouseEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router';

import {
  Box,
  CircularProgress,
  Divider,
  Menu,
  MenuItem,
  MenuList,
  Paper,
  Stack,
  TableSortLabel,
  Typography,
} from '@mui/material';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import size from 'lodash/size';

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
import DotStatus from '@components/atoms/KaaS/DotStatus/DotStatus';
import AddButton from '@components/molecules/KaaS/Button/AddButton/AddButton';
import BackButton from '@components/molecules/KaaS/Button/BackButton/BackButton';
import ContextMenuButton from '@components/molecules/KaaS/Button/ContextMenuButton/ContextMenuButton';
import DeleteIconButton from '@components/molecules/KaaS/Button/DeleteIconButton/DeleteIconButton';
import DownloadButton from '@components/molecules/KaaS/Button/DownloadButton/DownloadButton';
import SearchButton from '@components/molecules/KaaS/Button/SearchButton/SearchButton';
import Dialog from '@components/molecules/KaaS/Dialog/Dialog';
import CheckboxLabel from '@components/molecules/KaaS/Form/CheckboxLabel';
import SelectField from '@components/molecules/KaaS/Form/SelectField';
import TextField from '@components/molecules/KaaS/Form/TextField';
import Table from '@components/molecules/KaaS/Table/Table';
import DrawerEditor from '@components/organisms/KaaS/DrawerEditor/DrawerEditor';
import ExpandSection from '@components/organisms/KaaS/ExpandSection/ExpandSection';
import ImageToggleButtonGroup from '@components/organisms/KaaS/ImageToggleButtonGroup/ImageToggleButtonGroup';
import TabsContent from '@components/organisms/KaaS/TabsContent/TabsContent';
import { labelSelectorToQuery } from '@lib/k8s';
import { ApiListOptions, KubeObjectInterface } from '@lib/k8s/cluster';
import ConfigMap, { KubeConfigMap } from '@lib/k8s/configMap';
import Deployment, { KubeDeployment } from '@lib/k8s/deployment';
import Pod, { KubePod } from '@lib/k8s/pod';
import Secret, { KubeSecret } from '@lib/k8s/secret';
import Service, { KubeService } from '@lib/k8s/service';
import { IoClastixKamajiV1alpha1TenantControlPlane, KamajiClastixIoV1alpha1Api as KamajiAPI } from '@lib/kamaji';
import Centos from '@resources/os_centos.svg';
import RedHat from '@resources/os_redhat.svg';
import RockyLinux from '@resources/os_rocky-linux.svg';
import Ubuntu from '@resources/os_ubuntu.svg';
import { createColumnHelper } from '@tanstack/react-table';
import { fromNow } from '@utils/date';
import clsx from 'clsx';

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

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>();
  const isContextOpen = Boolean(anchorEl);
  const handleContextMenuClick = (e: MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
  const handleContextClose = () => setAnchorEl(null);

  const contextItems = [
    {
      label: 'Edit Cluster',
      onClick: () => handleContextClose(),
    },
    {
      label: 'Edit provider',
      onClick: () => handleContextClose(),
    },
    {
      label: 'Manage SSH keys',
      onClick: () => handleContextClose(),
    },
    {
      label: 'Revoke Token',
      onClick: () => handleContextClose(),
    },
    {
      type: 'divider',
    },
    {
      label: 'Delete Cluster',
      onClick: () => handleContextClose(),
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
        <Box className={commonStyle.title} sx={{ display: 'flex' }}>
          <DotStatus status={dotStatus} />
          <Typography variant="h6">{get(tenantControlPlane, 'metadata.name', '')}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '10px' }}>
          <DownloadButton
            label="Get Kubeconfig"
            size="large"
            textTransform="none"
            sx={{ backgroundColor: '#00b2b2 !important' }}
            className={commonStyle.kaasPrimaryColor}
            onClick={() => downloadKubeconfig(tenantControlPlane)}
          />
          <ContextMenuButton onClick={handleContextMenuClick} />
          <Menu
            anchorEl={anchorEl}
            open={isContextOpen}
            onClose={handleContextClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <MenuList dense sx={{ paddingY: 0 }}>
              {map(contextItems, (contextItem, i) => {
                if (contextItem.type === 'divider') {
                  return <Divider key={i} sx={{ marginY: '0px !important' }} />;
                }

                return (
                  <MenuItem
                    sx={{ height: '48px', paddingX: '10px', paddingY: 0 }}
                    onClick={() => contextItem.onClick && contextItem.onClick()}
                    key={i}
                  >
                    {contextItem.label}
                  </MenuItem>
                );
              })}
            </MenuList>
          </Menu>
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

const MAX_PAGE_SIZE = 10;

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

  return (
    <Table
      data={list || []}
      columns={columns}
      onClickRow={(obj) => openEditor(obj)}
      paging={size(list) > MAX_PAGE_SIZE ? { pageIndex: 0, pageSize: MAX_PAGE_SIZE } : undefined}
    />
  );
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

  return (
    <Table
      data={list || []}
      columns={columns}
      onClickRow={(obj) => openEditor(obj)}
      paging={size(list) > MAX_PAGE_SIZE ? { pageIndex: 0, pageSize: MAX_PAGE_SIZE } : undefined}
    />
  );
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

  return (
    <Table
      data={list || []}
      columns={columns}
      onClickRow={(obj) => openEditor(obj)}
      paging={size(list) > MAX_PAGE_SIZE ? { pageIndex: 0, pageSize: MAX_PAGE_SIZE } : undefined}
    />
  );
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

  return (
    <Table
      data={list || []}
      columns={columns}
      onClickRow={(obj) => openEditor(obj)}
      paging={size(list) > MAX_PAGE_SIZE ? { pageIndex: 0, pageSize: MAX_PAGE_SIZE } : undefined}
    />
  );
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

  return (
    <Table
      data={list || []}
      columns={columns}
      onClickRow={(obj) => openEditor(obj)}
      paging={size(list) > MAX_PAGE_SIZE ? { pageIndex: 0, pageSize: MAX_PAGE_SIZE } : undefined}
    />
  );
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
  status: string;
  age: number;
  version: string;
  internalIp: string;
  externalIp: string;
  osImage: string;
  kernelVersion: string;
  containerRuntime: string;
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
    columnHelper.accessor('status', { header: 'Status' }),
    columnHelper.accessor('age', { header: 'Age' }),
    columnHelper.accessor('version', { header: 'Version' }),
    columnHelper.accessor('internalIp', { header: 'Internal Ip' }),
    columnHelper.accessor('externalIp', { header: 'External Ip' }),
    columnHelper.accessor('osImage', { header: 'OS Image' }),
    columnHelper.accessor('kernelVersion', { header: 'Kernel Version' }),
    columnHelper.accessor('containerRuntime', { header: 'Container Runtime' }),
  ];

  const [isAddMachineDialogOpen, setIsAddMachineDialogOpen] = useState(false);

  return (
    <Paper className={style.mainContainer}>
      <Box
        className={clsx(style.title, commonStyle.title)}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6">Machine Deployments</Typography>
        <AddButton
          label="Add Machine Deployment"
          size="large"
          textTransform="none"
          className={commonStyle.kaasPrimaryColor}
          onClick={() => setIsAddMachineDialogOpen(true)}
        />
      </Box>
      <Table data={[]} columns={columns} emptyMessage="No machine deployments available." />
      <AddMachineDialog isOpen={isAddMachineDialogOpen} onClose={() => setIsAddMachineDialogOpen(false)} />
    </Paper>
  );
};

const AddMachineDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [isExpandSectionOpen, setIsExpandSectionOpen] = useState(false);

  const [osImage, setOsImage] = useState('');

  const content = (
    <Stack sx={{ marginTop: '10px' }}>
      <TextField
        label="Name"
        helperText="Leave this field blank to use automatic name generation."
        sx={{ marginBottom: '8px' }}
        size="small"
      />
      <Box sx={{ display: 'flex', marginBottom: '30px', gap: '10px' }}>
        <TextField label="Replicas" required size="small" />
        <SelectField label="kubelet Version" required value="1.29.4" items={['1.29.4']} size="small" />
      </Box>
      <Box sx={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '30px' }}>
        <SelectField label="Instance Type" size="small" items={['cx1.2xlarge', 'cx1.4xlarge']} />
        <SelectField
          label="Preference"
          helperText="Please select an instance type first."
          size="small"
          items={['alpine', 'centos.7', 'centos.7.desktop']}
        />
        <SearchButton variant="outlined" label="View" sx={{ maxWidth: '98px', minWidth: '98px' }} />
      </Box>
      <TextField label="CPUs" required size="small" sx={{ marginBottom: '30px' }} value="2" disabled />
      <TextField label="Memory (MB)" required size="small" sx={{ marginBottom: '30px' }} value="2000" disabled />

      <Stack>
        <Typography variant="body2" sx={{ marginBottom: '8px' }}>
          Primary Disk
        </Typography>
        <SelectField
          label="Ubuntu System Image"
          required
          items={['20.04 - docker://ccpr.cocktailcloud.io/quay.io/kubermatic-virt-disks/ubuntu:20.04']}
          size="small"
          sx={{ marginBottom: '30px' }}
        />
        <SelectField label="Storage Class" required size="small" items={['host-local']} sx={{ marginBottom: '30px' }} />
        <TextField label="Size (GB)" required size="small" sx={{ marginBottom: '30px' }} />

        <ExpandSection
          label="ADVANCED SCHEDULING SETTINGS"
          isCollapse={!isExpandSectionOpen}
          onChange={() => setIsExpandSectionOpen((prev) => !prev)}
          contentPorps={{ sx: { padding: '0 !important' } }}
          data={
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '20px', marginBottom: '30px' }}>
              <SelectField
                label="Node Affinity Preset Type"
                helperText="Ensures that tenant nodes are hosted on particular nodes."
                sx={{ flex: 1 }}
                items={['hard', 'soft']}
                size="small"
              />
              <TextField label="Node Affinity Preset Key" required sx={{ flex: 1 }} size="small" disabled />
              <TextField
                label="Node Affinity Preset Values"
                helperText="Use comma, space or enter key as the separator."
                size="small"
                disabled
              />

              <Stack sx={{ gap: '8px' }}>
                <Typography>Topology Spread Constraints</Typography>
                <Box sx={{ display: 'flex', gap: '10px' }}>
                  <TextField label="Max Skew" value="1" size="small" />
                  <TextField label="Topology Key" size="small" />
                  <SelectField label="When Unsatisfiable" items={['ScheduleAnyway', 'DoNotSchedule']} size="small" />
                </Box>
              </Stack>
            </Box>
          }
        />
        <Box sx={{ display: 'flex' }}>
          <ImageToggleButtonGroup
            value={osImage}
            onChange={(_, v) => {
              if (v == null) return;
              return setOsImage(v);
            }}
            items={[
              {
                image: (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', textTransform: 'none' }}>
                    <img style={{ height: '28px', width: '28px' }} src={Ubuntu} alt={Ubuntu} />
                    Ubuntu
                  </Box>
                ),
                value: 'ubuntu',
              },
              {
                image: (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', textTransform: 'none' }}>
                    <img style={{ height: '28px', width: '28px' }} src={Centos} alt={Centos} />
                    CentOS
                  </Box>
                ),
                value: 'centos',
              },
              {
                image: (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', textTransform: 'none' }}>
                    <img style={{ height: '28px', width: '28px' }} src={RedHat} alt={RedHat} />
                    RHEL
                  </Box>
                ),
                value: 'rhel',
              },
              {
                image: (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      gap: '10px',
                      textTransform: 'none',
                    }}
                  >
                    <img style={{ height: '28px', width: '28px' }} src={RockyLinux} alt={RockyLinux} />
                    <Typography sx={{ flex: 1 }}>Rocky Linux</Typography>
                  </Box>
                ),
                sx: { width: '158px !important' },
                value: 'rockyLinux',
              },
            ]}
          />
        </Box>
        <CheckboxLabel
          label={<Typography variant="body2">Upgrade system on first boot</Typography>}
          sx={{ marginBottom: '15px' }}
        />
        <SelectField
          label="Operating System Profile"
          helperText="Leave this field blank to use default operating system profile."
          size="small"
          value="osp-ubuntu"
          items={['osp-ubuntu']}
        />

        <Box sx={{ marginTop: '18px' }}>
          <Typography variant="body2" sx={{ marginBottom: '8px' }}>
            Node Autoscalling
          </Typography>
          <TextField
            label="Max Replicas"
            helperText="The maximum number of replicas for autoscaling. Maximum value can be 1000."
            required
            size="small"
            sx={{ marginBottom: '20px' }}
          />
          <TextField
            label="Min Replicas"
            helperText="The minimum number of replicas for autoscaling. Minimum value can be 1"
            required
            size="small"
            sx={{ marginBottom: '20px' }}
          />
        </Box>

        <Box sx={{ marginTop: '18px' }}>
          <Typography variant="body2" sx={{ marginBottom: '8px' }}>
            Node Labels
          </Typography>
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <TextField label="Key" required size="small" />
            <TextField label="Value" required size="small" />
          </Box>
        </Box>

        <Box sx={{ marginTop: '18px' }}>
          <Typography variant="body2" sx={{ marginBottom: '8px' }}>
            Node Taints
          </Typography>
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <TextField label="Key" required size="small" />
            <TextField label="Value" required size="small" />
            <SelectField label="Effect" required size="small" items={['NoSchedule', 'PreferNoSchedule', 'NoExecute']} />
            <DeleteIconButton />
          </Box>
        </Box>
      </Stack>
    </Stack>
  );

  const footer = (
    <AddButton
      label="Add Machine Deployment"
      className={commonStyle.kaasPrimaryColor}
      size="large"
      textTransform="none"
    />
  );
  return (
    <Dialog
      title={<Typography variant="h6">Add Machine Deployment</Typography>}
      isOpen={isOpen}
      onClose={onClose}
      closeBtn
      content={content}
      footer={footer}
      sx={{
        padding: '10px',
        '& .MuiDialog-paper': { maxWidth: '660px', minWidth: '660px' },
        '& .MuiDialogContent-root': { maxHeight: '60vh' },
      }}
    />
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
