import { Trans, useTranslation } from 'react-i18next';

import { Accordion, AccordionDetails, AccordionSummary, Box, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import headlampBrokenImage from '@assets/headlamp-broken.svg';
import { Icon } from '@iconify/react/dist/iconify.js';

const WidthImg = styled('img')({
  width: '100%',
});

export interface ErrorComponentProps {
  /** The main title to display. By default it is: "Uh-oh! Something went wrong." */
  title?: React.ReactNode;
  /** The message to display. By default it is: "Head back <a href="..."> home</a>." */
  message?: React.ReactNode;
  /** The graphic or element to display as a main graphic. If used as a string, it will be
   * used as the source for displaying an image. By default it is "headlamp-broken.svg". */
  graphic?: React.ReactChild;
  /** Whether to use Typography or not. By default it is true. */
  withTypography?: boolean;
  /** The error object to display. */
  error?: Error;
}

export default function ErrorComponent(props: ErrorComponentProps) {
  const { t } = useTranslation();
  const {
    title = t('Uh-oh! Something went wrong.'),
    message = '',
    withTypography = true,
    graphic = headlampBrokenImage,
    error,
  } = props;
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      sx={{
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Grid columns={{ xs: 12 }}>
        {typeof graphic === 'string' ? <WidthImg src={graphic} alt="" /> : graphic}
        {withTypography ? (
          <Typography variant="h1" sx={{ fontSize: '2.125rem', lineHeight: 1.2, fontWeight: 400 }}>
            {title}
          </Typography>
        ) : (
          title
        )}
        {withTypography ? (
          <Typography variant="h2" sx={{ fontSize: '1.25rem', lineHeight: 3.6, fontWeight: 500 }}>
            {message ? (
              message
            ) : (
              <Trans t={t}>
                Head back <Link href="/">home</Link>.
              </Trans>
            )}
          </Typography>
        ) : (
          message
        )}
      </Grid>
      {!!error?.stack && (
        <Grid>
          <Box
            sx={{
              width: '100%',
              maxWidth: 800,
            }}
          >
            <Accordion>
              <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
                <Typography>{t('translation|Error Details')}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box textAlign="right">
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(error.stack!);
                    }}
                  >
                    {t('translation|Copy')}
                  </Button>
                </Box>
                <Typography
                  variant="body2"
                  component="pre"
                  sx={{
                    textWrapMode: 'wrap',
                    textAlign: 'left',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {error.stack}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Grid>
      )}
    </Grid>
  );
}
