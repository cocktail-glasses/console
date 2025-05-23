import RouteSwitcher from './RouteSwitcher';

import { Groups, Menus } from '@lib/menu';
import { SnackbarProvider } from 'notistack';
import Plugins from 'src/plugin/Plugins';

export default function AppContainer() {
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
