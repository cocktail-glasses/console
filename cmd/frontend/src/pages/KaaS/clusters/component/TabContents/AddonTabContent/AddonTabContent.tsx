import { MoreVert, Add } from '@mui/icons-material';
import { Box, Button, Stack } from '@mui/material';

import style from './AddonTabContent.module.scss';

import NodeExporter from '@resources/addon_prometheus-node-exporter.svg';

const AddonTabContent = () => (
  <Stack className={style.addonContent}>
    <Box className={style.menuContainer}>
      <Button variant="outlined" startIcon={<Add />}>
        Install Addon
      </Button>
    </Box>
    <Box className={style.actionButtonContainer}>
      <AddonButton logoSrc={NodeExporter} />
    </Box>
  </Stack>
);

interface AddonButtonProps {
  logoSrc: string;
}

const AddonButton = ({ logoSrc }: AddonButtonProps) => (
  <Box className={style.addonBtnContainer}>
    <Box className={style.addonLogoContainer}>
      <img className={style.addonLogo} src={logoSrc} alt={logoSrc} />
    </Box>
    <Box className={style.addonActionContainer}>
      <MoreVert />
    </Box>
  </Box>
);

export default AddonTabContent;
