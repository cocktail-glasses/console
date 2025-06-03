import { atom } from 'jotai';

export const showMetricSection = atom(true);
if (process.env.NODE_ENV !== 'production') {
  showMetricSection.debugLabel = 'showMetricSection';
}
