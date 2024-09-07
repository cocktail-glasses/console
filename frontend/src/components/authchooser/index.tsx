import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { generatePath, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

import { isEqual } from 'lodash';

import { Link, Loader } from '@components/common';
import { DialogTitle } from '@components/common/Dialog.tsx';
import Empty from '@components/common/EmptyContent.tsx';
import helpers from '@helpers';
import { InlineIcon } from '@iconify/react';
import { useClustersConf } from '@lib/k8s';
import { testAuth } from '@lib/k8s/apiProxy.ts';
import { getCluster, getClusterPrefixedPath } from '@lib/util.ts';
import OauthPopup from '@pages/Auth/oidcauth/OauthPopup.tsx';
import { ClusterDialog } from '@pages/K8s/cluster/Chooser.tsx';
import { setConfig } from 'redux/configSlice.ts';

const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  backgroundColor: theme.palette.primaryColor,
  width: '14rem',
  padding: '0.5rem 2rem',
  '&:hover': {
    opacity: '0.8',
    backgroundColor: theme.palette.text.primary,
  },
}));

export interface AuthChooserProps {
  children?: React.ReactNode;
}

function AuthChooser({ children }: AuthChooserProps) {
  const navigate = useNavigate();
  const clusters = useClustersConf();
  const dispatch = useDispatch();
  const [testingAuth, setTestingAuth] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const clusterName = getCluster() as string;
  const { t } = useTranslation();
  const clustersRef = useRef<typeof clusters>(null);
  const cancelledRef = useRef(false);

  let clusterAuthType = '';
  if (clusters && clusters[clusterName]) {
    clusterAuthType = clusters[clusterName].auth_type;
  }

  const numClusters = Object.keys(clusters || {}).length;

  function runTestAuthAgain() {
    setError(null);
    clustersRef.current = null;
  }

  useEffect(
    () => {
      const sameClusters = isEqual(clustersRef.current, clusters);
      if (!sameClusters) {
        clustersRef.current = clusters;
      }
      console.log('?authchooser getCluster');
      const clusterName = getCluster();

      if (!clusterName || !clusters || sameClusters || error || numClusters === 0) {
        return;
      }

      const cluster = clusters[clusterName];
      if (!cluster) {
        return;
      }

      // If we haven't yet figured whether we need to use a token for the current
      //   cluster, then we check here.
      // With clusterAuthType == oidc,
      //   they are presented with a choice of login or enter token.
      if (clusterAuthType !== 'oidc' && cluster.useToken === undefined) {
        let useToken = true;

        setTestingAuth(true);

        let errorObj: Error | null = null;

        console.debug('Testing auth at authchooser');

        testAuth()
          .then(() => {
            console.debug('Not requiring token as testing auth succeeded');
            useToken = false;
          })
          .catch((err) => {
            if (!cancelledRef.current) {
              console.debug('Requiring token as testing auth failed:', err);

              // Ideally we'd only not assign the error if it was 401 or 403 (so we let the logic
              // proceed to request a token), but let's first check whether this is all we get
              // from clusters that require a token.
              if ([408, 504, 502].includes(err.status)) {
                errorObj = err;
              }

              setTestingAuth(false);
            }
          })
          .finally(() => {
            if (!cancelledRef.current) {
              setTestingAuth(false);

              if (!!errorObj) {
                if (!isEqual(errorObj, error)) {
                  setError(errorObj);
                }

                return;
              } else {
                setError(null);
              }

              cluster.useToken = useToken;
              dispatch(setConfig({ clusters: { ...clusters } }));
              // If we don't require a token, then we just move to the attempted URL or root.
              if (!useToken) {
                // navigate(from, { replace: true });
              }

              // If we reach this point, then we know whether or not we need a token. If we don't,
              // just redirect.
              if (cluster.useToken === false) {
                // navigate(from, { replace: true });
              } else if (!clusterAuthType) {
                // we know that it requires token and also doesn't have oidc configured
                // so let's redirect to token page
                // navigate(
                //   generatePath(getClusterPrefixedPath('token'), {
                //     cluster: clusterName as string,
                //   }),
                //   { replace: true }
                // );
              }
            }
          });
      } else if (cluster.useToken) {
        navigate(
          generatePath(getClusterPrefixedPath('token'), {
            cluster: clusterName as string,
          }),
          { replace: true }
        );
      }
    },
    // eslint-disable-next-line
    [clusters, error]
  );

  // Ensure we have a way to know in the testAuth result whether this component is no longer
  // mounted.
  useEffect(() => {
    return function cleanup() {
      cancelledRef.current = true;
    };
  }, []);

  return (
    <PureAuthChooser
      clusterName={clusterName}
      testingTitle={
        numClusters > 1 ? t('Getting auth info: {{ clusterName }}', { clusterName }) : t('Getting auth info')
      }
      testingAuth={testingAuth}
      title={numClusters > 1 ? t('Authentication: {{ clusterName }}', { clusterName }) : t('Authentication')}
      haveClusters={!!clusters && Object.keys(clusters).length > 1}
      error={error}
      oauthUrl={`${helpers.getAppUrl()}oidc?dt=${Date()}&cluster=${getCluster()}`}
      clusterAuthType={clusterAuthType}
      handleTryAgain={runTestAuthAgain}
      handleOidcAuth={() => {
        navigate(
          generatePath(getClusterPrefixedPath(), {
            cluster: clusterName as string,
          }),
          { replace: true }
        );
      }}
      handleBackButtonPress={() => {
        navigate(-1);
      }}
      handleTokenAuth={() => {
        // navigate(
        //   generatePath(getRoutePath(getRoute('token')), {
        //     cluster: clusterName as string,
        //   }),
        //   { replace: true }
        // );
      }}
    >
      {children}
    </PureAuthChooser>
  );
}

