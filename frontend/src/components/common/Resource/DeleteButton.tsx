import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import ActionButton from '@components/common/ActionButton';
import { ConfirmDialog } from '@components/common/Dialog.tsx';
import AuthVisible from '@components/common/Resource/AuthVisible.tsx';
import { KubeObject } from '@lib/k8s/cluster.ts';
import { CallbackActionOptions, clusterAction } from 'redux/clusterActionSlice.ts';
import { EventStatus, HeadlampEventType, useEventCallback } from 'redux/headlampEventSlice.ts';

interface DeleteButtonProps {
  item?: KubeObject;
  options?: CallbackActionOptions;
}

export default function DeleteButton(props: DeleteButtonProps) {
  const dispatch = useDispatch();
  const { item, options } = props;
  const [openAlert, setOpenAlert] = useState(false);
  const location = useLocation();
  const { t } = useTranslation(['translation']);
  const dispatchDeleteEvent = useEventCallback(HeadlampEventType.DELETE_RESOURCE);

  const deleteFunc = useCallback(
    () => {
      if (!item) {
        return;
      }

      const callback = item!.delete;

      const itemName = item!.metadata.name;

      callback &&
        dispatch(
          clusterAction(callback.bind(item), {
            startMessage: t('Deleting item {{ itemName }}…', { itemName }),
            cancelledMessage: t('Cancelled deletion of {{ itemName }}.', { itemName }),
            successMessage: t('Deleted item {{ itemName }}.', { itemName }),
            errorMessage: t('Error deleting item {{ itemName }}.', { itemName }),
            cancelUrl: location.pathname,
            startUrl: item!.getListLink(),
            errorUrl: item!.getListLink(),
            ...options,
          })
        );
    },
    // eslint-disable-next-line
    [item]
  );

  if (!item) {
    return null;
  }

  return (
    <AuthVisible
      item={item}
      authVerb="delete"
      onError={(err: Error) => {
        console.error(`Error while getting authorization for delete button in ${item}:`, err);
      }}
    >
      <ActionButton
        description={t('translation|Delete')}
        onClick={() => {
          setOpenAlert(true);
        }}
        icon="mdi:delete"
      />
      <ConfirmDialog
        open={openAlert}
        title={t('translation|Delete item')}
        description={t('translation|Are you sure you want to delete this item?')}
        handleClose={() => setOpenAlert(false)}
        onConfirm={() => {
          deleteFunc();
          dispatchDeleteEvent({
            resource: item,
            status: EventStatus.CONFIRMED,
          });
        }}
      />
    </AuthVisible>
  );
}
