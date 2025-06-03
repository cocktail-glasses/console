import * as React from 'react';
import { useNavigate } from 'react-router';

import { useAtom } from 'jotai';

import UnfoldMoreRoundedIcon from '@mui/icons-material/UnfoldMoreRounded';
import MuiListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { styled } from '@mui/material/styles';

import { filter, get, has, isEmpty, isUndefined, keyBy, map, pickBy, size, toPairs } from 'lodash';

import './sidebar.scss';

import { Loader } from '@components/common';
import { Icon } from '@iconify/react';
import { useCluster } from '@lib/k8s';
import {
  ClusterOpenClusterManagementIoV1Api as OCMClusterAPI,
  IoOpenClusterManagementClusterV1ManagedCluster as ManagedCluster,
} from '@lib/ocm/Cluster';
import { GatewayOpenClusterManagementIoV1alpha1Api as ClusterGatewayAPI } from '@lib/ocm/ClusterGateway';
import { clusterAtom, ClusterInfo, clustersAtom, isClusterNotSelect, mainClusterKey } from '@lib/stores/cluster';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';

interface ClusterChooserProps {
  fullWidth: boolean;
}

export default function ClusterChooser({ fullWidth }: ClusterChooserProps) {
  const clusterInURL = useCluster();
  const [cluster, setCluster] = useAtom(clusterAtom);
  const [clusters, setClusters] = useAtom(clustersAtom);
  const navigate = useNavigate();

  const isSingleCluster = size(clusters) == 1;

  React.useEffect(() => {
    if (isEmpty(clusterInURL)) return;
    if (isClusterNotSelect(cluster)) {
      setCluster(clusterInURL!);
    }
  }, [cluster, clusterInURL]);

  const versionQuery = useQuery({
    queryKey: ['cluster-version'],
    queryFn: async () => await fetch('/k8s/version').then((res) => res.json()),
  });

  React.useEffect(() => {
    if (isUndefined(versionQuery.data)) return;

    const mainClusterVersion = get(versionQuery.data, 'gitVersion', '') as string;
    setClusters({ [mainClusterKey]: { version: mainClusterVersion } });
  }, [versionQuery.data]);

  const clusterGatewaysQuery = useQuery({
    queryKey: ['cluster-gateway'],
    queryFn: async () => {
      const ocmClusterAIP = new OCMClusterAPI(undefined, '/k8s');
      const clusterGatewayAPI = new ClusterGatewayAPI(undefined, '/k8s');

      const clusterGateways = await clusterGatewayAPI.listGatewayOpenClusterManagementIoV1alpha1ClusterGateway();
      const managedClusters = await ocmClusterAIP.listClusterOpenClusterManagementIoV1ManagedCluster();

      const clusterGatewaysItems = get(clusterGateways, 'data.items', []);
      const managedClustersItems = get(managedClusters, 'data.items', []);

      const byName = keyBy(clusterGatewaysItems, 'metadata.name');

      const filteredManagedClusters = filter(
        managedClustersItems,
        (managedCluster: ManagedCluster) =>
          has(managedCluster, 'metadata.name') && has(byName, get(managedCluster, 'metadata.name') as string)
      );

      return map(filteredManagedClusters, (managedCluster: ManagedCluster) => ({
        name: get(managedCluster, 'metadata.name', ''),
        isManagedCluster: true,
        version: get(managedCluster, 'status.version.kubernetes', '') as string,
      }));
    },
    refetchInterval: 5000,
  });

  React.useEffect(() => {
    if (isUndefined(clusterGatewaysQuery.data)) return;

    setClusters(keyBy(clusterGatewaysQuery.data, (r: ClusterInfo) => r.name));
  }, [clusterGatewaysQuery.data]);

  const handleChange = (event: SelectChangeEvent) => {
    const selectedCluster = event.target.value as string;
    setCluster(selectedCluster);
    navigate(`/clusters/${selectedCluster}/cluster`);
  };

  if (isSingleCluster)
    return (
      <ClusterItem
        clusterName={mainClusterKey}
        description={get(clusters, `${mainClusterKey}.version`, '') as string}
      />
    );

  return (
    <Select
      labelId="select-content-label"
      id="select-content"
      className={clsx('selectContent', { collapse: !fullWidth })}
      value={cluster}
      onChange={handleChange}
      displayEmpty
      inputProps={{ 'aria-label': 'Select cluster' }}
      fullWidth
      SelectDisplayProps={{ className: 'SelectDisplayProps', id: 'select-content-selected' }}
      IconComponent={React.forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => (
        <UnfoldMoreRoundedIcon fontSize="small" {...props} ref={ref} />
      ))}
      MenuProps={{
        PaperProps: {
          className: 'select-content-menu',
        },
      }}
    >
      <ListSubheader className="select-content-subheader" sx={{ fontSize: '12px' }}>
        Hub Cluster
      </ListSubheader>
      <MenuItem value={mainClusterKey} sx={{ borderRadius: '8px' }}>
        <ClusterItem
          clusterName={mainClusterKey}
          description={get(clusters, `${mainClusterKey}.version`, '') as string}
        />
      </MenuItem>

      {!isSingleCluster && [
        <ListSubheader className="select-content-subheader" sx={{ fontSize: '12px' }}>
          Managed Clusters
        </ListSubheader>,
        ...toPairs(pickBy(clusters, (cluster: ClusterInfo) => cluster.isManagedCluster)).map(
          ([clusterKey, clusterInfo]: [clusterKey: string, clusterInfo: ClusterInfo]) => (
            <MenuItem value={clusterKey} sx={{ borderRadius: '8px' }} key={clusterKey}>
              <ClusterItem clusterName={clusterKey} description={get(clusterInfo, 'version', '') as string} />
            </MenuItem>
          )
        ),
      ]}
    </Select>
  );
}

const ListItemAvatar = styled(MuiListItemAvatar)({
  minWidth: 0,
  marginRight: 12,
});

const ClusterItem = ({ clusterName, description = '' }: { clusterName: string; description?: string }) => (
  <>
    <ListItemAvatar sx={{ alignContent: 'center' }}>
      <Icon icon={'mdi:kubernetes'} width={'2em'} height={'2em'} color="#4456a6" />
    </ListItemAvatar>
    <ListItemText
      primary={clusterName}
      secondary={description}
      slotProps={{ primary: { fontWeight: 'bold', fontSize: '14px' }, secondary: { fontSize: '12px' } }}
    />
  </>
);
