import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';

import NumRowsInput from './NumRowsInput.tsx';
import ThemeChangeButton from './ThemeChangeButton.tsx';
import { useSettings } from './hook.tsx';

import { ActionButton, NameValueTable, SectionBox } from '@components/common';
import TimezoneSelect from '@components/common/TimezoneSelect';
import LocaleSelect from 'i18n/LocaleSelect/LocaleSelect.tsx';
import { setVersionDialogOpen } from 'redux/actions/actions.tsx';
import { setAppSettings } from 'redux/configSlice.ts';
import { defaultTableRowsPerPageOptions } from 'redux/configSlice.ts';

export default function Settings() {
  const { t } = useTranslation(['translation']);
  const settingsObj = useSettings();
  const storedTimezone = settingsObj.timezone;
  const storedRowsPerPageOptions = settingsObj.tableRowsPerPageOptions;
  const [selectedTimezone, setSelectedTimezone] = useState<string>(
    storedTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setAppSettings({
        timezone: selectedTimezone,
      })
    );
  }, [selectedTimezone, dispatch]);

  return (
    <SectionBox
      title={t('translation|General Settings')}
      headerProps={{
        actions: [
          <ActionButton
            key="version"
            icon="mdi:information-outline"
            description={t('translation|Version')}
            onClick={() => {
              dispatch(setVersionDialogOpen(true));
            }}
          />,
        ],
      }}
      backLink
    >
      <NameValueTable
        valueCellProps={{
          sx: (theme) => ({
            width: '60%',
            [theme.breakpoints.down('sm')]: {
              width: 'unset',
            },
          }),
        }}
        rows={[
          {
            name: t('translation|Language'),
            value: <LocaleSelect showFullNames formControlProps={{ className: '' }} />,
          },
          {
            name: t('translation|Theme'),
            value: <ThemeChangeButton showBothIcons />,
          },
          {
            name: t('translation|Number of rows for tables'),
            value: <NumRowsInput defaultValue={storedRowsPerPageOptions || defaultTableRowsPerPageOptions} />,
          },
          {
            name: t('translation|Timezone to display for dates'),
            value: (
              <Box maxWidth="350px">
                <TimezoneSelect initialTimezone={selectedTimezone} onChange={(name) => setSelectedTimezone(name)} />
              </Box>
            ),
          },
        ]}
      />
    </SectionBox>
  );
}
