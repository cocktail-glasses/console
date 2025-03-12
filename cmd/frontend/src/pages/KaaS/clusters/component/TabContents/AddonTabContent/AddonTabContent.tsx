import { Box, Stack } from '@mui/material';

import style from './AddonTabContent.module.scss';

import AddButton from '@components/molecules/KaaS/Button/AddButton/AddButton';
import AddonButton from '@components/molecules/KaaS/Button/AddonButton/AddonButton';
import NodeExporter from '@resources/addon_prometheus-node-exporter.svg';

const AddonTabContent = () => (
  <Stack className={style.addonContent}>
    <Box className={style.menuContainer}>
      <AddButton label="Install Addon" variant="outlined" />
    </Box>
    <Box className={style.actionButtonContainer}>
      <AddonButton logoSrc={NodeExporter} />
    </Box>
  </Stack>
);

export default AddonTabContent;
