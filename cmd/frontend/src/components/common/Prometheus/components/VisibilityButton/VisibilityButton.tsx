import { useState } from 'react';

import { useSetAtom } from 'jotai';

import { Tooltip } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';

import { ChartEnabledKinds } from '../../util';

import { Icon } from '@iconify/react';
import { KubeObject } from '@lib/k8s/KubeObject';
import { showMetricSection } from '@lib/stores/prometheus';

export interface VisibilityButtonProps {
  resource?: KubeObject;
}

export function VisibilityButton(props: VisibilityButtonProps) {
  const { resource } = props;
  const [isVisible, setIsVisible] = useState(true);
  const setShowMetricSection = useSetAtom(showMetricSection);

  const description = isVisible ? 'Show Prometheus metrics' : 'Hide Prometheus metrics';
  const icon = isVisible ? 'mdi:chart-box' : 'mdi:chart-box-outline';

  if (!ChartEnabledKinds.includes(resource?.jsonData?.kind)) {
    return null;
  }

  const handleToggle = () => {
    setIsVisible((prev) => !prev);
    setShowMetricSection((prev) => !prev);
  };

  return (
    <Tooltip title={description}>
      <ToggleButton
        value="toggle-metrics"
        aria-label={description}
        onClick={handleToggle}
        selected={isVisible}
        size="small"
      >
        <Icon icon={icon} width="24px" />
      </ToggleButton>
    </Tooltip>
  );
}
