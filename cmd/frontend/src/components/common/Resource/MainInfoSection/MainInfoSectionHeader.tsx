import { Children, isValidElement } from 'react';
import { useLocation } from 'react-router-dom';

import { has } from 'lodash';

import ErrorBoundary from '../../ErrorBoundary';
import SectionHeader, { HeaderStyle } from '../../SectionHeader';
import DeleteButton from '../DeleteButton';
import EditButton from '../EditButton';
import { RestartButton } from '../RestartButton';
import ScaleButton from '../ScaleButton';

import { KubeObject } from '@lib/k8s/cluster';
import { DefaultHeaderAction, HeaderAction } from 'redux/actionButtonsSlice';
import { useTypedSelector } from 'redux/reducers/reducers';

export interface MainInfoHeaderProps {
  resource: KubeObject | null;
  headerSection?: ((resource: KubeObject | null) => React.ReactNode) | React.ReactNode;
  title?: string;
  actions?:
    | ((resource: KubeObject | any | null) => React.ReactNode[] | null | HeaderAction[])
    | React.ReactNode[]
    | null
    | HeaderAction[];
  headerStyle?: HeaderStyle;
  noDefaultActions?: boolean;
  /** The route or location to go to. If it's an empty string, then the "browser back" function is used. If null, no back button will be shown. */
  backLink?: string | ReturnType<typeof useLocation> | null;
}

export function MainInfoHeader(props: MainInfoHeaderProps) {
  const { resource, title, actions = [], headerStyle = 'main', noDefaultActions = false } = props;
  const headerActions = useTypedSelector((state) => state.actionButtons.headerActions);
  const headerActionsProcessors = useTypedSelector((state) => state.actionButtons.headerActionsProcessors);
  function setupAction(headerAction: HeaderAction) {
    let Action = has(headerAction, 'action') ? (headerAction as any).action : headerAction;

    if (!noDefaultActions && has(headerAction, 'id')) {
      switch ((headerAction as HeaderAction).id) {
        case DefaultHeaderAction.RESTART:
          Action = RestartButton;
          break;
        case DefaultHeaderAction.SCALE:
          Action = ScaleButton;
          break;
        case DefaultHeaderAction.EDIT:
          Action = EditButton;
          break;
        case DefaultHeaderAction.DELETE:
          Action = DeleteButton;
          break;
        default:
          break;
      }
    }

    if (!Action || (headerAction as HeaderAction).action === null) {
      return null;
    }

    if (isValidElement(Action)) {
      return <ErrorBoundary>{Action}</ErrorBoundary>;
    } else if (Action === null) {
      return null;
    } else if (typeof Action === 'function') {
      return (
        <ErrorBoundary>
          <Action item={resource} />
        </ErrorBoundary>
      );
    }
  }

  const defaultActions: HeaderAction[] = [
    {
      id: DefaultHeaderAction.RESTART,
    },
    {
      id: DefaultHeaderAction.SCALE,
    },
    {
      id: DefaultHeaderAction.EDIT,
    },
    {
      id: DefaultHeaderAction.DELETE,
    },
  ];

  let hAccs: HeaderAction[] = [];
  const accs = typeof actions === 'function' ? actions(resource) || [] : actions;
  if (accs !== null) {
    hAccs = [...accs].map((action, i) => {
      if ((action as HeaderAction)?.id !== undefined) {
        return action as HeaderAction;
      } else {
        return { id: `gen-${i}`, action } as HeaderAction;
      }
    });
  }

  let actionsProcessed = [...headerActions, ...hAccs, ...defaultActions];
  if (headerActionsProcessors.length > 0) {
    for (const headerProcessor of headerActionsProcessors) {
      actionsProcessed = headerProcessor.processor(resource, actionsProcessed);
    }
  }

  const allActions = Children.toArray(
    (function propsActions() {
      const pluginAddedActions = actionsProcessed.map(setupAction);
      return Children.toArray(pluginAddedActions);
    })()
  );

  return (
    <SectionHeader title={title || (resource ? resource.kind : '')} headerStyle={headerStyle} actions={allActions} />
  );
}
