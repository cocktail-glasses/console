import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

import { SidebarMenuType } from '@lib/Layout/Sidebar/Sidebar';
import { SidebarItemProps } from '@lib/Layout/Sidebar/SidebarInterface';
import { MenuType } from '@lib/menu';

// sidebar sub 메뉴
export const sidebarSub = atom<SidebarItemProps[]>([]);
if (process.env.NODE_ENV !== 'production') {
  sidebarSub.debugLabel = 'sidebarSub';
}

// sidebar 확대 축소(true:확대, false:축소)
export const sidebarIsOpen = atom<boolean>(true);
if (process.env.NODE_ENV !== 'production') {
  sidebarIsOpen.debugLabel = 'sidebarIsOpen';
}

// sidebar 그룹 목록
export const sidebarGroups = atom<{ id: string; label: string; icon: string }[]>([]);
if (process.env.NODE_ENV !== 'production') {
  sidebarGroups.debugLabel = 'sidebarGroups';
}

// 선택된 그룹 아이디
export const sidebarGroupId = atom<string>('');
if (process.env.NODE_ENV !== 'production') {
  sidebarGroupId.debugLabel = 'sidebarGroupId';
}

// 메뉴 목록
export const sidebarMenus = atom<SidebarMenuType[]>();
if (process.env.NODE_ENV !== 'production') {
  sidebarMenus.debugLabel = 'sidebarMenus';
}

// 선택된 메뉴 정보
export const sidebarMenuSelected = atom<MenuType>();
if (process.env.NODE_ENV !== 'production') {
  sidebarMenuSelected.debugLabel = 'sidebarMenuSelected';
}

export const hideAppBar = atom<boolean>(false);
if (process.env.NODE_ENV !== 'production') {
  hideAppBar.debugLabel = 'hideAppBar';
}

export const theme = atomWithStorage('theme', '');
if (process.env.NODE_ENV !== 'production') {
  theme.debugLabel = 'theme';
}

export const settings = atomWithStorage('settings', {}, createJSONStorage());
if (process.env.NODE_ENV !== 'production') {
  settings.debugLabel = 'settings';
}

export const detailDrawerEnabled = atomWithStorage<boolean>('detailDrawerEnabled', true);
if (process.env.NODE_ENV !== 'production') {
  detailDrawerEnabled.debugLabel = 'detailDrawerEnabled';
}

export const selectedResource = atom<{ kind: any; metadata: { name: string; namespace?: string } } | null>(null);
if (process.env.NODE_ENV !== 'production') {
  selectedResource.debugLabel = 'selectedResource';
}

export const routeLavel = atom<number>(0);
if (process.env.NODE_ENV !== 'production') {
  routeLavel.debugLabel = 'routeLavel';
}
