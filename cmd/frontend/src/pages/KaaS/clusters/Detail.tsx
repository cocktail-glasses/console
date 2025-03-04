import React, { useEffect, useState, ReactElement } from 'react';
import { useNavigate, useParams } from 'react-router';

import {
  VerticalAlignBottom,
  MoreVert,
  Add,
  ExpandMore,
  Done,
  Close,
  SmartToyOutlined,
  Person3Outlined,
  OpenInNew,
  DeleteOutline,
  ArrowBackIosNew,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Collapse,
  FormControl,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Popover,
  Select,
  Stack,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tabs,
  Typography,
} from '@mui/material';

import eq from 'lodash/eq';
import get from 'lodash/get';
import has from 'lodash/has';
import head from 'lodash/head';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';

import style from './Detail.module.scss';
import DescriptionItem, { Description } from './component/Description/DescriptionItem';
import { DotStatus, DotStatusEnum } from './component/DotStatus';
import { getDotStatus } from './utils';

import { IoClastixKamajiV1alpha1TenantControlPlane, KamajiClastixIoV1alpha1Api as KamajiAPI } from '@lib/kamaji';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import clsx from 'clsx';
import NodeExporter from 'public/prometheus-node-exporter.svg';

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
    <>
      <BackButton url="/kaas/clusters" />
      <TenantClusterInformation tenantControlPlane={tenantControlPlane} />
      <TenantClusterNodes />
      <TenantClusterResources />
    </>
  );
}

interface BackButtonProps {
  url: string;
}

const BackButton: React.FC<BackButtonProps> = ({ url }) => {
  const navigate = useNavigate();
  const handleClick = () => navigate(url);
  return (
    <Button onClick={handleClick} variant="outlined" className={style.backBtn} color="success">
      <ArrowBackIosNew />
    </Button>
  );
};

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
          <Button variant="contained" startIcon={<VerticalAlignBottom />}>
            Get Kubeconfig
          </Button>
          <Button variant="outlined" className={style.actionBtn}>
            <MoreVert sx={{ color: 'white' }} />
          </Button>
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
          <InputLabel>Control Plane</InputLabel>
          <Select variant="outlined" value="1.29.4" label="Control Plane" size="small">
            <MenuItem value="1.29.4">1.29.4</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ width: '192px', height: '62px', marginRight: '30px' }}>
          <InputLabel>CNI Plugin</InputLabel>
          <Select variant="outlined" value="1.15.3" label="Control Plane" size="small">
            <MenuItem value="1.15.3">1.15.3</MenuItem>
          </Select>
        </FormControl>
        {map(detailInfo, (detail) => (
          <DescriptionItem description={detail} />
        ))}
      </Box>
      <CollapseButton
        label={<strong>ADDITIONAL CLUSTER INFORMATION</strong>}
        isCollapse={isCollapse}
        handleOnChange={() => setIsCollapse((prev) => !prev)}
      />
      <Collapse in={!isCollapse}>
        <Box sx={{ padding: '0 60px', display: 'flex', flexWrap: 'wrap' }}>
          {map(additionalClusterInformation, (infomration) => (
            <Box sx={{ paddingBottom: '24px', flex: '1 1 33%', maxWidth: '33%' }}>
              <Typography variant="h6" sx={{ marginBottom: '14px' }}>
                {infomration.title}
              </Typography>
              {map(infomration.data, (data, i) => (
                <Box key={i}>{infomration.content(data)}</Box>
              ))}
            </Box>
          ))}
        </Box>
      </Collapse>
    </Paper>
  );
};

interface CollapseButtonProps {
  label: string | ReactElement;
  isCollapse: boolean;
  handleOnChange: (...event: any[]) => void;
}

const CollapseButton: React.FC<CollapseButtonProps> = ({ label, isCollapse, handleOnChange }) => {
  return (
    <Box className={style.collapseButton} onClick={handleOnChange}>
      <hr className={style.line} />
      <Box className={style.labelContainer}>
        <Typography className={style.label} variant="subtitle1">
          {label}
        </Typography>
        <ExpandMore className={clsx({ [style.iconArrowUp]: isCollapse })} />
      </Box>
      <hr className={style.line} />
    </Box>
  );
};

