import { forwardRef } from 'react';

import Container from '@mui/material/Container';

import TooltipLight from './TooltipLight';

import { Icon, IconProps } from '@iconify/react';

export interface TooltipIconProps {
  children: string;
  /** A materialui/core icon. */
  icon?: IconProps['icon'];
}

const IconReffed = forwardRef((props: IconProps, ref: any) => {
  return (
    <Container ref={ref} sx={{ display: 'inline', padding: '0 .3rem' }}>
      <Icon {...props} />
    </Container>
  );
});

export default function TooltipIcon(props: TooltipIconProps) {
  const { children, icon = 'mdi:information-outline' } = props;

  return (
    <TooltipLight title={children} interactive>
      <IconReffed icon={icon} />
    </TooltipLight>
  );
}
