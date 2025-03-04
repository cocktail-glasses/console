import { useEffect, useState, Dispatch, SetStateAction, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { Add } from '@mui/icons-material';
import { Box, Button, Paper } from '@mui/material';

import isUndefined from 'lodash/isUndefined';

import DeleteClusterDialog, { DeleteClusterForm } from './DeleteClusterDialog';
import style from './List.module.scss';
import TenantControlPlaneTable from './TenantControlPlaneTable';
import './common.scss';
import Searchbar from './component/Searchbar/Searchbar';

import {
  KamajiClastixIoV1alpha1Api as KamajiAPI,
  IoClastixKamajiV1alpha1TenantControlPlaneList,
  IoClastixKamajiV1alpha1TenantControlPlane,
} from '@lib/kamaji';
import clsx from 'clsx';

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

  const navigate = useNavigate();
  const handleCreateClick = () => navigate('/kaas/clusters/create');

  return (
    <Paper className={clsx('main-container', style.mainContainer)}>
      <h2>KaaS 클러스터 관리</h2>
      <ListMenu search={search} handleSearch={setSearch} handleCreateClick={handleCreateClick} />
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
    <Box className={style.menuContainer}>
      <Searchbar value={search} onChange={(_, value) => handleSearch(value)} />
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
  // delete cluster dialog
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [cluster, setCluster] = useState<IoClastixKamajiV1alpha1TenantControlPlane>();
  const handleOpenDialog = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    cluster: IoClastixKamajiV1alpha1TenantControlPlane
  ) => {
    e.stopPropagation();
    setCluster(cluster);
    setIsOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setIsOpenDialog(false);
  };

  const handleDeleteCluster = (deleteClusterOptions: DeleteClusterForm) => {
    console.log('delete cluster ', cluster, deleteClusterOptions);
    handleCloseDialog();
  };

  return (
    <>
      <TenantControlPlaneTable
        tenantControlPlanes={tenantControlPlanes?.items || []}
        search={search}
        onClickDelete={handleOpenDialog}
        isLoading={isLoading}
      />
      <DeleteClusterDialog
        isOpen={isOpenDialog}
        onClose={handleCloseDialog}
        clusterName={cluster?.metadata?.name || ''}
        onDelete={handleDeleteCluster}
      />
    </>
  );
};
