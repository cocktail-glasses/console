import { isValidElement, useEffect, useMemo } from 'react';

import ErrorBoundary from '@components/common/ErrorBoundary';
import { KubeObject } from '@lib/k8s/cluster.ts';
import { HeadlampEventType, useEventCallback } from 'redux/headlampEventSlice.ts';
import { useTypedSelector } from 'redux/reducers/reducers.tsx';

export interface DetailsViewSectionProps {
  resource: KubeObject;
}
export type DetailsViewSectionType =
  | ((...args: any[]) => JSX.Element | null | React.ReactNode)
  | null
  | React.ReactElement
  | React.ReactNode;

/**
 * View components registered by plugins in the different Details views.
 *
 * @see registerDetailsViewSection
 */
export default function DetailsViewSection(props: DetailsViewSectionProps) {
  const { resource } = props;
  const detailViews = useTypedSelector((state) => state.detailsViewSection.detailViews);
  const dispatchHeadlampEvent = useEventCallback(HeadlampEventType.DETAILS_VIEW);

  useEffect(() => {
    dispatchHeadlampEvent({ resource });
  }, [resource, dispatchHeadlampEvent]);

  const memoizedComponents = useMemo(
    () =>
      detailViews.map((Component, index) => {
        if (!resource || !Component) {
          return null;
        }

        return <ErrorBoundary key={index}>{isValidElement(Component) ? Component : <></>}</ErrorBoundary>;
      }),
    [detailViews, resource]
  );
  return <>{memoizedComponents}</>;
}
