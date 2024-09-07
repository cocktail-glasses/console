import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import RecentClusters from './RecentClusters.tsx';

import { Link, PageGrid, SectionBox, SectionFilterHeader } from '@components/common';

import ResourceTable from '@components/common/Resource/ResourceTable.tsx';
import helpers from '@helpers';
import { Icon } from '@iconify/react';
import { useClustersConf, useClustersVersion } from '@lib/k8s';
import { ApiError } from '@lib/k8s/apiProxy.ts';
import { Cluster } from '@lib/k8s/cluster.ts';
import Event from '@lib/k8s/event.ts';
import { createRouteURL } from '@lib/router.tsx';
import { useId } from '@lib/util.ts';

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
        {/* {helpers.isElectron() && cluster.meta_data?.source === 'dynamic_cluster' && (
          <MenuItem
            onClick={() => {
              setOpenConfirmDialog(true);
              handleMenuClose();
            }}
          >
            <ListItemText>{t('translation|Delete')}</ListItemText>
          </MenuItem>
        )} */}
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

function ClusterStatus({ error }: { error?: ApiError | null }) {
  const { t } = useTranslation(['translation']);
  const theme = useTheme();

  const stateUnknown = error === undefined;
  const hasReachError = error && error.status !== 401 && error.status !== 403;

  return (
    <Box width="fit-content">
      <Box display="flex" alignItems="center" justifyContent="center">
        {hasReachError ? (
          <Icon icon="mdi:cloud-off" width={16} color={theme.palette.home.status.error} />
        ) : stateUnknown ? (
          <Icon icon="mdi:cloud-question" width={16} color={theme.palette.home.status.unknown} />
        ) : (
          <Icon icon="mdi:cloud-check-variant" width={16} color={theme.palette.home.status.success} />
        )}
        <Typography
          variant="body2"
          style={{
            marginLeft: theme.spacing(1),
            color: hasReachError
              ? theme.palette.home.status.error
              : !stateUnknown
                ? theme.palette.home.status.success
                : undefined,
          }}
        >
          {hasReachError ? error.message : stateUnknown ? '⋯' : t('translation|Active')}
        </Typography>
      </Box>
    </Box>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const clusters = useClustersConf() || {};

  if (!helpers.isElectron() && Object.keys(clusters).length === 1) {
    navigate(createRouteURL('cluster', { cluster: Object.keys(clusters)[0] }));
    return null;
  }

  return <HomeComponent clusters={clusters} />;
}

interface HomeComponentProps {
  clusters: { [name: string]: Cluster };
}

function HomeComponent(props: HomeComponentProps) {
  const { clusters } = props;
  const { t } = useTranslation(['translation', 'glossary']);
  const [versions, errors] = useClustersVersion(Object.values(clusters));
  const maxWarnings = 50;
  const warningsMap = Event.useWarningList(Object.values(clusters).map((c) => c.name));

  function renderWarningsText(clusterName: string) {
    const numWarnings = (!!warningsMap[clusterName]?.error && -1) || (warningsMap[clusterName]?.warnings?.length ?? -1);

    if (numWarnings === -1) {
      return '⋯';
    }
    if (numWarnings >= maxWarnings) {
      return `${maxWarnings}+`;
    }
    return numWarnings;
  }

  return (
    <PageGrid>
      <SectionBox headerProps={{ headerStyle: 'main' }} title={t('Home')}>
        <RecentClusters clusters={Object.values(clusters)} onButtonClick={() => {}} />
      </SectionBox>
      <SectionBox title={<SectionFilterHeader title={t('All Clusters')} noNamespaceFilter headerStyle="subsection" />}>
        <ResourceTable
          defaultSortingColumn={{ id: 'name', desc: false }}
          columns={[
            {
              id: 'name',
              label: t('Name'),
              getValue: (cluster) => cluster.name,
              render: ({ name }) => (
                <Link routeName="cluster" params={{ cluster: name }}>
                  {name}
                </Link>
              ),
            },
            {
              label: t('Status'),
              getValue: (cluster) => cluster.name,
              render: ({ name }) => <ClusterStatus error={errors[name]} />,
            },
            {
              label: t('Warnings'),
              getValue: ({ name }) => renderWarningsText(name),
            },
            {
              label: t('glossary|Kubernetes Version'),
              getValue: ({ name }) => versions[name]?.gitVersion || '⋯',
            },
            {
              label: '',
              getValue: () => '',
              cellProps: {
                align: 'right',
              },
              render: (cluster) => <ContextMenu cluster={cluster} />,
            },
          ]}
          data={Object.values(clusters)}
          id="headlamp-home-clusters"
        />
      </SectionBox>
    </PageGrid>
  );
}
