import { useState } from 'react';

import { OpenInNew } from '@mui/icons-material';
import { Box, Link, Typography, Stack } from '@mui/material';

// import '../../common.scss';
import AddApplicationDialog from '../AddApplicationSearchList/AddApplicationDialog';

import AddButton from '@components/molecules/KaaS/Button/AddButton/AddButton';

const ApplicationsSubForm = () => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  return (
    <Stack>
      <Typography variant="h6">Applications to Install</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <p>
          No application selected to install on cluster creation,{' '}
          <Link sx={{ display: 'inline-flex', alignItems: 'center' }}>
            learn more about Applicaitons
            <OpenInNew sx={{ fontSize: 15 }} />
          </Link>
        </p>
        <AddButton
          label="Add Application"
          variant="outlined"
          onClick={() => setIsOpenDialog(true)}
          sx={{ minHeight: '42px', maxHeight: '42px', textTransform: 'none' }}
        />
      </Box>

      <AddApplicationDialog isOpen={isOpenDialog} onClose={() => setIsOpenDialog(false)} />
    </Stack>
  );
};

export default ApplicationsSubForm;
