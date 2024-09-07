import { Children, Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { generatePath } from 'react-router';
import { useNavigate } from 'react-router-dom';

import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { isNull } from 'lodash';

import ActionButton from '@components/common/ActionButton';
import { DialogTitle } from '@components/common/Dialog.tsx';
import ErrorBoundary from '@components/common/ErrorBoundary';
import Loader from '@components/common/Loader.tsx';
import ClusterChooser from './ClusterChooser.tsx';
import ClusterChooserPopup from './ClusterChooserPopup.tsx';

import helpers from '@helpers';
import { Icon, InlineIcon } from '@iconify/react';
import { AppLogo } from '@lib/App/AppLogo.tsx';
import { useClustersConf } from '@lib/k8s';
import { Cluster } from '@lib/k8s/cluster.ts';
import { createRouteURL } from '@lib/router.tsx';
import { getCluster, getClusterPrefixedPath } from '@lib/util.ts';
import { setVersionDialogOpen } from 'redux/actions/actions.tsx';
import { useTypedSelector } from 'redux/reducers/reducers.tsx';

export interface ClusterTitleProps {
  clusters?: {
    [clusterName: string]: Cluster;
  };
  cluster?: string;
  onClick?: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export function ClusterTitle(props: ClusterTitleProps) {
  const { cluster, clusters, onClick } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const arePluginsLoaded = useTypedSelector((state) => state.plugins.loaded);
  // const ChooserButton = useTypedSelector(state => state.ui.clusterChooserButtonComponent);
  const ChooserButton = null;
  useHotkeys(
    'ctrl+shift+l',
    () => {
      setAnchorEl(buttonRef.current);
    },
    { preventDefault: true }
  );

  if (!cluster) {
    return null;
  }

  if (!arePluginsLoaded || isNull(ChooserButton)) {
    return null;
  }

  if (!ChooserButton && Object.keys(clusters || {}).length <= 1) {
    return null;
  }

  return (
    <ErrorBoundary>
      <>
        {/* {ChooserButton ? (
          isValidElement(ChooserButton) ? (
            ChooserButton
          ) : (
            <ChooserButton
              clickHandler={(e: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined) => {
                onClick && onClick(e);
                e?.currentTarget && setAnchorEl(e.currentTarget);
              }}
              cluster={cluster}
            />
          )
        ) : ( */}
        <ClusterChooser
          ref={buttonRef}
          clickHandler={(e) => {
            onClick && onClick(e);
            e?.currentTarget && setAnchorEl(e.currentTarget);
          }}
          cluster={cluster}
        />
        {/* )} */}
        <ClusterChooserPopup anchor={anchorEl} onClose={() => setAnchorEl(null)} />
      </>
    </ErrorBoundary>
  );
}

interface ClusterButtonProps extends React.PropsWithChildren<{}> {
  cluster: Cluster;
  onClick?: (...args: any[]) => void;
  focusedRef?: (node: any) => void;
}

function ClusterButton(props: ClusterButtonProps) {
  const theme = useTheme();
  const { cluster, onClick = undefined, focusedRef } = props;

  return (
    <ButtonBase focusRipple ref={focusedRef} onClick={onClick}>
      <Card
        sx={{
          width: 128,
          height: 115,
          paddingTop: '10%',
        }}
      >
        <CardContent
          sx={{
            textAlign: 'center',
            paddingTop: 0,
          }}
        >
          <Icon icon="mdi:kubernetes" width="50" height="50" color={theme.palette.primaryColor} />
          <Typography
            color="textSecondary"
            gutterBottom
            sx={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              display: 'block',
            }}
            title={cluster.name}
          >
            {cluster.name}
          </Typography>
        </CardContent>
      </Card>
    </ButtonBase>
  );
}

interface ClusterListProps {
  clusters: Cluster[];
  onButtonClick: (cluster: Cluster) => void;
}

function ClusterList(props: ClusterListProps) {
  const { clusters, onButtonClick } = props;
  const theme = useTheme();
  const focusedRef = useCallback((node: any) => {
    if (node !== null) {
      node.focus();
    }
  }, []);
  const { t } = useTranslation();
  const recentClustersLabelId = 'recent-clusters-label';
  const maxRecentClusters = 3;
  // We slice it here for the maximum recent clusters just for extra safety, since this
  // is an entry point to the rest of the functionality
  const recentClusterNames = helpers.getRecentClusters().slice(0, maxRecentClusters);

  let recentClusters: Cluster[] = [];

  // If we have more than the maximum number of recent clusters allowed, we show the most
  // recent ones. Otherwise, just show the clusters in the order they are received.
  if (clusters.length > maxRecentClusters) {
    // Get clusters matching the recent cluster names, if they exist still.
    recentClusters = recentClusterNames
      .map((name) => clusters.find((cluster) => cluster.name === name))
      .filter((item) => !!item) as Cluster[];
    // See whether we need to fill with new clusters (when the recent clusters were less than the
    // maximum/wanted).
    const neededClusters = maxRecentClusters - recentClusters.length;
    if (neededClusters > 0) {
      recentClusters = recentClusters.concat(
        clusters.filter((item) => !recentClusters.includes(item)).slice(0, neededClusters)
      );
    }
  } else {
    recentClusters = clusters;
  }

  return (
    <Container style={{ maxWidth: '500px', paddingBottom: theme.spacing(2) }}>
      <Grid container direction="column" alignItems="stretch" justifyContent="space-between" spacing={4}>
        {recentClusters.length !== clusters.length && (
          <Grid item>
            <Typography align="center" id={recentClustersLabelId}>
              {t('translation|Recent clusters')}
            </Typography>
          </Grid>
        )}
        <Grid
          aria-labelledby={`#${recentClustersLabelId}`}
          item
          container
          alignItems="center"
          justifyContent={clusters.length > maxRecentClusters ? 'space-between' : 'center'}
          spacing={2}
        >
          {recentClusters.map((cluster, i) => (
            <Grid item key={cluster.name}>
              <ClusterButton
                focusedRef={i === 0 ? focusedRef : undefined}
                cluster={cluster}
                onClick={() => onButtonClick(cluster)}
              />
            </Grid>
          ))}
        </Grid>
        {clusters.length > 3 && (
          <Grid item xs={12}>
            <Autocomplete
              id="cluster-selector-autocomplete"
              options={clusters}
              getOptionLabel={(option) => option.name}
              style={{ width: '100%' }}
              disableClearable
              autoComplete
              includeInputInList
              openOnFocus
              renderInput={(params) => (
                <TextField {...params} label={t('translation|All clusters')} variant="outlined" />
              )}
              onChange={(_event, cluster) => onButtonClick(cluster)}
            />
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

interface ClusterDialogProps extends React.PropsWithChildren<Omit<DialogProps, 'open' | 'onClose'>> {
  open?: boolean;
  onClose?: (() => void) | null;
  useCover?: boolean;
  showInfoButton?: boolean;
}

export function ClusterDialog(props: ClusterDialogProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { open, onClose = null, useCover = false, showInfoButton = true, children = [], ...otherProps } = props;
  // Only used if open is not provided
  const [show, setShow] = useState(true);
  const dispatch = useDispatch();

  function handleClose() {
    if (onClose !== null) {
      onClose();
      return;
    }

    // Only use show if open is not provided
    if (open === undefined) {
      setShow(false);
    }
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open !== undefined ? open : show}
      onClose={handleClose}
      sx={
        useCover
          ? {
              background: theme.palette.common.black,
            }
          : {}
      }
      {...otherProps}
    >
      <DialogTitle
        sx={{
          background: theme.palette.common.black,
          textAlign: 'center',
          alignItems: 'center',
          display: 'flex',
        }}
        buttons={[
          showInfoButton && (
            <IconButton
              aria-label={t('Show build information')}
              onClick={() => {
                handleClose();
                dispatch(setVersionDialogOpen(true));
              }}
              size="small"
            >
              <InlineIcon icon={'mdi:information-outline'} color={theme.palette.primary.contrastText} />
            </IconButton>
          ),
        ]}
      >
        <AppLogo
          logoType={'large'}
          sx={{
            height: '32px',
            width: 'auto',
          }}
          themeName="dark"
        />
      </DialogTitle>
      <DialogContent
        sx={{
          [theme.breakpoints.up('sm')]: {
            minWidth: 500,
          },
          '& .MuiTypography-h4': {
            textAlign: 'center',
            fontSize: '2.2rem',
            color: theme.palette.primaryColor,
            paddingTop: theme.spacing(3),
            paddingBottom: theme.spacing(3),
          },
        }}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}

function Chooser(props: ClusterDialogProps) {
  const navigate = useNavigate();
  const clusters = useClustersConf();
  const { open = null, onClose, children = [], ...otherProps } = props;
  // Only used if open is not provided
  const [show, setShow] = useState(props.open);
  const { t } = useTranslation();

  useEffect(
    () => {
      if (open !== null && open !== show) {
        setShow(open);
        return;
      }

      // If we only have one cluster configured, then we skip offering
      // the choice to the user.
      if (!!clusters && Object.keys(clusters).length === 1) {
        handleButtonClick(Object.values(clusters)[0]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [open, show, clusters]
  );

  function handleButtonClick(cluster: Cluster) {
    if (cluster.name !== getCluster()) {
      helpers.setRecentCluster(cluster);
      navigate(
        generatePath(getClusterPrefixedPath(), {
          cluster: cluster.name,
        }),
        { replace: true }
      );
    }

    setShow(false);

    if (!!onClose) {
      onClose();
    }
  }

  function handleClose() {
    if (open === null) {
      setShow(false);
    }

    if (!!onClose) {
      onClose();
    }
  }

  const clusterList = Object.values(clusters || {});
  if (!show) {
    return null;
  }

  return (
    <Box component="main">
      <ClusterDialog
        open={show}
        onClose={onClose || handleClose}
        aria-labelledby="chooser-dialog-title"
        aria-busy={clusterList.length === 0 && clusters === null}
        {...otherProps}
      >
        <DialogTitle id="chooser-dialog-title" focusTitle>
          {t('Choose a cluster')}
        </DialogTitle>

        {clusterList.length === 0 ? (
          <Fragment>
            {clusters === null ? (
              <>
                <DialogContentText>{t('Wait while fetching clusters…')}</DialogContentText>
                <Loader title={t('Loading cluster information')} />
              </>
            ) : (
              <>
                <DialogContentText>{t('There seems to be no clusters configured…')}</DialogContentText>
                <DialogContentText>{t('Please make sure you have at least one cluster configured.')}</DialogContentText>
              </>
            )}
          </Fragment>
        ) : (
          <ClusterList clusters={clusterList} onButtonClick={handleButtonClick} />
        )}
        {Children.toArray(children).length > 0 && (
          <DialogActions>
            <Grid container direction="row" justifyContent="space-between" alignItems="center">
              {Children.toArray(children).map((child, index) => (
                <Grid item key={index}>
                  {child}
                </Grid>
              ))}
            </Grid>
          </DialogActions>
        )}
      </ClusterDialog>
    </Box>
  );
}

export default Chooser;
