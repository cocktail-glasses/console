import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { OpenInNew } from '@mui/icons-material';
import { Box, Link, Typography, Stack } from '@mui/material';

import commonStyle from '../../Common.module.scss';
import { applicationsFormValue } from '../../schemas';
import AddApplicationDialog from '../AddApplicationSearchList/AddApplicationDialog';
import FormAction from './FormAction';

import AddButton from '@components/molecules/KaaS/Button/AddButton/AddButton';

interface ApplicationsSubFormProps {
  values?: applicationsFormValue;
  onSubmit: SubmitHandler<applicationsFormValue>;
}

const ApplicationsSubForm = ({ values, onSubmit }: ApplicationsSubFormProps) => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  console.log(values, onSubmit);
  return (
    <Box component="form">
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
            className={commonStyle.kaasQuaternaryColor}
          />
        </Box>

        <AddApplicationDialog isOpen={isOpenDialog} onClose={() => setIsOpenDialog(false)} />
      </Stack>
      <FormAction onSubmit={() => {}} isValid />
    </Box>
  );
};

export default ApplicationsSubForm;
