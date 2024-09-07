import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Fragment } from 'react/jsx-runtime';

import Button from '@mui/material/Button';

import { isEmpty, isEqual } from 'lodash';

import { useSnackbar } from 'notistack';
import { CLUSTER_ACTION_GRACE_PERIOD, ClusterAction } from 'redux/clusterActionSlice.ts';
import { useTypedSelector } from 'redux/reducers/reducers.tsx';

export interface PureActionsNotifierProps {
  clusterActions: { [x: string]: ClusterAction };
  dispatch: (action: { type: string }) => void;
}

function PureActionsNotifier({ dispatch, clusterActions }: PureActionsNotifierProps) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();

  function handleAction(clusterAction: ClusterAction) {
    if (isEmpty(clusterAction)) {
      return;
    }

    if (clusterAction.url && location.pathname !== clusterAction.url) {
      navigate(clusterAction.url);
    }

    const action = () => (
      <Fragment>
        {(clusterAction.buttons || []).map(({ label, actionToDispatch }, i) => (
          <Button
            key={i}
            color="secondary"
            size="small"
            onClick={() => {
              dispatch({ type: actionToDispatch });
            }}
          >
            {label}
          </Button>
        ))}
      </Fragment>
    );

    // The original idea was to reuse the Snackbar with the same key.
    // However, with notistack it proved to be complicated, so we dismiss+show
    // Snackbars as needed instead.
    if (clusterAction.dismissSnackbar) {
      closeSnackbar(clusterAction.dismissSnackbar);
    }

    if (clusterAction.message) {
      enqueueSnackbar(clusterAction.message, {
        key: clusterAction.key,
        autoHideDuration: clusterAction.autoHideDuration || CLUSTER_ACTION_GRACE_PERIOD,
        action,
        ...clusterAction.snackbarProps,
      });
    }
  }

  useEffect(
    () => {
      for (const clusterAction of Object.values(clusterActions)) {
        handleAction(clusterAction);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [clusterActions]
  );

  return null;
}

export { PureActionsNotifier };

export default function ActionsNotifier() {
  const dispatch = useDispatch();
  const clusterActions = useTypedSelector((state) => state.clusterAction, isEqual);

  return <PureActionsNotifier dispatch={dispatch} clusterActions={clusterActions} />;
}
