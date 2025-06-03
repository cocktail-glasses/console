import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { matchPath, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Theme } from '@mui/material/styles';

import { useSidebarInfo } from '@lib/Layout/Sidebar';
import { testClusterHealth } from '@lib/k8s/apiProxy';
import { getRoute, getRoutePath } from '@lib/router';
import { getCluster } from '@lib/util';

// in ms
const NETWORK_STATUS_CHECK_TIME = 5000;

export interface PureAlertNotificationProps {
  checkerFunction(): Promise<any>;
}

// Routes where we don't show the alert notification.
// Because maybe they already offer context about the cluster health or
// some other reason.
const ROUTES_WITHOUT_ALERT = ['login', 'token', 'settingsCluster'];

export function PureAlertNotification({ checkerFunction }: PureAlertNotificationProps) {
  const { width: sidebarWidth } = useSidebarInfo();
  const [networkStatusCheckTimeFactor, setNetworkStatusCheckTimeFactor] = useState(0);
  const [error, setError] = useState<null | string | boolean>(null);
  const [intervalID, setIntervalID] = useState<NodeJS.Timeout | null>(null);
  const { t } = useTranslation();
  const { pathname } = useLocation();

  function registerSetInterval(): NodeJS.Timeout {
    return setInterval(
      () => {
        if (!window.navigator.onLine) {
          setError(t('translation|Offline') as string);
          return;
        }

        // Don't check for the cluster health if we are not on a cluster route.
        if (!getCluster()) {
          setError(null);
          return;
        }

        checkerFunction()
          .then(() => {
            setError(false);
          })
          .catch((err) => {
            const error = new Error(err);
            setError(error.message);
            setNetworkStatusCheckTimeFactor((networkStatusCheckTimeFactor: number) => networkStatusCheckTimeFactor + 1);
          });
      },
      (networkStatusCheckTimeFactor + 1) * NETWORK_STATUS_CHECK_TIME
    );
  }

  useEffect(
    () => {
      const id = registerSetInterval();
      setIntervalID(id);
      return () => clearInterval(id);
    },
    // eslint-disable-next-line
    []
  );

  // Make sure we do not show the alert notification if we are not on a cluster route.
  useEffect(() => {
    if (!getCluster()) {
      setError(null);
    }
  }, [pathname]);

  useEffect(
    () => {
      if (intervalID) {
        clearInterval(intervalID);
      }
      const id = registerSetInterval();
      setIntervalID(id);
      return () => clearInterval(id);
    },
    // eslint-disable-next-line
    [networkStatusCheckTimeFactor]
  );

  const showOnRoute = useMemo(() => {
    for (const route of ROUTES_WITHOUT_ALERT) {
      const routePath = getRoutePath(getRoute(route));
      if (matchPath(routePath, pathname)) {
        return false;
      }
    }
    return true;
  }, [pathname]);

  if (!error || !showOnRoute) {
    return null;
  }

  return (
    <Box
      sx={(theme) => ({
        color: theme.palette.common.white,
        textAlign: 'center',
        display: 'flex',
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(0.5),
        justifyContent: 'center',
        position: 'fixed',
        zIndex: theme.zIndex.snackbar + 1,
        width: '100%',
        top: '0',
        height: '3.8vh',
      })}
      bgcolor="error.main"
      paddingRight={sidebarWidth}
    >
      <Box>
        {t('Something went wrong.')}
        <Button
          sx={(theme: Theme) => ({
            color: theme.palette.error.main,
            borderColor: theme.palette.error.main,
            background: theme.palette.common.white,
            lineHeight: '1',
            marginLeft: theme.spacing(1),
            '&:hover': {
              color: theme.palette.common.white,
              borderColor: theme.palette.common.white,
              background: theme.palette.error.dark,
            },
          })}
          onClick={() => setNetworkStatusCheckTimeFactor(0)}
          size="small"
        >
          {t('translation|Try Again')}
        </Button>
      </Box>
    </Box>
  );
}

export default function AlertNotification() {
  return <PureAlertNotification checkerFunction={testClusterHealth} />;
}
