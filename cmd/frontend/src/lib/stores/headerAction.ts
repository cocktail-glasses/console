import { atom } from 'jotai';

import { concat, isFunction } from 'lodash';

import { KubeObject } from '@lib/k8s/KubeObject';

export type HeaderActionsProcessor = {
  id: string;
  processor: HeaderActionFuncType;
};

export type HeaderActionFuncType = (resource: KubeObject | null, actions: HeaderAction[]) => HeaderAction[];

export type HeaderAction = {
  id: string;
  action?: HeaderActionType;
};

export type HeaderActionType =
  | ((...args: any[]) => JSX.Element | null | React.ReactNode)
  | null
  | React.ReactElement
  | React.ReactNode;

export enum DefaultHeaderAction {
  RESTART = 'RESTART',
  DELETE = 'DELETE',
  EDIT = 'EDIT',
  SCALE = 'SCALE',
  POD_LOGS = 'POD_LOGS',
  POD_TERMINAL = 'POD_TERMINAL',
  POD_ATTACH = 'POD_ATTACH',
  NODE_TOGGLE_CORDON = 'NODE_TOGGLE_CORDON',
  NODE_DRAIN = 'NODE_DRAIN',
}

/**
 * Normalizes a header actions processor by ensuring it has an 'id' and a processor function.
 *
 * If the processor is passed as a function, it will be wrapped in an object with a generated ID.
 *
 * @param action - The payload action containing the header actions processor.
 * @returns The normalized header actions processor.
 */
function _normalizeProcessor<Processor, ProcessorProcessor>(action: Processor | ProcessorProcessor) {
  let headerActionsProcessor: Processor = action as Processor;

  if (isFunction(headerActionsProcessor)) {
    headerActionsProcessor = {
      id: `generated-id-${Date.now().toString(36)}`,
      processor: headerActionsProcessor,
    } as Processor;
  }

  return headerActionsProcessor;
}

export interface HeaderActionState {
  headerActions: HeaderAction[];
  headerActionsProcessors: HeaderActionsProcessor[];
}

export const actionButtons = atom<HeaderActionState>({
  headerActions: [],
  headerActionsProcessors: [],
});
if (process.env.NODE_ENV !== 'production') {
  actionButtons.debugLabel = 'actionButtons';
}

export const headerAction = atom(
  (get) => get(actionButtons).headerActions,
  (get, set, newAction: HeaderActionType | HeaderAction) => {
    const prev = get(actionButtons);

    let headerAction = newAction as HeaderAction;
    if (isFunction(newAction)) {
      headerAction = { id: `generated-id-${Date.now().toString(36)}`, action: newAction };
    }

    set(actionButtons, { ...prev, headerActions: concat(prev.headerActions, headerAction) });
  }
);

export const headerActionsProcessor = atom(
  (get) => get(actionButtons).headerActionsProcessors,
  (get, set, newActionProcessor: HeaderActionsProcessor | HeaderActionsProcessor['processor']) => {
    const prev = get(actionButtons);
    const normalizedProcessor = _normalizeProcessor<HeaderActionsProcessor, HeaderActionsProcessor['processor']>(
      newActionProcessor
    );

    set(actionButtons, {
      ...prev,
      headerActionsProcessors: concat(prev.headerActionsProcessors, normalizedProcessor),
    });
  }
);
