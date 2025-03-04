import { Add, OpenInNew } from '@mui/icons-material';
import { Box, Button, Link, Stack, Switch, Typography } from '@mui/material';

import style from './ApplicationsTabContent.module.scss';

const ApplicationsTabContent = () => (
  <Stack className={style.applicationsContent}>
    <Box className={style.menuContainer}>
      <p className={style.message}>
        Install third party Applications into a cluster,{' '}
        <Link className={style.link}>
          learn more about Applicaitons
          <OpenInNew className={style.icon} />.
        </Link>
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
        <Button variant="outlined" startIcon={<Add />} size="large" sx={{ height: '50px' }}>
          <Typography variant="caption">Add Application</Typography>
        </Button>
      </Box>
    </Box>
    <Box sx={{ marginTop: '20px', textAlign: 'center' }}>
      <Typography variant="body2">No applications added.</Typography>
    </Box>
  </Stack>
);

export default ApplicationsTabContent;
