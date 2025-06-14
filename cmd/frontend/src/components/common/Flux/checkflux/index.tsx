import { Box, Link } from '@mui/material';

import SectionBox from '@components/common/SectionBox';

export default function Flux404(props: Readonly<{ message: string; docs?: string }>) {
  const { message, docs } = props;

  // return a box with a message that flux is not installed and a link to the flux installation guide
  return (
    <Box
      // center this box and also wrap it in a white background with some box shadow
      sx={{
        padding: '1rem',
        alignItems: 'center',
        margin: '2rem auto',
        maxWidth: '600px',
      }}
    >
      <h1>{message}</h1>
      <p>
        Follow the{' '}
        <Link target="_blank" href={docs ?? 'https://fluxcd.io/docs/installation/'}>
          installation guide
        </Link>{' '}
        to install flux on your cluster
      </p>
    </Box>
  );
}

export function NotSupported(props: { typeName: string }) {
  const { typeName } = props;
  return (
    <SectionBox title={typeName}>
      <p>Flux installation has no support for {typeName}.</p>
      <p>
        Follow the{' '}
        <Link target="_blank" href="https://fluxcd.io/docs/installation/">
          installation guide
        </Link>{' '}
        to support {typeName} on your cluster
      </p>
    </SectionBox>
  );
}
