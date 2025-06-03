/**
 * This slice contains custom graph elements registered by plugins
 */
import { ReactNode } from 'react';

import { atom } from 'jotai';

import { concat } from 'lodash';

import { GraphSource } from '@pages/K8s/resourceMap/graph/graphModel';

export interface IconDefinition {
  /**
   * Icon element
   */
  icon: ReactNode;
  /**
   * Color of the icon
   * @example #FF0000
   * @example rgba(255, 100, 20, 0.5)
   */
  color?: string;
}

export interface GraphViewState {
  graphSources: GraphSource[];
  kindIcons: Record<string, IconDefinition>;
}

export const graphViewInitialState: GraphViewState = {
  graphSources: [],
  kindIcons: {},
};

export const graphView = atom(graphViewInitialState);
if (process.env.NODE_ENV !== 'production') {
  graphView.debugLabel = 'graphView';
}

export const addGraphSource = atom(null, (get, set, graphSource: GraphSource) => {
  const source = get(graphView).graphSources;

  if (source.find((it) => it.id === graphSource.id) !== undefined) {
    console.error(`Source with id ${graphSource.id} was already registered`);
    return;
  }

  set(graphView, (gv) => ({ ...gv, graphSources: concat(gv.graphSources, graphSource) }));
});

export const addkindIcon = atom(null, (_, set, kindIcon: { kind: string; definition: IconDefinition }) => {
  set(graphView, (gv) => ({ ...gv, kindIcons: { ...gv.kindIcons, [kindIcon.kind]: kindIcon.definition } }));
});
