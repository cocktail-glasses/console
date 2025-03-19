import { useEffect, useState, useRef, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { Paper, Typography } from '@mui/material';

import isUndefined from 'lodash/isUndefined';

import commonStyle from './Common.module.scss';
import DeleteClusterDialog, { DeleteClusterForm } from './DeleteClusterDialog';
import style from './List.module.scss';
import TenantControlPlaneTable from './TenantControlPlaneTable';

import AddButton from '@components/molecules/KaaS/Button/AddButton/AddButton';
import TableHeader from '@components/organisms/KaaS/TableHeader/TableHeader';
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

  return (
    <Paper className={clsx(commonStyle.mainContainer, style.mainContainer)}>
      <Typography variant="h6" className={commonStyle.title}>
        KaaS 클러스터 관리
      </Typography>
      <ListContent tenantControlPlanes={tenantControlPlanes} isLoading={isLoading} />
    </Paper>
  );
}

interface ListContentProp {
  tenantControlPlanes?: IoClastixKamajiV1alpha1TenantControlPlaneList;
  isLoading?: boolean;
}

const ListContent = ({ tenantControlPlanes, isLoading }: ListContentProp) => {
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

  const [search, setSearch] = useState('');
  const handleChangeSearch = (_: ChangeEvent, v: string) => setSearch(v);

  const navigate = useNavigate();
  const handleCreateClick = () => navigate('/kaas/clusters/create');

  return (
    <>
      <TableHeader
        search={search}
        onChangeSearch={handleChangeSearch}
        actions={
          <AddButton label="Create Cluster" onClick={handleCreateClick} className={commonStyle.kaasPrimaryColor} />
        }
      />
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
