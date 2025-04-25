import { ReactNode } from 'react';

import { atom } from 'jotai';

import { concat, isFunction } from 'lodash';

import { DetailsViewSectionType } from '@components/DetailsViewSection';
import { KubeObject } from '@lib/k8s/KubeObject';

export enum DefaultDetailsViewSection {
  METADATA = 'METADATA',
  BACK_LINK = 'BACK_LINK',
  MAIN_HEADER = 'MAIN_HEADER',
  EVENTS = 'EVENTS',
  ERROR = 'ERROR',
  LOADING = 'LOADING',
  CHILDREN = 'CHILDREN',
}

export type DetailsViewsSectionProcessor = {
  id: string;
  processor: SectionFuncType;
};

// 리소스, 섹션 목록을 받아서 섹션 목록을 반환하는 함수 타입
export type SectionFuncType = (
  resource: KubeObject | null,
  sections: (DetailsViewSection | ReactNode)[]
) => (DetailsViewSection | ReactNode)[];

// 섹션 타입
export type DetailsViewSection = {
  id: string;
  section?: DetailsViewSectionType;
};

/**
 * Normalizes a header actions processor by ensuring it has an 'id' and a processor function.
 *
 * If the processor is passed as a function, it will be wrapped in an object with a generated ID.
 *
 * @param action - The payload action containing the header actions processor.
 * @returns The normalized header actions processor.
 */
function _normalizeProcessor<Processor, ProcessorProcessor>(action: Processor | ProcessorProcessor) {
  let defailsViewSectionsProcessor: Processor = action as Processor;

  if (isFunction(defailsViewSectionsProcessor)) {
    defailsViewSectionsProcessor = {
      id: `generated-id-${Date.now().toString(36)}`,
      processor: defailsViewSectionsProcessor,
    } as Processor;
  }

  return defailsViewSectionsProcessor;
}

// 상세 화면 섹션 데이터
export interface DetailsViewSectionState {
  /**
   * List of details views.
   */
  detailViews: DetailsViewSectionType[];
  /**
   * List of details view sections.
   */
  detailsViewSections: DetailsViewSection[];
  /**
   * List of details view sections processors.
   */
  detailsViewSectionsProcessors: DetailsViewsSectionProcessor[];
}

export const detailsViewSectionState = atom<DetailsViewSectionState>({
  detailViews: [],
  detailsViewSections: [],
  detailsViewSectionsProcessors: [],
});
if (process.env.NODE_ENV !== 'production') {
  detailsViewSectionState.debugLabel = 'detailsViewSection';
}

// detailsViewSectionState 개별 속성 getter, setter
export const detailViews = atom(
  (get) => get(detailsViewSectionState).detailViews,
  (get, set, newDetailView: DetailsViewSectionType) => {
    const prev = get(detailsViewSectionState);

    set(detailsViewSectionState, { ...prev, detailViews: concat(prev.detailViews, [newDetailView]) });
  }
);

export const detailsViewSections = atom(
  (get) => get(detailsViewSectionState).detailsViewSections,
  (get, set, newDetailViewSection: DetailsViewSectionType | DetailsViewSection) => {
    const prev = get(detailsViewSectionState);
    let section = newDetailViewSection as DetailsViewSection;
    if (isFunction(section)) {
      section = { id: `generated-id-${Date.now().toString(36)}`, section: section };
    }

    set(detailsViewSectionState, {
      ...prev,
      detailsViewSections: concat(prev.detailsViewSections, section),
    });
  }
);

export const detailsViewSectionsProcessors = atom(
  (get) => get(detailsViewSectionState).detailsViewSectionsProcessors,
  (get, set, newAction: DetailsViewsSectionProcessor | DetailsViewsSectionProcessor['processor']) => {
    const prev = get(detailsViewSectionState);

    const normalizedProcessor = _normalizeProcessor<
      DetailsViewsSectionProcessor,
      DetailsViewsSectionProcessor['processor']
    >(newAction);

    set(detailsViewSectionState, {
      ...prev,
      detailsViewSectionsProcessors: concat(prev.detailsViewSectionsProcessors, normalizedProcessor),
    });
  }
);
