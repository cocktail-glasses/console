import { useCallback, useMemo } from 'react';

import { atom, useAtom } from 'jotai';

// import { useLocalStorageState } from '../globalSearch/useLocalStorageState';
import { maxZoom, minZoom, viewportPaddingPx } from './graphConstants';

import { getNodesBounds, getViewportForBounds, Node, useReactFlow, useStore } from '@xyflow/react';

/**
 * Zoom Mode represents different approaches to viewport calculation
 *
 * - 100% (default)
 *   Will try to fit nodes without exceeding 100% zoom
 *   Often results in content overflowing but keeps text readable
 *
 * - Fit
 *   Will show everything and zoom out as needed
 */
type zoomMode = '100%' | 'fit';

const zommModeAtom = atom<zoomMode>('100%');

/** Helper hook to deal with viewport zooming */
export const useGraphViewport = () => {
  const [zoomMode, setZoomMode] = useAtom(zommModeAtom);

  // const [zoomMode, setZoomMode] = useLocalStorageState<zoomMode>('map-zoom-mode', '100%');
  const reactFlowWidth = useStore((it) => it.width);
  const reactFlowHeight = useStore((it) => it.height);
  const aspectRatio = useStore((it) => it.width / it.height);
  const flow = useReactFlow();

  const updateViewport = useCallback(
    ({
      nodes = flow.getNodes(),
      mode = zoomMode,
    }: {
      /** List of nodes, if not provided will use current nodes in the graph */
      nodes?: Node[];
      /** Zoom mode. More info in the type definition {@link zoomMode} */
      mode?: zoomMode;
    }) => {
      if (mode !== zoomMode) {
        setZoomMode(() => mode);
      }

      const bounds = getNodesBounds(nodes);

      if (mode === 'fit') {
        const viewport = getViewportForBounds(
          {
            x: bounds.x - viewportPaddingPx,
            y: bounds.y - viewportPaddingPx,
            width: bounds.width + viewportPaddingPx * 2,
            height: bounds.height + viewportPaddingPx * 2,
          },
          reactFlowWidth,
          reactFlowHeight,
          minZoom,
          maxZoom,
          0
        );

        flow.setViewport(viewport);
        return;
      }

      if (mode === '100%') {
        const topLeftOrigin = { x: viewportPaddingPx, y: viewportPaddingPx };
        const centerOrigin = {
          x: reactFlowWidth / 2 - bounds.width / 2,
          y: reactFlowHeight / 2 - bounds.height / 2,
        };

        const xFits = bounds.width + viewportPaddingPx * 2 <= reactFlowWidth;
        const yFits = bounds.height + viewportPaddingPx * 2 <= reactFlowHeight;

        const defaultZoomViewport = {
          x: xFits ? centerOrigin.x : topLeftOrigin.x,
          y: yFits ? centerOrigin.y : topLeftOrigin.y,
          zoom: 1,
        };

        flow.setViewport(defaultZoomViewport);
        return;
      }

      console.error('Unknown zoom mode', mode);
    },
    [flow, zoomMode, reactFlowWidth, reactFlowHeight]
  );

  return useMemo(() => ({ updateViewport, aspectRatio }), [updateViewport, aspectRatio]);
};
