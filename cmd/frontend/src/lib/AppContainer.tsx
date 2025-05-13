import { useEffect } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';
import { loadable } from 'jotai/utils';

import RouteSwitcher from './RouteSwitcher';
import { apiRequest } from './api/api';

import { asyncAuthAtom, authAtom } from '@lib/auth';
import { Groups, Menus } from '@lib/menu';
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import Plugins from 'src/plugin/Plugins';

const loadableAtom = loadable(asyncAuthAtom);
export default function AppContainer() {
  const load = useAtomValue(loadableAtom);

  const setAuthAtom = useSetAtom(authAtom);
  useEffect(() => {
    if (load.state != 'hasData') return;

    if (!load.data) {
      apiRequest({ method: 'post', host: '', path: '/api/auth/login' })
        .then((res) => {
          setAuthAtom(res);
        })
        .catch((e) => {
          enqueueSnackbar(e, { variant: 'error' });
          console.log('login catch', e);
        });
    }
  }, [load.state]);

  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <Plugins groups={Groups} menus={Menus} />
      <RouteSwitcher groups={Groups} menus={Menus} />
    </SnackbarProvider>
  );
}