type NewType = React.ReactNode;

export interface PureAuthChooserProps {
  title: string;
  testingTitle: string;
  testingAuth: boolean;
  error: Error | null;
  oauthUrl: string;
  clusterAuthType: string;
  haveClusters: boolean;
  handleOidcAuth: () => void;
  handleTokenAuth: () => void;
  handleTryAgain: () => void;
  handleBackButtonPress: () => void;
  children?: NewType;
  clusterName: string;
}

export function PureAuthChooser({
  title,
  testingTitle,
  testingAuth,
  error,
  oauthUrl,
  clusterAuthType,
  haveClusters,
  handleOidcAuth,
  handleTokenAuth,
  handleTryAgain,
  handleBackButtonPress,
  children,
  clusterName,
}: PureAuthChooserProps) {
  const { t } = useTranslation();

  function onClose() {
    // Do nothing because we're not supposed to close on backdrop click or escape.
  }

  return (
    <ClusterDialog useCover onClose={onClose} aria-labelledby="authchooser-dialog-title">
      {testingAuth ? (
        <Box component="main" textAlign="center">
          <DialogTitle id="authchooser-dialog-title" focusTitle>
            {testingTitle}
          </DialogTitle>
          <Loader title={t('Testing auth')} />
        </Box>
      ) : (
        <Box component="main" display="flex" flexDirection="column" alignItems="center">
          <DialogTitle id="authchooser-dialog-title" focusTitle>
            {title}
          </DialogTitle>
          {!error ? (
            <Box>
              {clusterAuthType === 'oidc' ? (
                <Box m={2}>
                  <OauthPopup
                    onCode={handleOidcAuth}
                    url={oauthUrl}
                    title={t('Headlamp Cluster Authentication')}
                    button={ColorButton as typeof Button}
                  >
                    {t('Sign In') as string}
                  </OauthPopup>
                </Box>
              ) : null}
              <Box m={2}>
                <ColorButton onClick={handleTokenAuth}>{t('Use A Token')}</ColorButton>
              </Box>
              <Box m={2} textAlign="center">
                <Link routeName="settingsCluster" params={{ clusterID: clusterName }}>
                  {t('translation|Cluster settings')}
                </Link>
              </Box>
            </Box>
          ) : (
            <Box alignItems="center" textAlign="center">
              <Box m={2}>
                <Empty>
                  {error && error.message === 'Bad Gateway'
                    ? t(
                        'Failed to connect. Please make sure the Kubernetes cluster is running and accessible. Error: {{ errorMessage }}',
                        { errorMessage: error!.message }
                      )
                    : t('Failed to get authentication information: {{ errorMessage }}', {
                        errorMessage: error!.message,
                      })}
                </Empty>
                <Link routeName="settingsCluster" params={{ clusterID: clusterName }}>
                  {t('translation|Cluster settings')}
                </Link>
              </Box>
              <ColorButton onClick={handleTryAgain}>{t('translation|Try Again')}</ColorButton>
            </Box>
          )}
        </Box>
      )}
      {haveClusters && (
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box
            m={2}
            display="flex"
            alignItems="center"
            style={{ cursor: 'pointer' }}
            onClick={handleBackButtonPress}
            role="button"
          >
            <Box pt={0.5}>
              <InlineIcon icon="mdi:chevron-left" height={20} width={20} />
            </Box>
            <Box fontSize={14} style={{ textTransform: 'uppercase' }}>
              {t('translation|Back')}
            </Box>
          </Box>
        </Box>
      )}
      {children}
    </ClusterDialog>
  );
}

export default AuthChooser;
