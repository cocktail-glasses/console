import { atom } from 'jotai';

export const additionalLayoutStyle = atom<object | null>(null);
if (process.env.NODE_ENV !== 'production') {
  additionalLayoutStyle.debugLabel = 'additionalLayoutStyle';
}
