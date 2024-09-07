import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

import { SidebarItemProps } from '@lib/Layout/Sidebar/SidebarInterface.ts';

// sidebar sub 메뉴
export const sidebarSub = atom<SidebarItemProps[]>([]);
// sidebar 확대 축소(true:확대, false:축소)
export const sidebarIsOpen = atom<boolean>(true);
// sidebar 그룹 목록
export const sidebarGroups = atom<{ id: string; label: string; icon: string }[]>([]);
// 선택된 그룹 아이디
export const sidebarGroupId = atom<string>('');
// 메뉴 목록
export const sidebarMenus = atom<{ [key: string]: any }>({});
// 선택된 메뉴 정보
export const sidebarMenuSelected = atom<{ [key: string]: any }>({});

export const hideAppBar = atom<boolean>(false);

export const theme = atomWithStorage('theme', '');
export const settings = atomWithStorage('settings', {}, createJSONStorage());
