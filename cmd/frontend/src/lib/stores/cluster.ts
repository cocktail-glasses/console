import { atom } from 'jotai';

import { isEmpty, merge } from 'lodash';

export interface ClusterInfo {
  name: string;
  isManagedCluster: boolean;
  version: string;
}

interface ClusterInfoTable {
  [key: string]: ClusterInfo;
}

interface Clusters {
  selected: string;
  table: ClusterInfoTable;
}

// TODO: 관리 클러스터의 이름이 mainClusterKey와 동일할 경우를 대비하여 Table을 구현헀지만 정작 key로 변환할 수가 없음..
// window 객체에 Table이 구현돼야 headlmap 일반 함수에서 호출할 수 있다.
// 기본 아이디어는 @를 메인 클러스터만 사용가능하도록 유지시키는것이다.
// 현재 구현 방안은 관리 클러스터인 경우 clusterKey에는 @가 제거된 클러스터 명을, 가리키는 값에 원본 클러스터명을 유지하는 방식이다.
export const mainClusterKey = '@main';
export const NoneClusterKey = '';
const defaultClusters = {
  selected: '',
  table: { [mainClusterKey]: { name: '', isManagedCluster: false, version: 'v1.30.13' } },
};

export const isClusterNotSelect = (selected: string) => isEmpty(selected);
export const isHubCluster = (selected: string) => selected === mainClusterKey;

const clusters = atom<Clusters>(defaultClusters);
if (process.env.NODE_ENV !== 'production') {
  clusters.debugLabel = 'clusters';
}

export const clusterAtom = atom(
  (get) => get(clusters).selected,
  (get, set, nextSelect: string) => {
    const c = get(clusters);

    if (c.selected === nextSelect) return;

    // if (has(c.table, nextSelect)) {
    set(clusters, { ...c, selected: nextSelect });
    // }
  }
);

export const clustersAtom = atom(
  (get) => get(clusters).table,
  (get, set, nextTable: ClusterInfoTable) => {
    const c = get(clusters);

    set(clusters, { ...c, table: merge({}, c.table, nextTable) });
  }
);
