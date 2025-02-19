import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { createBrowserRouter, RouterProvider, Navigate, RouteObject } from 'react-router-dom';

import { useAtomValue, useSetAtom } from 'jotai';
import { loadable } from 'jotai/utils';

import { Loader } from '@components/common';
import BasicLayout from '@lib/Layout/BasicLayout';
import { asyncAuthAtom } from '@lib/auth';
import { MenuType, Menus, Groups } from '@lib/menu';
import { Routes } from '@lib/routes';
import { sidebarGroupId, sidebarGroups, sidebarMenus, sidebarMenuSelected, sidebarSub } from '@lib/stores';
import Login from '@pages/Auth/Login';
import ErrorComponent from '@pages/Common/ErrorPage';
import { SnackbarProvider } from 'notistack';

// import { UriPrefix } from './api/constants';

// TODO: ccambo, ESLint 오류로 변경
// Don't use `Function` as a type. The `Function` type accepts any function-like value.
//function make(t: Function) {
function make(t: (...args: any[]) => any) {
  const menuUrl: { [key: string]: any } = {};
  Routes.forEach((e) => {
    menuUrl[e.id] = e.routes.find((r) => r.index)?.path;
  });
  const menus: { [key: string]: any } = {};
  const routeIdMenu: { [key: string]: any } = {};

  Menus.forEach((m: MenuType) => {
    if (!m.parent) {
      const sub = Menus.filter((e) => e.group === m.group && m.id === e.parent).map((e) => ({
        ...e,
        url: menuUrl[e.route],
        label: t(e.label),
        isOnlyTab: false,
      }));
      if (!sub.find((s) => s.route === m.route) && sub.length > 0) {
        sub.unshift({ ...m, url: menuUrl[m.route], isOnlyTab: true });
      }
      menus[m.id] = { ...m, label: t(m.label), sub, url: menuUrl[m.route] };
    }
    routeIdMenu[m.route] = m;
  });

  const routes: RouteObject[] = []
  Routes.forEach(e => {
    const menu = routeIdMenu[e.id]
    const p = menus[menu.parent || menu.id]
    e.routes.forEach(r => {
      const Element = lazy(() => import(`../pages/${r.page}`))
      const route: RouteObject = { path: r.path, element: <AuthRoute menu={menu} sub={p.sub} ><Element {...r.props}/></AuthRoute> }
      routes.push(route)
    })
  })
  return { r: routes, g: Groups, m: Object.values(menus) }
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
function AuthenticatedComponent(props: { isAuth: boolean }) {
  return props.isAuth ? <BasicLayout /> : <Navigate to="/login" />;
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
  if (load.state == 'hasData') {
    const { r, g, m } = make(t);
    routes = [
      {
        path: '/',
        element: <AuthenticatedComponent isAuth={!!load.data} />,
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
