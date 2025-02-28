import { useEffect, useState, Dispatch, SetStateAction, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';

import { Add, DeleteOutline, Close, Search } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  FormControlLabel,
  IconButton,
  Paper,
  TextField,
  InputAdornment,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import isUndefined from 'lodash/isUndefined';
import toLower from 'lodash/toLower';

import { DotStatus } from './component/DotStatus';
import './list.scss';
import { getDeleteClusterSchema } from './schemas';
import { getDotStatus } from './utils';

import {
  KamajiClastixIoV1alpha1Api as KamajiAPI,
  IoClastixKamajiV1alpha1TenantControlPlaneList,
  IoClastixKamajiV1alpha1TenantControlPlane,
} from '@lib/kamaji';
import {
  CellContext,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  Row,
  useReactTable,
} from '@tanstack/react-table';

export default function KaaSClusterList() {
  const [isLoading, setIsLoading] = useState(false);
  const [tenantControlPlanes, setTenantControlPlanes] = useState<IoClastixKamajiV1alpha1TenantControlPlaneList>();

  const websocket = useRef<null | WebSocket>();
  useEffect(() => {
    setIsLoading(true);
    const kamajiAPI = new KamajiAPI(undefined, '/k8s');
    kamajiAPI
      .listKamajiClastixIoV1alpha1TenantControlPlaneForAllNamespaces()
      .then((res) => {
        const resourceVersion = res.data.metadata?.resourceVersion;
        const url = new URL(res.request.responseURL || '');
        url.searchParams.append('watch', '1');
        if (!isUndefined(resourceVersion)) url.searchParams.append('resourceVersion', resourceVersion);

        const ws = new WebSocket(url.href);
        ws.onmessage = (e) => console.log(e.data);
        ws.onclose = () => console.log('close websocket for kamaji list');
        if (websocket.current) websocket.current.close();
        websocket.current = ws;

        return res;
      })
      .then((res) => res.data)
      .then((tcl) => setTenantControlPlanes(tcl))
      .finally(() => setIsLoading(false));

    return () => {
      if (websocket.current) websocket.current.close();
    };
  }, []);

  const [search, setSearch] = useState('');

  return (
    <Paper className="main-container">
      <h2>KaaS 클러스터 관리</h2>
      <ListMenu search={search} handleSearch={setSearch} />
      <ListTable tenantControlPlanes={tenantControlPlanes} search={search} isLoading={isLoading} />
    </Paper>
  );
}

interface ListMenuProp {
  search?: string;
  handleSearch: Dispatch<SetStateAction<string>>;
  handleCreateClick?: () => void;
}

const ListMenu: React.FC<ListMenuProp> = ({ search, handleSearch, handleCreateClick }) => {
  return (
    <Box className="menu-container">
      <TextField
        variant="outlined"
        size="small"
        placeholder="Search"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          },
        }}
      />
      <Button variant="contained" onClick={handleCreateClick} startIcon={<Add />}>
        Create Cluster
      </Button>
    </Box>
  );
};

interface ListTableProp {
  tenantControlPlanes?: IoClastixKamajiV1alpha1TenantControlPlaneList;
  search?: string;
  isLoading?: boolean;
}