const TenantClusterNodes = () => (
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
        <Button variant="contained" startIcon={<Add />}>
          Add Machine Deployment
        </Button>
      </Box>
    </Box>
    <TableContainer className={style.table}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel active={true} direction={'asc'}>
                Name
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <Box>
                Replicas
                <Popover
                  id="mouse-over-popover"
                  sx={{ pointerEvents: 'none' }}
                  open={true}
                  // anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  // onClose={handlePopoverClose}
                  // disableRestoreFocus
                >
                  <Typography sx={{ p: 1 }}>I use Popover.</Typography>
                </Popover>
              </Box>
            </TableCell>
            <TableCell>Kubelet Version</TableCell>
            <TableCell>Operating System</TableCell>
            <TableCell>Created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow className={style.row}>
            <TableCell colSpan={6} align="center">
              No machine deployments available.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
);

const TenantClusterResources = () => {
  const tabDatas = [
    { label: 'Events', content: <EventsTabContent /> },
    { label: 'RBAC', content: <RbacTabContent /> },
    { label: 'Addons', content: <AddonTabContent /> },
    { label: 'Applications', content: <ApplicationsTabContent /> },
  ];
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box sx={{ marginTop: '20px' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)} aria-label="basic tabs example">
          {map(tabDatas, (data) => (
            <Tab key={data.label} label={data.label} sx={{ textTransform: 'none' }} />
          ))}
        </Tabs>
      </Box>
      {map(tabDatas, (data, i) => (
        <Paper key={data.label} hidden={tabIndex !== i} className={style.tabContainer}>
          {data.content}
        </Paper>
      ))}
    </Box>
  );
};

