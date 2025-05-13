import { Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createBrowserRouter, RouterProvider, ShouldRevalidateFunctionArgs } from 'react-router-dom';

import { useAtomValue, useSetAtom } from 'jotai';
import { loadable } from 'jotai/utils';

import { filter, groupBy, has, keyBy, map, size } from 'lodash';

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
  createRouteURL,
  getRoute,
  getRoutePathPattern,
  PreviousRouteProvider,
  RouteGroup,
  getIndexRoute,
} from '@lib/router';
import { sidebarGroupId, sidebarGroups, sidebarMenus, sidebarMenuSelected, sidebarSub } from '@lib/stores';
import Login from '@pages/Auth/Login';
import ErrorComponent from '@pages/Common/ErrorPage';
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import Plugins from 'src/plugin/Plugins';

type Translator = (...args: any[]) => any;

// makeMenuList menu 데이터간의 root, sub 계층 구조를 만들고 root 메뉴 목록으로 반환함
const makeMenuList = (t: Translator) => {
  // 그룹 메뉴를 하나의 객체로 변환
  const groupTable = keyBy(Groups, 'id');

  const availableMenus = Menus.filter((menu: MenuType) => !!groupTable[menu.group]);

  const menusByGroup = groupBy(availableMenus, (menu: MenuType) => `${menu.group}_${menu.parent ?? menu.id}`);

  const makeSubMenu = (subMenu: MenuType) => ({
    ...subMenu,
    url: createRouteURL(getIndexRoute(subMenu.route).id),
    label: t(subMenu.label),
    isOnlyTab: false,
  });

  const makeRootMenu = (rootMenu: MenuType, sub: Array<ReturnType<typeof makeSubMenu>>) => {
    const isNotExistRootRouteInSub = sub.length > 0 && !sub.find((s) => s.route === rootMenu.route);

    return {
      ...rootMenu,
      url: createRouteURL(getIndexRoute(rootMenu.route).id),
      label: t(rootMenu.label),
      sub: isNotExistRootRouteInSub ? [{ ...makeSubMenu(rootMenu), isOnlyTab: true }].concat(sub) : sub,
    };
  };

  return Object.values(menusByGroup)
    .filter((menus: MenuType[]) => {
      const rootMenu = filter(menus, (menu: MenuType) => !has(menu, 'parent'));

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

  const menuTable = keyBy(Menus, 'id');

  return Object.entries(getRoutes())
    .filter(([id]: [string, RouteGroup]) => !!menuTable[id])
    .map(([id, routeGroup]: [string, RouteGroup]) => {
      const menu = menuTable[id];

      const availableMenu = menuList.find((m: Menu) => m.id === menu.id || m.id === menu.parent);

      return routeGroup.routes.map((route: Route) => {
        const r = getRoute(route.id);

        return {
          id: r.id,
          path: getRoutePathPattern(r, clusterName),
          index: r.index,
          useClusterURL: r.useClusterURL,
          element: (
            <AuthRoute menu={menu} sub={availableMenu?.sub || []}>
              {r.element()}
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

  useEffect(() => {
    setSidebarMenuSelected(menu);
    setSidebarGroup(menu.group);
    if (sub?.length > 0) {
      setSubList(sub);
    } else {
      setSubList([]);
    }
  }, [menu, sub]);

  return <Suspense fallback={<Loader title="Loading..." />}>{children}</Suspense>;
}

const loadableAtom = loadable(asyncAuthAtom);
export default function AppContainer() {
  const load = useAtomValue(loadableAtom);
  const setSidebarGroups = useSetAtom(sidebarGroups);
  const setSidebarList = useSetAtom(sidebarMenus);
  const { t } = useTranslation(['glossary']);

  const menuList = makeMenuList(t);
  const routeList = makeRouteList(menuList);

  const routes = [
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
      shouldRevalidate: ({ currentUrl, nextUrl }: ShouldRevalidateFunctionArgs) => {
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

  useEffect(() => {
    // 렌더링 중 다른 컴포넌트의 state를 변경하면 에러가 발생하기 때문에 렌더링 이후 useEffect에서 호출합니다.
    setSidebarGroups(Groups);
    setSidebarList(menuList);
  }, [menuList, Groups]);

  const router = createBrowserRouter(routes);

  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <Plugins />
      <RouterProvider router={router} />
    </SnackbarProvider>
  );
}
