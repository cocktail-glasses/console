import { useMemo } from 'react';

import { LightTooltip } from '@components/common/Tooltip';

export interface LabelListItemProps {
  labels: React.ReactNode[];
}

export default function LabelListItem(props: LabelListItemProps) {
  const { labels = [] } = props;
  const [text, tooltip] = useMemo(() => {
    const text = labels.join(', ');
    const tooltip = labels.join('\n');
    return [text, tooltip];
  }, [labels]);

  if (!text) {
    return null;
  }

  return (
    <LightTooltip title={tooltip} interactive>
      <span>{text}</span>
    </LightTooltip>
  );
}