const EventsTabContent = () => (
  <TableContainer className={clsx(style.table, style.paddingY30)} sx={{ marginTop: '0px !important' }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <TableSortLabel active={true} direction={'asc'}>
              Message
            </TableSortLabel>
          </TableCell>
          <TableCell>Resource ID</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Count</TableCell>
          <TableCell>Occurred</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow className={style.row}>
          <TableCell colSpan={5} align="center">
            No events available.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
);

const RbacTabContent = () => {
  const rbacTypes = [
    {
      value: 'serviceAccount',
      label: (
        <>
          <SmartToyOutlined />
          Service Account
        </>
      ),
    },
    {
      value: 'user',
      label: (
        <>
          <Person3Outlined />
          User
        </>
      ),
    },
    {
      value: 'group',
      label: (
        <>
          <SmartToyOutlined />
          Group
        </>
      ),
    },
  ];
  const [rbacSelect, setRbacSelect] = useState(head(rbacTypes)?.value);

  const rbacUserData = [
    {
      scope: 'Cluster',
      user: 'skyikho@acornsoft.io',
      clusterRole: 'cluster-admin',
    },
    {
      scope: 'Namespace',
      user: 'yunwansu@acornsoft.io',
      clusterRole: 'namespace-admin',
      namespace: 'default',
    },
    {
      scope: 'Namespace',
      user: 'yunwansu@acornsoft.io',
      clusterRole: 'namespace-editor',
      namespace: 'default',
    },
  ];

  return (
    <Stack className={style.marginX30}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <FormControl sx={{ width: '192px', height: '62px', marginRight: '30px' }}>
          <Select variant="outlined" size="small" value={rbacSelect} onChange={(e) => setRbacSelect(e.target.value)}>
            {map(rbacTypes, (rbacType) => (
              <MenuItem
                value={rbacType.value}
                key={rbacType.value}
                sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                {rbacType.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', gap: '20px' }}>
          {eq(rbacSelect, rbacTypes[0].value) && (
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{
                height: '45px',
                color: 'white',
                fontSize: '16px',
                textTransform: 'none',
              }}
            >
              <strong>Add Service Account</strong>
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              height: '45px',
              color: 'white',
              fontSize: '16px',
              textTransform: 'none',
            }}
          >
            <strong>Add Binding</strong>
          </Button>
        </Box>
      </Box>
      <Box>
        {eq(rbacSelect, rbacTypes[0].value) && <RbacServiceAccountContent />}
        {eq(rbacSelect, rbacTypes[1].value) && <RbacUserContent rbacUserData={rbacUserData} />}
        {eq(rbacSelect, rbacTypes[2].value) && <RbacGroupContent rbacGroupData={[]} />}
      </Box>
    </Stack>
  );
};

const AddonTabContent = () => (
  <Stack className={style.marginX30}>
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button variant="outlined" startIcon={<Add />}>
        Install Addon
      </Button>
    </Box>
    <Box sx={{ display: 'flex' }}>
      <AddonButton logoSrc={NodeExporter} />
    </Box>
  </Stack>
);

interface AddonButtonProps {
  logoSrc: string;
}

const AddonButton: React.FC<AddonButtonProps> = ({ logoSrc }) => (
  <Box className={style.addonBtnContainer}>
    <Box className={style.addonLogoContainer}>
      <img className={style.addonLogo} src={logoSrc} alt={logoSrc} />
    </Box>
    <Box className={style.addonActionContainer}>
      <MoreVert />
    </Box>
  </Box>
);

const ApplicationsTabContent = () => (
  <Stack className={style.marginX30}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <p style={{ flex: '1' }}>
        Install third party Applications into a cluster,{' '}
        <Link sx={{ display: 'inline-flex', alignItems: 'center' }}>
          learn more about Applicaitons
          <OpenInNew sx={{ fontSize: 15 }} />.
        </Link>
      </p>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          gap: '10px',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography className={style.marginRight5}>Show System Applications</Typography>
          <Switch className={style.iosSwitch} defaultChecked />
        </Box>
        <Button variant="outlined" startIcon={<Add />} size="large" sx={{ height: '50px' }}>
          <Typography variant="caption">Add Application</Typography>
        </Button>
      </Box>
    </Box>
    <Box sx={{ marginTop: '20px', textAlign: 'center' }}>
      <Typography variant="body2">No applications added.</Typography>
    </Box>
  </Stack>
);

const RbacServiceAccountContent = () => <Typography align="center">No service accounts available.</Typography>;

interface RbacUser {
  scope: string;
  user: string;
  clusterRole: string;
  namespace?: string;
}

interface RbacUserContentProps {
  rbacUserData: RbacUser[];
}

const RbacUserContent: React.FC<RbacUserContentProps> = ({ rbacUserData }) => {
  const columnHelper = createColumnHelper<RbacUser>();

  const rbacUserTableColumns = [
    columnHelper.accessor('scope', {
      header: () => (
        <TableSortLabel active={true} direction={'asc'}>
          Scope
        </TableSortLabel>
      ),
    }),
    columnHelper.accessor('user', { header: 'User' }),
    columnHelper.accessor('clusterRole', { header: 'Cluster Role' }),
    columnHelper.accessor('namespace', { header: 'Namespace' }),
    columnHelper.display({
      id: 'action',
      cell: () => (
        <IconButton>
          <DeleteOutline className={style.actionIcon} />
        </IconButton>
      ),
    }),
  ];

  return <RbacTable data={rbacUserData} columns={rbacUserTableColumns} />;
};

interface RbacGroup {
  scope: string;
  group: string;
  clusterRole: string;
  namespace?: string;
}

interface RbacGroupContentProps {
  rbacGroupData: RbacGroup[];
}

const RbacGroupContent: React.FC<RbacGroupContentProps> = ({ rbacGroupData }) => {
  const columnHelper = createColumnHelper<RbacGroup>();

  const rbacGroupTableColumns = [
    columnHelper.accessor('scope', {
      header: () => (
        <TableSortLabel active={true} direction={'asc'}>
          Scope
        </TableSortLabel>
      ),
    }),
    columnHelper.accessor('group', { header: 'Group' }),
    columnHelper.accessor('clusterRole', { header: 'Cluster Role' }),
    columnHelper.accessor('namespace', { header: 'Namespace' }),
    columnHelper.display({
      id: 'action',
      cell: () => (
        <IconButton>
          <DeleteOutline className={style.actionIcon} />
        </IconButton>
      ),
    }),
  ];

  return <RbacTable data={rbacGroupData} columns={rbacGroupTableColumns} emptyMessage="No bindings available." />;
};

interface RbacTableProps {
  data: any[];
  columns: any[];
  emptyMessage?: string;
}

const RbacTable: React.FC<RbacTableProps> = ({ data, columns, emptyMessage = 'No data available' }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <TableContainer className={clsx(style.table, style.paddingY30)} sx={{ marginTop: '0px !important' }}>
      <Table aria-label="tenant-control-plane table">
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow className={style.row} key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className={style.row}>
              <TableCell colSpan={columns.length} align="center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
