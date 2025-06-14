import { memo } from 'react';

import { Box } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

import { useGraphView, useNode } from '../GraphView';
import { KubeIcon } from '../kubeIcon/KubeIcon';

const Container = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  background: alpha(theme.palette.background.paper, 0.6),
  border: '1px solid',
  borderColor: theme.palette.divider,
  borderRadius: theme.spacing(1.5),
}));

const Label = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  gap: '4px',
  fontSize: '16px',
  top: '-16px',
  background: theme.palette.background.paper,
  left: '22px',
  padding: '8px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: 'calc(100% - 52px)',
  color: alpha(theme.palette.text.primary, 0.6),
  borderRadius: 2,
}));

export const GroupNodeComponent = memo(({ id }: { id: string }) => {
  const graph = useGraphView();
  const node = useNode(id);

  const handleSelect = () => {
    graph.setNodeSelection(id);
  };

  return (
    <Container
      tabIndex={0}
      role="button"
      onClick={handleSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === 'Space') {
          handleSelect();
        }
      }}
    >
      <Label title={node?.label}>
        {node?.kubeObject ? <KubeIcon kind={node.kubeObject.kind} width="24px" height="24px" /> : (node?.icon ?? null)}
        <Box sx={{ opacity: 0.7 }}>{node?.subtitle}</Box>
        <Box>{node?.label}</Box>
      </Label>
    </Container>
  );
});
