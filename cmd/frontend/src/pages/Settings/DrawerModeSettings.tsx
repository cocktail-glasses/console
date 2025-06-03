import { useTranslation } from 'react-i18next';

import { useAtom } from 'jotai';

import { FormControlLabel, Switch } from '@mui/material';

import { TooltipIcon } from '@components/common';
import { detailDrawerEnabled } from '@lib/stores';

export default function DrawerModeSettings() {
  const { t } = useTranslation('translation');

  const [isDrawerEnabled, setIsDrawerEnabled] = useAtom(detailDrawerEnabled);

  function drawerModeToggle() {
    setIsDrawerEnabled((prev) => !prev);
  }

  return (
    <FormControlLabel
      control={<Switch checked={isDrawerEnabled} onClick={drawerModeToggle} name="drawerMode" color="primary" />}
      label={
        <>
          {t('translation|Overlay')}
          <TooltipIcon>
            {t('translation|Shows resource details in a pane overlaid on the list view instead of a full page.')}
          </TooltipIcon>
        </>
      }
    />
  );
}