const ListTable: React.FC<ListTableProp> = ({ tenantControlPlanes, search, isLoading }) => {
  dayjs.extend(relativeTime);

  const navigate = useNavigate();
  const handleRowClick = (row: Row<IoClastixKamajiV1alpha1TenantControlPlane>) => {
    const metadata = row.original.metadata;
    navigate(`/kaas/clusters/${metadata?.namespace}/${metadata?.name}`);
  };

  // delete cluster dialog
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [cluster, setCluster] = useState<IoClastixKamajiV1alpha1TenantControlPlane>();
  const handleDialogOpen = (e: Event, cluster: IoClastixKamajiV1alpha1TenantControlPlane) => {
    e.stopPropagation();
    setCluster(cluster);
    setIsOpenDialog(true);
  };
  const handleDialogClose = () => {
    setIsOpenDialog(false);
  };

  const handleDeleteCluster = (deleteClusterOptions: DeleteClusterForm) => {
    console.log('delete cluster ', cluster, deleteClusterOptions);
    handleDialogClose();
  };

  // tanstack-table example
  const statusCell = (info: CellContext<IoClastixKamajiV1alpha1TenantControlPlane, string | undefined>) => {
    const status = info.getValue();
    return (
      <Box sx={{ display: 'flex' }}>
        <DotStatus status={getDotStatus(toLower(status))} />
        {status}
      </Box>
    );
  };

  const ageCell = (info: CellContext<IoClastixKamajiV1alpha1TenantControlPlane, string | undefined>) =>
    dayjs(info.getValue()).fromNow();

  const podsAccessor = (row: IoClastixKamajiV1alpha1TenantControlPlane) => {
    const deployment = row.status?.kubernetesResources?.deployment;

    return `${deployment?.availableReplicas || 0} / ${deployment?.replicas || '-'}`;
  };

  const dataStorageAccessor = (row: IoClastixKamajiV1alpha1TenantControlPlane) => {
    const storage = row.status?.storage;

    return `${storage?.dataStoreName} (${storage?.driver})`;
  };

  const columnHelper = createColumnHelper<IoClastixKamajiV1alpha1TenantControlPlane>();
  const columns = useMemo(
    () => [
      columnHelper.accessor('metadata.name', { header: 'Name' }),
      columnHelper.accessor('metadata.namespace', { header: 'Namespace' }),
      columnHelper.accessor('status.kubernetesResources.version.status', {
        header: 'Status',
        cell: statusCell,
      }),
      columnHelper.accessor(podsAccessor, { header: 'Pods' }),
      columnHelper.accessor('status.controlPlaneEndpoint', {
        header: 'Endpoints',
      }),
      columnHelper.accessor('spec.kubernetes.version', { header: 'Version' }),
      columnHelper.accessor(dataStorageAccessor, {
        header: 'dataStorage (driver)',
      }),
      columnHelper.accessor('metadata.creationTimestamp', {
        header: 'Age',
        cell: ageCell,
      }),
    ],
    []
  );

  const table = useReactTable({
    data: tenantControlPlanes?.items || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  useEffect(() => {
    table.setGlobalFilter(search);
  }, [table, search]);

  return (
    <TableContainer className="table">
      <Table aria-label="tenant-control-plane table">
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableCell>
              ))}
              {/* empty for action */}
              <TableCell></TableCell>
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {isLoading && (
            <TableRow className="row">
              <TableCell colSpan={columns.length} align="center">
                <CircularProgress />
              </TableCell>
            </TableRow>
          )}
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow className="row" key={row.id} hover onClick={() => handleRowClick(row)}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
                <TableCell>
                  <IconButton aria-label="delete-cluster" onClick={(e) => handleDialogOpen(e, row.original)}>
                    <DeleteOutline className="action-icon" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="row">
              <TableCell colSpan={columns.length} align="center">
                No Result
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DeleteClusterDialog
        isOpen={isOpenDialog}
        handleClose={handleDialogClose}
        clusterName={cluster?.metadata?.name || ''}
        handleDelete={handleDeleteCluster}
      />
    </TableContainer>
  );
};

interface DeleteClusterDialogProp {
  isOpen: boolean;
  handleClose: () => void;
  handleDelete: (deleteClusterOptions: DeleteClusterForm) => void;
  clusterName: string;
}

interface DeleteClusterForm {
  clusterName: string;
  cleanupLoadBalancers: boolean;
  cleanupVolumes: boolean;
}

const DeleteClusterDialog: React.FC<DeleteClusterDialogProp> = ({ isOpen, handleClose, handleDelete, clusterName }) => {
  const {
    register,
    formState: { isValid },
    getValues,
    reset,
  } = useForm<DeleteClusterForm>({
    defaultValues: {
      clusterName: '',
    },
    resolver: zodResolver(getDeleteClusterSchema(clusterName)),
  });

  useEffect(() => {
    reset();
  }, [isOpen, reset]);

  return (
    <Dialog open={isOpen} onClose={handleClose} className="dialog">
      <DialogTitle>Delete Cluster</DialogTitle>
      <IconButton aria-label="close" className="close-btn" onClick={handleClose}>
        <Close />
      </IconButton>
      <DialogContent className="content">
        <Typography variant="body1">
          {`Delete `}
          <strong>{clusterName}</strong>
          {` cluster permanently?`}
        </Typography>

        <Box sx={{ marginTop: '8px', marginBottom: '15px !important' }}>
          <TextField variant="outlined" label="Cluster Name" required fullWidth {...register('clusterName')} />
        </Box>

        <FormControlLabel
          control={<Checkbox {...register('cleanupLoadBalancers')} />}
          label="Cleanup connected Load Balancers"
        />
        <FormControlLabel
          control={<Checkbox {...register('cleanupVolumes')} />}
          label="Cleanup connected volumes (dynamically provisioned PVs and PVCs)"
        />
      </DialogContent>
      <Divider />
      <DialogActions className="action-group">
        <Button
          className="action-button"
          variant="contained"
          size="large"
          startIcon={<DeleteOutline fontSize="large" />}
          onClick={() => handleDelete(getValues())}
          disabled={!isValid}
        >
          Delete Cluster
        </Button>
      </DialogActions>
    </Dialog>
  );
};
