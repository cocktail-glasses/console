import { atom } from 'jotai';

import { isUndefined } from 'lodash';

import { RouteGroupTable, RouteGroup } from '@lib/router';

export const routeGroupTableInitState = {};

export const routeGroupTable = atom<RouteGroupTable>(routeGroupTableInitState);
if (process.env.NODE_ENV !== 'production') {
  routeGroupTable.debugLabel = 'routeGroupTable';
}

export const addRouteGroup = atom(null, (get, set, { key, routeGroup }: { key: string; routeGroup: RouteGroup }) => {
  const hashTable = get(routeGroupTable);

  if (isUndefined(hashTable)) return;

  if (!isUndefined(hashTable[key])) return;

  set(routeGroupTable, { ...hashTable, [key]: routeGroup });
});

export const addRouteGroupTable = atom(null, (get, set, newRouteGroupTable: RouteGroupTable) => {
  const hashTable = get(routeGroupTable);

  if (isUndefined(hashTable)) return;

  set(routeGroupTable, { ...hashTable, ...newRouteGroupTable });
});
