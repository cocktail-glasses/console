import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import { useAtom, useAtomValue } from 'jotai';

import { Box, Drawer, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { join } from 'lodash';

import { ActionButton } from '..';

import { detailDrawerEnabled, selectedResource } from '@lib/stores';
import { KubeObjectDetails } from '@pages/K8s/resourceMap/details/KubeNodeDetails';

export default function DetailsDrawer() {
  const { t } = useTranslation();
  const [selectedResourceValue, setSelectedResource] = useAtom(selectedResource);

  const contentRef = useRef<HTMLDivElement | null>();

  const theme = useTheme();
  const location = useLocation();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isDetailDrawerEnabled = useAtomValue(detailDrawerEnabled);

  function handleCloseDrawerReset() {
    const currentPlacement = location.pathname;
    const pathname = currentPlacement;

    window.history.replaceState({}, '', pathname);
  }

  function closeDrawer() {
    setSelectedResource(null);
    handleCloseDrawerReset();
  }

  const key = join(
    [
      selectedResourceValue?.kind,
      selectedResourceValue?.metadata.namespace,
      selectedResourceValue?.metadata.name,
      selectedResourceValue?.customResourceDefinition,
    ],
    '_'
  );

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [key]);

  if (!selectedResourceValue || isSmallScreen) {
    return null;
  }

  return (
    isDetailDrawerEnabled && (
      <Drawer
        variant="persistent"
        anchor="right"
        open
        onClose={closeDrawer}
        PaperProps={{
          ref: contentRef,
          sx: {
            marginTop: '2rem',
            paddingBottom: '100px',
            paddingX: '1rem',
            // marginTop: '64px',
            boxShadow: '-5px 0 20px rgba(0,0,0,0.08)',
            // borderRadius: '10px',
            width: '45vw',
          },
        }}
      >
        {/* Note: the top margin is needed to not clip into the topbar */}
        <Box
          sx={{
            display: 'flex',
            padding: '1rem',
            justifyContent: 'right',
          }}
        >
          <ActionButton onClick={() => closeDrawer()} icon="mdi:close" description={t('Close')} />
        </Box>
        <Box>
          {selectedResourceValue && (
            <KubeObjectDetails
              resource={{ kind: selectedResourceValue.kind, metadata: selectedResourceValue.metadata }}
              customResourceDefinition={selectedResourceValue.customResourceDefinition}
            />
          )}
        </Box>
      </Drawer>
    )
  );
}
