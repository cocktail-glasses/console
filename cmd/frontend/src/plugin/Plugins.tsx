import { useEffect } from 'react';

import { useSetAtom } from 'jotai';

import { size } from 'lodash';

import {
  fluxRouteGroupTable,
  fluxSource,
  HelmRelease,
  HelmRepository,
  Kustomization,
  OCIRepository,
} from '@components/common/Flux';
import { addPrometheusMetricsButton, addSubheaderSection } from '@components/common/Prometheus';
import { GroupType, hasMenu, MenuType } from '@lib/menu';
import {
  detailsViewSectionsProcessors,
  detailsViewSectionState,
  detailsViewSectionInitState,
} from '@lib/stores/detailViewSection';
import { addGraphSource, addkindIcon, graphView, graphViewInitialState } from '@lib/stores/graphView';
import { headerActionsProcessor, actionButtons, actionButtonsInitState } from '@lib/stores/headerAction';
import { addRouteGroupTable, routeGroupTable, routeGroupTableInitState } from '@lib/stores/router';

interface PluginsProps {
  groups: GroupType[];
  menus: MenuType[];
}

export default function Plugins({ menus }: PluginsProps) {
  const registerDetailsViewSectionsProcessor = useSetAtom(detailsViewSectionsProcessors);
  const registerDetailsViewHeaderActionsProcessor = useSetAtom(headerActionsProcessor);

  const registerRouteGroupTable = useSetAtom(addRouteGroupTable);

  // graphViews..
  const registerMapSource = useSetAtom(addGraphSource);
  const registerKindIcon = useSetAtom(addkindIcon);

  // resetter..
  const resetDetailsViewSections = useSetAtom(detailsViewSectionState);
  const resetDetailsViewHeaderActions = useSetAtom(actionButtons);
  const resetGraphView = useSetAtom(graphView);
  const resetRouteGroupTable = useSetAtom(routeGroupTable);

  useEffect(() => {
    // 중복 호출을 막기 위해 menu가 로드 된 이후에 아래 로직을 수행한다.
    if (size(menus) == 0) return;

    registerDetailsViewSectionsProcessor(addSubheaderSection);
    registerDetailsViewHeaderActionsProcessor(addPrometheusMetricsButton);

    // 사용자 권한에 따른 메뉴에 flux가 존재한다면...
    if (hasMenu(menus, 'flux')) {
      registerRouteGroupTable(fluxRouteGroupTable);
      registerMapSource(fluxSource);
      registerKindIcon({ kind: 'HelmRelease', definition: HelmRelease });
      registerKindIcon({ kind: 'HelmRepository', definition: HelmRepository });
      registerKindIcon({ kind: 'Kustomization', definition: Kustomization });
      registerKindIcon({ kind: 'OCIRepository', definition: OCIRepository });
    }

    return () => {
      resetDetailsViewSections(detailsViewSectionInitState);
      resetDetailsViewHeaderActions(actionButtonsInitState);
      resetGraphView(graphViewInitialState);
      resetRouteGroupTable(routeGroupTableInitState);
    };
  }, [menus]);

  return null;
}
