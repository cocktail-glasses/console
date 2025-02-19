import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import BoxBoader from '@components/atoms/Box/BoxBoader';
// import { useQuery } from '@tanstack/react-query';
import { Link, SectionBox, SectionFilterHeader } from '@components/common';
import ResourceTable from '@components/common/Resource/ResourceTable';
import { Icon } from '@iconify/react';
import { apiRequest } from '@lib/api/api';
import { cocktailApi } from '@lib/api/constants';
// import { deleteCluster } from '@lib/k8s/apiProxy';
import { Cluster } from '@lib/k8s/cluster';
import { createRouteURL } from '@lib/router';
import { useId } from '@lib/util';


function ClusterStatus({ error }: { error?: string | null }) {
  const { t } = useTranslation(['translation']);
  const theme = useTheme();
  console.log('ClusterStatus', error);
  return (
    <Box width="fit-content">
      <Box display="flex" alignItems="center" justifyContent="center">
        {error !== 'RUNNING' ? (
          <Icon icon="mdi:cloud-off" width={16} color={theme.palette.home.status.error} />
        ) : (
          <Icon icon="mdi:cloud-check-variant" width={16} color={theme.palette.home.status.success} />
        )}
        <Typography
          variant="body2"
          style={{
            marginLeft: theme.spacing(1),
            color: error !== 'RUNNING' ? theme.palette.home.status.error : theme.palette.home.status.success,
          }}
        >
          {error !== 'RUNNING' ? '⋯' : t('translation|Active')}
        </Typography>
      </Box>
    </Box>
  );
}

function ContextMenu({ cluster }: { cluster: Cluster }) {
  const { t } = useTranslation(['translation']);
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuId = useId('context-menu');
  // const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);

  // function removeCluster(cluster: Cluster) {
  //   deleteCluster(cluster.name || '')
  //     .then(config => {
  //       dispatch(setConfig(config));
  //     })
  //     .catch((err: Error) => {
  //       if (err.message === 'Not Found') {
  //         // TODO: create notification with error message
  //       }
  //     })
  //     .finally(() => {
  //       navigate('/');
  //     });
  // }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  return (
    <>
      <IconButton
        size="small"
        onClick={(event: { currentTarget: React.SetStateAction<HTMLElement | null> }) => {
          setAnchorEl(event.currentTarget);
        }}
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-label={t('Actions')}
      >
        <Icon icon="mdi:more-vert" />
      </IconButton>
      <Menu
        id={menuId}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => {
          handleMenuClose();
        }}
      >
        <MenuItem
          onClick={() => {
            navigate(createRouteURL('cluster', { cluster: cluster.name }));
            handleMenuClose();
          }}
        >
          <ListItemText>{t('translation|View')}</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate(createRouteURL('settingsCluster', { cluster: cluster.name }));
            handleMenuClose();
          }}
        >
          <ListItemText>{t('translation|Settings')}</ListItemText>
        </MenuItem>
      </Menu>

      {/* <ConfirmDialog
        open={openConfirmDialog}
        handleClose={() => setOpenConfirmDialog(false)}
        onConfirm={() => {
          setOpenConfirmDialog(false);
          removeCluster(cluster);
        }}
        title={t('translation|Delete Cluster')}
        description={t(
          'translation|Are you sure you want to remove the cluster "{{ clusterName }}"?',
          {
            clusterName: cluster.name,
          }
        )}
      /> */}
    </>
  );
}
export default function Clusters() {
  const { t } = useTranslation(['glossary', 'translation']);
  const [data, setData] = useState<any>(null)
  useEffect(() => {
    apiRequest({
      ...cocktailApi.cluster.conditions,
      params: {
        accountSeq: 1,
        useK8s: false,
        usePvc: false,
        useSvc: false,
        useAddon: false,
        useCtrl: false,
        useFeatureGates: false,
        useWorkload: false,
        usePod: false,
        useNamespace: false,
        useQuota: false,
      },
    }).then((e) => {
      setData(e);
    });
  }, []);
  // const query = useQuery({
  //   queryKey: ['todos'],
  //   queryFn: () =>
  //     apiRequest({
  //       ...cocktailApi.cluster.conditions,
  //       params: {
  //         accountSeq: 1,
  //         useK8s: false,
  //         usePvc: false,
  //         useSvc: false,
  //         useAddon: false,
  //         useCtrl: false,
  //         useFeatureGates: false,
  //         useWorkload: false,
  //         usePod: false,
  //         useNamespace: false,
  //         useQuota: false,
  //       },
  //     }),
  // });
  // console.log('query', query);
  // const columns = [
  //   {
  //     header: 'Name',
  //     accessorKey: 'clusterName',
  //     enableResizing: true,
  //     enableColumnActions: false,
  //     gridTemplate: 'auto',
  //   },
  //   {
  //     header: 'Version',
  //     accessorKey: 'k8sVersion',
  //     enableResizing: true,
  //     enableColumnActions: false,
  //     gridTemplate: 'auto',
  //   },
  //   {
  //     header: 'Status',
  //     accessorKey: 'clusterState',
  //     enableResizing: true,
  //     enableColumnActions: false,
  //     gridTemplate: 'min-content',
  //   },
  // ];
  return (
    <SectionBox
      title={
        <SectionFilterHeader
          title="Clusters"
          noNamespaceFilter
          // actions={[<NotificationActionMenu />]}
        />
      }
    >
      <BoxBoader>
        <ResourceTable
          defaultSortingColumn={{ id: 'name', desc: false }}
          columns={[
            {
              id: 'name',
              label: t('Name'),
              getValue: (cluster: any) => cluster.clusterName,
              render: ({ clusterName, clusterId }) => (
                <Link routeName="cluster" params={{ cluster: clusterId }}>
                  {clusterName}
                </Link>
              ),
            },
            {
              label: t('Status'),
              getValue: (cluster) => cluster.clusterState,
              render: ({ clusterState }) => <ClusterStatus error={clusterState} />,
            },
            {
              label: t('glossary|Kubernetes Version'),
              getValue: (cluster) => cluster.k8sVersion,
            },
            {
              label: '',
              getValue: () => '',
              cellProps: {
                align: 'right',
              },
              sort: false,
              render: (cluster) => <ContextMenu cluster={cluster} />,
            },
          ]}
          data={data}
          id="headlamp-home-clusters"
        />
      </BoxBoader>
    </SectionBox>
  );
}
