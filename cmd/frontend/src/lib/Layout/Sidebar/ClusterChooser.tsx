import * as React from 'react';
import { generatePath, useNavigate } from 'react-router';

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

import './sidebar.scss';

import { getClusterPrefixedPath } from '@lib/cluster';
import { KubeObject } from '@lib/k8s/KubeObject';
import clsx from 'clsx';

interface ClusterChooserProps {
  fullWidth: boolean;
}

export default function ClusterChooser({ fullWidth }: ClusterChooserProps) {
  const [clusters, setClusters] = React.useState<string[]>([]);
  const [cluster, setCluster] = React.useState<string>('hub');
  const navigate = useNavigate();

  React.useEffect(() => {
    // TODO 실패한 경우를 고려하면 실패시 재시도, 데이터 캐싱 처리 해주는 tanstack-query를 쓰는게 맘 편하다.
    fetch('/k8s/apis/gateway.open-cluster-management.io/v1alpha1/clustergateways')
      .then((res) => res.json())
      .then((res) => setClusters(res.items.map((cluster: KubeObject) => cluster.metadata.name)));
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    const selectedCluster = event.target.value as string;

    setCluster(selectedCluster);

    const url =
      selectedCluster !== 'hub'
        ? generatePath('/' + getClusterPrefixedPath() + '/cluster', { cluster: selectedCluster })
        : generatePath('/cluster');

    navigate(url);
  };

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
      <MenuItem value="hub" sx={{ borderRadius: '8px' }}>
        <ClusterItem clusterName="hub" description="in-cluster" />
      </MenuItem>

      <ListSubheader className="select-content-subheader" sx={{ fontSize: '12px' }}>
        Managed Clusters
      </ListSubheader>
      {clusters.map((cluster) => (
        <MenuItem value={cluster} sx={{ borderRadius: '8px' }} key={cluster}>
          <ClusterItem clusterName={cluster} description={`managed cluster ${cluster}`} />
        </MenuItem>
      ))}
    </Select>
  );
}

const ListItemAvatar = styled(MuiListItemAvatar)({
  minWidth: 0,
  marginRight: 12,
});

const Avatar = styled(MuiAvatar)(({ theme }) => ({
  width: 28,
  height: 28,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.secondary,
  border: `1px solid ${theme.palette.divider}`,
}));

const ClusterItem = ({ clusterName, description = '' }: { clusterName: string; description?: string }) => (
  <>
    <ListItemAvatar>
      <Avatar alt="Sitemark web">
        <DevicesRoundedIcon sx={{ fontSize: '1rem' }} />
      </Avatar>
    </ListItemAvatar>
    <ListItemText
      primary={clusterName}
      secondary={description}
      slotProps={{ primary: { fontWeight: 'bold', fontSize: '14px' }, secondary: { fontSize: '12px' } }}
    />
  </>
);
