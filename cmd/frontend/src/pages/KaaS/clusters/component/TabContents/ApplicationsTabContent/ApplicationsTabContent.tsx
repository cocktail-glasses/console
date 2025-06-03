import { useState } from 'react';

import { Box, Stack, Switch, Typography } from '@mui/material';

import AddApplicationDialog from '../../AddApplicationSearchList/AddApplicationDialog';
import style from './ApplicationsTabContent.module.scss';

import AddButton from '@components/molecules/KaaS/Button/AddButton/AddButton';
import LinkText from '@components/molecules/KaaS/Link/LinkText';

const ApplicationsTabContent = () => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  return (
    <Stack className={style.applicationsContent}>
      <Box className={style.menuContainer}>
        <p className={style.message}>
          Install third party Applications into a cluster, <LinkText>learn more about Applicaitons</LinkText>
        </p>
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            gap: '10px',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography className={style.marginRight5}>Show System Applications</Typography>
            <Switch className={style.iosSwitch} defaultChecked />
          </Box>
          <AddButton
            label="Add Application"
            onClick={() => setIsOpenDialog(true)}
            variant="outlined"
            size="large"
            textTransform="none"
          />
        </Box>
      </Box>
      <Box sx={{ marginTop: '20px', textAlign: 'center' }}>
        <Typography variant="body2">No applications added.</Typography>
      </Box>

      <AddApplicationDialog isOpen={isOpenDialog} onClose={() => setIsOpenDialog(false)} />
    </Stack>
  );
};

export default ApplicationsTabContent;
