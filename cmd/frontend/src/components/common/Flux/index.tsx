import Canaries from './flagger/canaries';
import CanaryDetails from './flagger/canarydetails';
import { HelmReleases } from './helm-releases/HelmReleaseList';
import { FluxHelmReleaseDetailView } from './helm-releases/HelmReleaseSingle';
import { ImageAutomation } from './image-automation/ImageAutomationList';
import { FluxImageAutomationDetailView } from './image-automation/ImageAutomationSingle';
import { Kustomizations } from './kustomizations/KustomizationList';
import { FluxKustomizationDetailView } from './kustomizations/KustomizationSingle';
import { Notifications } from './notifications/NotificationList';
import { Notification } from './notifications/NotificationSingle';
import { FluxOverview } from './overview';
import { FluxRunTime } from './runtime/RuntimeList';
import { FluxSources } from './sources/SourceList';
import { FluxSourceDetailView } from './sources/SourceSingle';

import { Icon } from '@iconify/react';
import { RouteGroupTable } from '@lib/router';

export const HelmRelease = {
  icon: <Icon icon="simple-icons:flux" width="70%" height="70%" />,
  color: 'rgb(50, 108, 229)',
};

export const HelmRepository = {
  icon: <Icon icon="simple-icons:flux" width="70%" height="70%" />,
  color: 'rgb(50, 108, 229)',
};

export const Kustomization = {
  icon: <Icon icon="simple-icons:flux" width="70%" height="70%" />,
  color: 'rgb(50, 108, 229)',
};

export const OCIRepository = {
  icon: <Icon icon="simple-icons:flux" width="70%" height="70%" />,
  color: 'rgb(50, 108, 229)',
};

export { fluxSource } from './mapView';

export const fluxRouteGroupTable: RouteGroupTable = {
  overview: {
    indexId: 'overview',
    routes: [
      {
        id: 'overview',
        path: '/flux/overview',
        element: () => <FluxOverview />,
      },
    ],
  },
  kustomizations: {
    indexId: 'kustomizations',
    routes: [
      {
        id: 'kustomizations',
        path: '/flux/kustomizations',
        element: () => <Kustomizations />,
      },
      {
        id: 'kustomize',
        path: '/flux/kustomize/kustomizations/:namespace/:name',
        element: () => <FluxKustomizationDetailView />,
      },
    ],
  },
  helmreleases: {
    indexId: 'helmreleases',
    routes: [
      {
        id: 'helmreleases',
        path: '/flux/helmreleases',
        element: () => <HelmReleases />,
      },
      {
        id: 'helm',
        path: '/flux/helm/helmreleases/:namespace/:name',
        element: () => <FluxHelmReleaseDetailView />,
      },
    ],
  },
  sources: {
    indexId: 'sources',
    routes: [
      {
        id: 'sources',
        path: '/flux/sources',
        element: () => <FluxSources />,
      },
      {
        id: 'source',
        path: '/flux/source/:pluralName/:namespace/:name',
        element: () => <FluxSourceDetailView />,
      },
    ],
  },
  imageAutomations: {
    indexId: 'image-automations',
    routes: [
      {
        id: 'image-automations',
        path: '/flux/image-automations',
        element: () => <ImageAutomation />,
      },
      {
        id: 'image',
        path: '/flux/image/:pluralName/:namespace/:name',
        element: () => <FluxImageAutomationDetailView />,
      },
    ],
  },
  notifications: {
    indexId: 'notifications',
    routes: [
      {
        id: 'notifications',
        path: '/flux/notifications',
        element: () => <Notifications />,
      },
      {
        id: 'notification',
        path: '/flux/notification/:pluralName/:namespace/:name',
        element: () => <Notification />,
      },
    ],
  },
  canaries: {
    indexId: 'canaries',
    routes: [
      {
        id: 'canaries',
        path: '/flux/flagger/canaries',
        element: () => <Canaries />,
      },
      {
        id: 'canary',
        path: '/flux/flagger/canaries/:namespace/:name',
        element: () => <CanaryDetails />,
      },
    ],
  },
  runtime: {
    indexId: 'runtime',
    routes: [
      {
        id: 'runtime',
        path: '/flux/runtime',
        element: () => <FluxRunTime />,
      },
    ],
  },
};
