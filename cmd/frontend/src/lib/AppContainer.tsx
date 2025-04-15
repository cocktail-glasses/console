import { Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createBrowserRouter, RouterProvider, RouteObject } from 'react-router-dom';

import { useAtomValue, useSetAtom } from 'jotai';
import { loadable } from 'jotai/utils';

import { groupBy, has, map, size } from 'lodash';

import { apiRequest } from './api/api';
import { authCheck } from './api/common';
import { getCluster } from './cluster';

import { Loader } from '@components/common';
import BasicLayout from '@lib/Layout/BasicLayout';
import { asyncAuthAtom, authAtom } from '@lib/auth';
import { MenuType, Menus, Groups } from '@lib/menu';
import {
  Route,
  getRoutes,
  RoutesGroup,
  createRouteURL,
  getRoute,
  getRoutePathPattern,
  PreviousRouteProvider,
} from '@lib/router';
import { sidebarGroupId, sidebarGroups, sidebarMenus, sidebarMenuSelected, sidebarSub } from '@lib/stores';
import Login from '@pages/Auth/Login';
import ErrorComponent from '@pages/Common/ErrorPage';
import { enqueueSnackbar, SnackbarProvider } from 'notistack';

type Translator = (...args: any[]) => any;

// makeMenuList menu 데이터간의 root, sub 계층 구조를 만들고 root 메뉴 목록으로 반환함
const makeMenuList = (t: Translator) => {
  const menusByGroup = groupBy(Menus, (menu: MenuType) => `${menu.group}_${menu.parent ?? menu.id}`);

  const makeSubMenu = (subMenu: MenuType) => ({
    ...subMenu,
    url: createRouteURL(subMenu.route),
    label: t(subMenu.label),
    isOnlyTab: false,
  });

  const makeRootMenu = (rootMenu: MenuType, sub: Array<ReturnType<typeof makeSubMenu>>) => {
    const isNotExistRootRouteInSub = sub.length > 0 && !sub.find((s) => s.route === rootMenu.route);

    return {
      ...rootMenu,
      url: createRouteURL(rootMenu.route),
      label: t(rootMenu.label),
      sub: isNotExistRootRouteInSub ? [{ ...makeSubMenu(rootMenu), isOnlyTab: true }].concat(sub) : sub,
    };
  };

  return Object.values(menusByGroup)
    .filter((menus: MenuType[]) => {
      const { false: rootMenu } = groupBy(menus, (menu: MenuType) => has(menu, 'parent'));

      return size(rootMenu) != 0;
    })
    .map((menus: MenuType[]) => {
      const { true: subMenus, false: rootMenu } = groupBy(menus, (menu: MenuType) => has(menu, 'parent'));

      const sub = map(subMenus, makeSubMenu);
      return makeRootMenu(rootMenu[0], sub);
    });
};

type Menu = {
  id: string;
  group: string;
  sub: Array<object>;
};
// makeRouteList 라우터 배열을 생성합니다.
const makeRouteList = (menuList: Menu[]) => {
  const clusterName = getCluster();

  return getRoutes()
    .map((routeGroup: RoutesGroup) => {
      const menu = Menus.find((menu: { id: string }) => menu.id === routeGroup.indexId);
      const sub = menuList.find((m: Menu) => m.id === menu?.id || m.id === menu?.parent);
      return routeGroup.routes.map((route: Route) => {
        return {
          id: route.id,
          path: getRoutePathPattern(getRoute(route.id), clusterName),
          index: routeGroup.indexId === route.id,
          useClusterURL: routeGroup.useClusterURL,
          element: (
            <AuthRoute menu={menu} sub={sub}>
              {route.element()}
            </AuthRoute>
          ),
        };
      });
    })
    .flat();
};

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
        })
        .catch((e) => {
          enqueueSnackbar(e, { variant: 'error' });
          console.log('login catch', e);
        });
    }
  }, [load.state]);

  if (load.state == 'hasData') {
    const menuList = makeMenuList(t);
    const routeList = makeRouteList(menuList);

    routes = [
      {
        path: '/',
        element: (
          <PreviousRouteProvider>
            <BasicLayout />
          </PreviousRouteProvider>
        ),
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
        children: routeList,
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

    setSidebarGroups(Groups);
    setSidebarList(menuList);
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
    </SnackbarProvider>
  );
}
