import React, { ReactNode, Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createBrowserRouter, RouterProvider, ShouldRevalidateFunctionArgs } from 'react-router-dom';

import { useAtomValue, useSetAtom } from 'jotai';

import { filter, groupBy, has, map, size } from 'lodash';

import { routeGroupTable as routeGroupTableAtom } from './stores/router';

import { Loader } from '@components/common';
import BasicLayout from '@lib/Layout/BasicLayout';
import { authCheck } from '@lib/api/common';
import { getCluster } from '@lib/cluster';
import { getMenu, GroupType, hasGroup, hasMenu, MenuType } from '@lib/menu';
import {
  addRouteGroupTable,
  createRouteURL,
  getIndexRoute,
  getRoute,
  getRouteGroupTable,
  getRoutePathPattern,
  hasRouteGroup,
  PreviousRouteProvider,
  resetRoute,
  Route,
  RouteGroup,
} from '@lib/router';
import { sidebarGroupId, sidebarGroups, sidebarMenus, sidebarMenuSelected, sidebarSub } from '@lib/stores';
import Login from '@pages/Auth/Login';
import ErrorComponent from '@pages/Common/ErrorPage';

type Translator = (...args: any[]) => any;

interface RootMenu extends MenuType {
  url: string;
  label: string;
  sub: SubMenu[];
}

interface SubMenu extends MenuType {
  url: string;
  label: string;
  isOnlyTab: boolean;
}

// makeMenuList menu 데이터간의 root, sub 계층 구조를 만들고 root 메뉴 목록으로 반환함
const makeMenuList = (groups: GroupType[], menus: MenuType[], t: Translator): RootMenu[] => {
  const availableMenus = menus
    .filter((menu: MenuType) => hasGroup(groups, menu.group))
    .filter((menu: MenuType) => hasRouteGroup(menu.route));

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

interface ConcreteRoute extends Omit<Route, 'element'> {
  element: ReactNode;
}

// makeRouteList 라우터 배열을 생성합니다.
const makeRouteList = (menus: MenuType[], menuList: RootMenu[]): ConcreteRoute[] => {
  const clusterName = getCluster();

  return Object.entries(getRouteGroupTable())
    .filter(([id]: [string, RouteGroup]) => hasMenu(menus, id))
    .map(([id, routeGroup]: [string, RouteGroup]) => ({ menu: getMenu(menus, id)!, routeGroup: routeGroup }))
    .map(({ menu, routeGroup }: { menu: MenuType; routeGroup: RouteGroup }) => {
      const availableMenu = menuList.find((m: RootMenu) => m.id === menu.id || m.id === menu.parent);

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

interface RouteSwitcherProps {
  groups: GroupType[];
  menus: MenuType[];
}

// RouteSwitcher 동적 라우팅을 처리합니다.
export default function RouteSwitcher({ groups, menus }: RouteSwitcherProps) {
  const { t } = useTranslation(['glossary']);
  const setSidebarGroups = useSetAtom(sidebarGroups);
  const setSidebarList = useSetAtom(sidebarMenus);

  const [routeList, setRouteList] = useState<ConcreteRoute[]>([]);

  const dynamicRouteGroupTable = useAtomValue(routeGroupTableAtom);
  useEffect(() => {
    // 렌더링중 사이드이펙트가 발생하지 않도록 useEffect 안에서 routeGroupTable과 routeList를 동기화한다.
    addRouteGroupTable(dynamicRouteGroupTable);

    const menuList = makeMenuList(groups, menus, t);
    const routeList = makeRouteList(menus, menuList);
    setRouteList(routeList);

    setSidebarGroups(groups);
    setSidebarList(menuList);

    return () => resetRoute();
  }, [groups, menus, dynamicRouteGroupTable]);

  if (isLoadingRoute(routeList)) {
    const routes = [
      {
        path: '*',
        element: <Loader title="Loading..." />,
      },
    ];
    const router = createBrowserRouter(routes);
    return <RouterProvider router={router} />;
  }

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

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
}

const isLoadingRoute = (routeList: ConcreteRoute[]) => size(routeList) == 0;
