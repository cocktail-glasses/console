import { Fragment, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import MuiDialog, { DialogProps as MuiDialogProps } from '@mui/material/Dialog';
import MuiDialogTitle, { DialogTitleProps } from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';

import ActionButton from '@components/common/ActionButton';

// We export the ConfirmDialog from here because it was declared in this file before being
// moved to its own.
export { ConfirmDialog } from '@components/common/ConfirmDialog';
export type { ConfirmDialogProps } from '@components/common/ConfirmDialog';

export interface OurDialogTitleProps extends DialogTitleProps {
  /** true if you want the title focused in the dialog */
  focusTitle?: boolean;
  buttons?: React.ReactNode[];
  disableTypography?: boolean;
}

/**
 * This is like Material-ui DialogTitle but fixes some a11y issues.
 *
 * First, it needs a h1 because other page content is aria-diable=true'd
 *
 * Additionally, it also focuses the title text as that is where
 * reading can begin.
 */
export function DialogTitle(props: OurDialogTitleProps) {
  const { children, focusTitle, buttons, disableTypography = false, ...other } = props;

  const focusedRef = useCallback(
    (node: any) => {
      if (node !== null) {
        if (focusTitle) {
          node.setAttribute('tabindex', '-1');
          node.focus();
        }
      }
    },
    [focusTitle]
  );

  return (
    <MuiDialogTitle style={{ display: 'flex' }} {...other}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid>
          {disableTypography ? (
            children
          ) : (
            <Typography
              ref={focusedRef}
              variant="h1"
              style={{
                fontSize: '1.25rem',
                fontWeight: 500,
                lineHeight: 1.6,
              }}
            >
              {children}
            </Typography>
          )}
        </Grid>
        {buttons && buttons.length > 0 && (
          <Grid>
            <Box>
              {buttons.map((button, index) => {
                return <Fragment key={index}>{button}</Fragment>;
              })}
            </Box>
          </Grid>
        )}
      </Grid>
    </MuiDialogTitle>
  );
}

export interface OurDialogProps {
  withFullScreen?: boolean;
  onFullScreenToggled?: (isFullScreen: boolean) => void;
  titleProps?: OurDialogTitleProps;
}

// Extends has some issue when exporting.
//   Perhaps because we are stomping over the DialogProps namespace? It's a mystery.
//   Creating an intersection type works fine though. Shrug emoji: 🤷‍♂️
export type DialogProps = OurDialogProps & MuiDialogProps;

export function Dialog(props: DialogProps) {
  const { title, withFullScreen = false, children, onFullScreenToggled, titleProps, ...other } = props;
  const [fullScreen, setFullScreen] = useState(false);
  const { t } = useTranslation();

  function handleFullScreen() {
    setFullScreen((fs) => {
      const newFullScreenState = !fs;

      if (onFullScreenToggled) {
        onFullScreenToggled(newFullScreenState);
      }

      return newFullScreenState;
    });
  }

  function FullScreenButton() {
    if (!withFullScreen) {
      return null;
    }

    return (
      <ActionButton
        description={t('Toggle fullscreen')}
        onClick={handleFullScreen}
        icon={fullScreen ? 'mdi:fullscreen-exit' : 'mdi:fullscreen'}
      />
    );
  }

  function CloseButton() {
    return (
      <ActionButton
        description={t('Close')}
        onClick={() => {
          props.onClose && props.onClose({}, 'escapeKeyDown');
        }}
        icon={'mdi:close'}
      />
    );
  }

  return (
    <MuiDialog maxWidth="lg" scroll="paper" fullWidth keepMounted fullScreen={fullScreen} {...other}>
      {(!!title || withFullScreen) && (
        <DialogTitle buttons={[<FullScreenButton />, <CloseButton />]} {...titleProps}>
          {title}
        </DialogTitle>
      )}
      {children}
    </MuiDialog>
  );
}
