import * as React from 'react';
import { useNavigate } from 'react-router';

import { useAtom } from 'jotai';

import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import UnfoldMoreRoundedIcon from '@mui/icons-material/UnfoldMoreRounded';
import MuiAvatar from '@mui/material/Avatar';
import MuiListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { styled } from '@mui/material/styles';

import { get, has, keyBy, keys, pickBy, size } from 'lodash';

import './sidebar.scss';

import { Icon } from '@iconify/react';
import {
  GatewayOpenClusterManagementIoV1alpha1Api as ClusterGatewayAPI,
  ComGithubKlusterManagerClusterGatewayPkgApisGatewayV1alpha1ClusterGateway as ClusterGateway,
} from '@lib/ocm/ClusterGateway';
import { clusterAtom, ClusterInfo, clustersAtom, mainClusterKey } from '@lib/stores/cluster';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';

interface ClusterChooserProps {
  fullWidth: boolean;
}

export default function ClusterChooser({ fullWidth }: ClusterChooserProps) {
  const [cluster, setCluster] = useAtom(clusterAtom);
  const [clusters, setClusters] = useAtom(clustersAtom);
  const navigate = useNavigate();

  const isSingleCluster = size(clusters) == 1;

  const { data: clusterGateways } = useQuery({
    queryKey: ['cluster-gateway'],
    queryFn: async () => {
      const clusterGatewayAPI = new ClusterGatewayAPI(undefined, '/k8s');
      return await clusterGatewayAPI.listGatewayOpenClusterManagementIoV1alpha1ClusterGateway();
    },
    refetchInterval: 5000,
  });

  React.useEffect(() => {
    const items = get(clusterGateways, 'data.items', []);
    const result = items
      .filter((item: ClusterGateway) => has(item, 'metadata.name'))
      .map<ClusterInfo>((item: ClusterGateway) => ({
        name: get(item, 'metadata.name')!,
        isManagedCluster: true,
        version: 'v1.30.13',
      }));

    setClusters(keyBy(result, (r: ClusterInfo) => r.name));
  }, [clusterGateways]);

  const handleChange = (event: SelectChangeEvent) => {
    const selectedCluster = event.target.value as string;
    setCluster(selectedCluster);
    navigate(`/clusters/${selectedCluster}/cluster`);
  };

  if (isSingleCluster) return <ClusterItem clusterName={mainClusterKey} description="in-cluster" />;

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
        <ClusterItem clusterName={mainClusterKey} description={'v1.30.13'} />
      </MenuItem>

      {!isSingleCluster && [
        <ListSubheader className="select-content-subheader" sx={{ fontSize: '12px' }}>
          Managed Clusters
        </ListSubheader>,
        ...keys(pickBy(clusters, (cluster: ClusterInfo) => cluster.isManagedCluster)).map((clusterKey: string) => (
          <MenuItem value={clusterKey} sx={{ borderRadius: '8px' }} key={clusterKey}>
            <ClusterItem clusterName={clusterKey} description={'v1.31.0'} />
          </MenuItem>
        )),
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
