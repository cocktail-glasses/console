import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { cloneDeep } from 'lodash';

import AuthVisible from '@components/common/Resource/AuthVisible';
import { Icon } from '@iconify/react';
import { apply } from '@lib/k8s/apiProxy';
import { KubeObject } from '@lib/k8s/cluster';
import { clusterAction } from 'redux/clusterActionSlice';
import { EventStatus, HeadlampEventType, useEventCallback } from 'redux/headlampEventSlice';

interface RestartButtonProps {
  item: KubeObject;
}

export function RestartButton(props: RestartButtonProps) {
  const { item } = props;
  const { t } = useTranslation();
  const [openDialog, setOpenDialog] = useState(false);
  const dispatch = useDispatch();

  function applyFunc() {
    try {
      const clonedItem = cloneDeep(item);
      clonedItem.spec.template.metadata.annotations = {
        ...clonedItem.spec.template.metadata.annotations,
        'kubectl.kubernetes.io/restartedAt': new Date().toISOString(),
      };
      apply(clonedItem.jsonData);
    } catch (err) {
      console.error('Error while restarting resource:', err);
    }
  }

  function handleClose() {
    setOpenDialog(false);
  }

  function handleSave() {
    const cancelUrl = location.pathname;
    const itemName = item.metadata.name;

    setOpenDialog(false);

    // setOpenDialog(false);
    dispatch(
      clusterAction(() => applyFunc(), {
        startMessage: t('Restarting {{ itemName }}…', { itemName }),
        cancelledMessage: t('Cancelled restarting {{ itemName }}.', { itemName }),
        successMessage: t('Restarted {{ itemName }}.', { itemName }),
        errorMessage: t('Failed to restart {{ itemName }}.', { itemName }),
        cancelUrl,
        errorUrl: cancelUrl,
      })
    );
  }

  if (!item || !['Deployment', 'StatefulSet', 'DaemonSet'].includes(item.kind)) {
    return null;
  }

  return (
    <AuthVisible
      item={item}
      authVerb="update"
      onError={(err: Error) => {
        console.error(`Error while getting authorization for restart button in ${item}:`, err);
      }}
    >
      <Tooltip title={t('translation|Restart') as string}>
        <IconButton aria-label={t('translation|restart')} onClick={() => setOpenDialog(true)} size="medium">
          <Icon icon="mdi:restart" />
        </IconButton>
      </Tooltip>
      <RestartDialog resource={item} open={openDialog} onClose={handleClose} onSave={handleSave} />
    </AuthVisible>
  );
}

interface RestartDialogProps {
  resource: KubeObject;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

function RestartDialog(props: RestartDialogProps) {
  const { resource, open, onClose, onSave } = props;
  const { t } = useTranslation();
  const dispatchRestartEvent = useEventCallback(HeadlampEventType.DELETE_RESOURCE);

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" maxWidth="xs" fullWidth>
      <DialogTitle id="form-dialog-title">{t('translation|Restart')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('translation|Are you sure you want to restart {{ name }}?', {
            name: resource.metadata.name,
          })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t('translation|Cancel')}
        </Button>
        <Button
          onClick={() => {
            dispatchRestartEvent({
              resource: resource,
              status: EventStatus.CONFIRMED,
            });
            onSave();
          }}
          color="primary"
        >
          {t('translation|Restart')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
