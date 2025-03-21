import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { Box, Typography, Stack } from '@mui/material';

import commonStyle from '../../Common.module.scss';
import { applicationsFormValue } from '../../schemas';
import AddApplicationDialog from '../AddApplicationSearchList/AddApplicationDialog';
import FormAction from './FormAction';

import AddButton from '@components/molecules/KaaS/Button/AddButton/AddButton';
import LinkText from '@components/molecules/KaaS/Link/LinkText';

interface ApplicationsSubFormProps {
  values?: applicationsFormValue;
  onSave: SubmitHandler<applicationsFormValue>;
}

const ApplicationsSubForm = ({ values, onSave }: ApplicationsSubFormProps) => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  console.log(values, onSave);
  return (
    <Box component="form">
      <Stack sx={{ marginY: '19.92px' }}>
        <Typography variant="h6">Applications to Install</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <p>
            No application selected to install on cluster creation, <LinkText>learn more about Applicaitons</LinkText>
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
      <FormAction onSave={() => {}} isValid />
    </Box>
  );
};

export default ApplicationsSubForm;
