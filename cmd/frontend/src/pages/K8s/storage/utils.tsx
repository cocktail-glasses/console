import { StatusLabel } from '@components/common/Label';

export function StatusLabelByPhase(phase: string) {
  return (
    <StatusLabel status={phase === 'Bound' ? 'success' : phase === 'available' ? 'warning' : 'error'}>
      {phase}
    </StatusLabel>
  );
}
