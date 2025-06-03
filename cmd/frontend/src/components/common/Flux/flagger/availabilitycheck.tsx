import { Box, Link, Typography } from '@mui/material';

import Loader from '@components/common/Loader';
import { ResourceClasses } from '@lib/k8s';

export default function FlaggerAvailabilityCheck({ children }) {
  const [canary, error] = useCanary();

  if (canary === null && !error) {
    return <Loader title="" />; // Loading state
  }

  if (!canary || error) {
    return (
      <Box
        title="Flagger Not Installed"
        sx={{
          padding: '1rem',
          alignItems: 'center',
          margin: '2rem auto',
          maxWidth: '600px',
        }}
      >
        <h2>Flagger is not installed</h2>
        <Typography variant="body1">
          Follow the{' '}
          <Link target="_blank" href="https://docs.flagger.app/install/flagger-install-on-kubernetes">
            installation guide
          </Link>{' '}
          to install flagger on your cluster
        </Typography>
      </Box>
    );
  }

  return children;
}

export function useCanary() {
  const [canary, error] = ResourceClasses.CustomResourceDefinition.useGet('canaries.flagger.app');
  return [canary, error];
}
