import { MoreVert } from '@mui/icons-material';
import { Box } from '@mui/material';

import style from './AddonButton.module.scss';

interface AddonButtonProps {
  logoSrc: string;
}

const AddonButton = ({ logoSrc }: AddonButtonProps) => (
  <Box className={style.addonBtnContainer}>
    <Box className={style.addonLogoContainer}>
      <Box component="img" className={style.addonLogo} src={logoSrc} alt={logoSrc} />
    </Box>
    <Box className={style.addonActionContainer}>
      <MoreVert />
    </Box>
  </Box>
);

export default AddonButton;
