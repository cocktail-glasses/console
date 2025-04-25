import { useEffect } from 'react';

import { useSetAtom } from 'jotai';

import { addPrometheusMetricsButton, addSubheaderSection } from '@components/common/Prometheus';
import { detailsViewSectionsProcessors } from '@lib/stores/detailViewSection';
import { headerActionsProcessor } from '@lib/stores/headerAction';

export default function Plugins() {
  const registerDetailsViewSectionsProcessor = useSetAtom(detailsViewSectionsProcessors);
  const registerDetailsViewHeaderActionsProcessor = useSetAtom(headerActionsProcessor);

  // only run on first load
  useEffect(() => {
    registerDetailsViewSectionsProcessor(addSubheaderSection);
    registerDetailsViewHeaderActionsProcessor(addPrometheusMetricsButton);
  }, []);

  return null;
}
