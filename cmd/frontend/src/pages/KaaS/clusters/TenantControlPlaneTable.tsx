import { useMemo } from 'react';
import { useNavigate } from 'react-router';

import { Box } from '@mui/material';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { identity, toLower } from 'lodash';

import { DotStatus } from '../../../components/atoms/KaaS/DotStatus';
import { getDotStatus } from './utils';

import DeleteIconButton from '@components/molecules/KaaS/Button/DeleteIconButton/DeleteIconButton';
import Table from '@components/molecules/KaaS/Table/Table';
import { IoClastixKamajiV1alpha1TenantControlPlane } from '@lib/kamaji';
import { CellContext, createColumnHelper, Row } from '@tanstack/react-table';

interface TenantControlPlaneTableProps {
  tenantControlPlanes: IoClastixKamajiV1alpha1TenantControlPlane[];
  search?: string;
  onClickDelete: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    tenantControlPlane: IoClastixKamajiV1alpha1TenantControlPlane
  ) => void;
  isLoading?: boolean;
}

const TenantControlPlaneTable = ({
  tenantControlPlanes,
  search,
  onClickDelete = identity,
  isLoading,
}: TenantControlPlaneTableProps) => {
  dayjs.extend(relativeTime);

  const navigate = useNavigate();
  const handleRowClick = (row: Row<IoClastixKamajiV1alpha1TenantControlPlane>) => {
    const metadata = row.original.metadata;
    navigate(`/kaas/clusters/${metadata?.namespace}/${metadata?.name}`);
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
      columnHelper.display({
        id: 'delete-cluster',
        cell: (props) => <DeleteIconButton onClick={(e: Event) => onClickDelete(e, props.row.original)} />,
      }),
    ],
    []
  );

  return (
    <Table
      data={tenantControlPlanes}
      columns={columns}
      filter
      searchValue={search}
      onClickRow={handleRowClick}
      isLoading={isLoading}
    />
  );
};

export default TenantControlPlaneTable;
