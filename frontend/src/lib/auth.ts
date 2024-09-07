import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

import { SESSION_KEY } from '@lib/constants.ts';
import store from 'redux/stores/store.tsx';

export function getToken(cluster: string) {
  const getTokenMethodToUse = store.getState().ui.functionsToOverride.getToken;
  const tokenMethodToUse =
    getTokenMethodToUse ||
    function () {
      return getTokens()[cluster];
    };
  return tokenMethodToUse(cluster);
}

export function getUserInfo(cluster: string) {
  const user = getToken(cluster).split('.')[1];
  return JSON.parse(atob(user));
}

export function hasToken(cluster: string) {
  return !!getToken(cluster);
}

function getTokens() {
  return JSON.parse(localStorage.tokens || '{}');
}

export function setToken(cluster: string, token: string | null) {
  const setTokenMethodToUse = store.getState().ui.functionsToOverride.setToken;
  if (setTokenMethodToUse) {
    setTokenMethodToUse(cluster, token);
  } else {
    const tokens = getTokens();
    tokens[cluster] = token;
    localStorage.tokens = JSON.stringify(tokens);
  }
}

export function deleteTokens() {
  delete localStorage.tokens;
}

export function logout() {
  deleteTokens();
}

export class Auth {
  private static instance: Auth;

  private userSeq: number;
  private accountSeq: number;

  set setUserSeq(u: number) {
    this.userSeq = u;
  }
  set setAccountSeq(a: number) {
    this.accountSeq = a;
  }
  get getUserSeq(): number {
    return this.userSeq;
  }
  get getAccountSeq(): number {
    return this.accountSeq;
  }

  // 오직 getInstance() 스태틱 메서드를 통해서만
  // 단 하나의 객체를 생성할 수 있습니다.
  public static getInstance() {
    if (!Auth.instance) {
      Auth.instance = new Auth();
    }
    return Auth.instance;
  }
}

// export const authAtom = atomWithStorage(SESSION_KEY, '', createJSONStorage(() => sessionStorage),);

export const asyncAuthAtom = atom(async (get) => await get(authAtom));

export const authAtom = atomWithStorage(SESSION_KEY, '', {
  getItem(key, initialValue) {
    console.log('getItem', key);
    const storedValue = sessionStorage.getItem(key);
    try {
      const user = JSON.parse(storedValue ?? '');
      Auth.getInstance().setAccountSeq = user?.account.accountSeq;
      Auth.getInstance().setUserSeq = user?.userSeq;
      return user;
    } catch {
      console.log('getItem catch');
      return initialValue;
    }
  },
  setItem(key, value: any) {
    console.log('setItem', key, value);
    sessionStorage.setItem(key, JSON.stringify(value));
    if (value) {
      Auth.getInstance().setAccountSeq = value?.account.accountSeq;
      Auth.getInstance().setUserSeq = value?.userSeq;
    }
  },
  removeItem(key) {
    console.log('removeItem', key);
    sessionStorage.removeItem(key);
  },
  subscribe(key, callback, initialValue) {
    if (typeof window === 'undefined' || typeof window.addEventListener === 'undefined') {
      return () => {};
    }
    const sub = (e: any) => {
      console.log('subsub', e);
      if (e.storageArea === sessionStorage && e.key === key) {
        let newValue;
        try {
          newValue = JSON.parse(e.newValue ?? '');
        } catch {
          newValue = initialValue;
        }
        callback(newValue);
      }
    };
    window.addEventListener('storage', sub);
    return () => {
      window.removeEventListener('storage', sub);
    };
  },
});
