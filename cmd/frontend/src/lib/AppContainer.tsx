import { Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  createBrowserRouter,
  RouterProvider,
  /*Navigate,*/
  RouteObject,
} from 'react-router-dom';

import { useAtomValue, useSetAtom } from 'jotai';
import { loadable } from 'jotai/utils';

import { apiRequest } from './api/api';
import { authCheck } from './api/common';
import { getCluster } from './cluster';
import { decryptAESCBC256 } from './util';

import { Loader } from '@components/common';
import BasicLayout from '@lib/Layout/BasicLayout';
import { asyncAuthAtom, authAtom } from '@lib/auth';
import { MenuType, Menus, Groups } from '@lib/menu';
import { Routes, createRouteIndexURL, getRoutePathPattern } from '@lib/routes';
import { sidebarGroupId, sidebarGroups, sidebarMenus, sidebarMenuSelected, sidebarSub } from '@lib/stores';
import Login from '@pages/Auth/Login';
import ErrorComponent from '@pages/Common/ErrorPage';
import { enqueueSnackbar, SnackbarProvider } from 'notistack';

// import { UriPrefix } from './api/constants';

// TODO: ccambo, ESLint 오류로 변경
// Don't use `Function` as a type. The `Function` type accepts any function-like value.
//function make(t: Function) {
function make(t: (...args: any[]) => any) {
  const menus: { [key: string]: any } = {};
  const routeIdMenu: { [key: string]: any } = {};

  Menus.forEach((m: MenuType) => {
    if (!m.parent) {
      const sub = Menus.filter((e) => e.group === m.group && m.id === e.parent).map((e) => ({
        ...e,
        url: createRouteIndexURL(e.route),
        label: t(e.label),
        isOnlyTab: false,
      }));
      if (!sub.find((s) => s.route === m.route) && sub.length > 0) {
        sub.unshift({ ...m, url: createRouteIndexURL(m.route), isOnlyTab: true });
      }
      menus[m.id] = { ...m, label: t(m.label), sub, url: createRouteIndexURL(m.route) };
    }
    routeIdMenu[m.route] = m;
  });

  const clusterName = getCluster();
  const routes: RouteObject[] = [];
  Routes.forEach((e) => {
    const menu = routeIdMenu[e.id];
    const p = menus[menu.parent || menu.id];
    e.routes.forEach((r) => {
      // const Element = lazy(() => import(`../pages/${r.page}`))
      const Element = r.element;
      const route: RouteObject = {
        path: getRoutePathPattern(r, e, clusterName),
        element: (
          <AuthRoute menu={menu} sub={p.sub}>
            <Element {...r.props} />
          </AuthRoute>
        ),
      };
      routes.push(route);
    });
  });
  return { r: routes, g: Groups, m: Object.values(menus) };
}

function AuthRoute(props: { children: React.ReactNode | JSX.Element; [otherProps: string]: any }) {
  const { children, menu, sub } = props;
  const setSidebarMenuSelected = useSetAtom(sidebarMenuSelected);
  const setSubList = useSetAtom(sidebarSub);
  const setSidebarGroup = useSetAtom(sidebarGroupId);
  setSidebarMenuSelected(menu);
  setSidebarGroup(menu.group);
  if (sub?.length > 0) {
    setSubList(sub);
  } else {
    setSubList([]);
  }
  return <Suspense fallback={<Loader title="Loading..." />}>{children}</Suspense>;
}

const loadableAtom = loadable(asyncAuthAtom);
export default function AppContainer() {
  const load = useAtomValue(loadableAtom);
  const setSidebarGroups = useSetAtom(sidebarGroups);
  const setSidebarList = useSetAtom(sidebarMenus);
  const { t } = useTranslation(['glossary']);
  let routes: RouteObject[] = [
    {
      path: '*',
      element: <Loader title="Loading..." />,
    },
  ];

  const setAuthAtom = useSetAtom(authAtom);
  useEffect(() => {
    if (load.state != 'hasData') return;

    if (!load.data) {
      apiRequest({ method: 'post', host: '', path: '/api/auth/login' })
        .then((res) => {
          setAuthAtom(res);
          // decryptAESCBC256(res, 'cocktail-glasses_encryption_data', 'cocktail-glasses').then((e) => {
          // const user = JSON.parse(e);
          // setAuthAtom(user);
          // });
        })
        .catch((e) => {
          enqueueSnackbar(e, { variant: 'error' });
          console.log('login catch', e);
        });
    }
  }, [load.state]);

  if (load.state == 'hasData') {
    const { r, g, m } = make(t);
    routes = [
      {
        path: '/',
        element: <BasicLayout />,
        loader: () => {
          authCheck().then((isAuthenticated: boolean) => {
            if (!isAuthenticated) location.href = '/auth/login';
          });
          return true;
        },
        shouldRevalidate: ({ currentUrl, nextUrl }) => {
          // url이 변경되면 loader를 호출합니다.
          return currentUrl.pathname !== nextUrl.pathname;
        },
        children: r,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '*',
        element: <ErrorComponent />,
      },
    ];

    setSidebarGroups(g);
    setSidebarList(m);
  }

  const router = createBrowserRouter(routes);

  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <RouterProvider router={router} />
      {/* <BrowserRouter>
        <PreviousRouteProvider>
          <Layout />
        </PreviousRouteProvider>
      </BrowserRouter> */}
    </SnackbarProvider>
  );
}
