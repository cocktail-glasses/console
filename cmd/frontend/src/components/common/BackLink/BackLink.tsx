import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { Icon } from '@iconify/react';

export interface BackLinkProps {
  /** The location to go back to. If not provided, the browser's history will be used. */
  to?: string | ReturnType<typeof useLocation>;
}

export default function BackLink(props: BackLinkProps) {
  const { to: backLink = '' } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();

  // We only want to update when the backLink changes (not the history).
  React.useEffect(() => {}, [backLink]);

  return (
    <Button
      startIcon={<Icon icon="mdi:chevron-left" />}
      size="small"
      sx={(theme) => ({ color: theme.palette.primaryColor })}
      onClick={() => {
        // If there is no back link, go back in history.
        if (!backLink) {
          navigate(-1);
          return;
        }

        navigate(backLink);
      }}
    >
      <Typography style={{ paddingTop: '3px' }}>{t('translation|Back')}</Typography>
    </Button>
  );
}
