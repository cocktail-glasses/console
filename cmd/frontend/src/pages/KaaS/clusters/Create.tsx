import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Box, Button, Paper, Typography } from '@mui/material';

import { isEmpty } from 'lodash';

import commonStyle from './Common.module.scss';
import style from './Create.module.scss';
import ApplicationsSubForm from './component/Forms/ApplicationsSubForm';
import ClusterSubForm, { ClusterFormValue } from './component/Forms/ClusterSubForm';
import SettingSubForm, { SettingsFormValue } from './component/Forms/SettingsSubForm';
import StaticNodeForm from './component/Forms/StaticNodeSubForm';
import SummarySubForm from './component/Forms/SummarySubForm';

import AddButton from '@components/molecules/KaaS/Button/AddButton/AddButton';
import CancelButton from '@components/molecules/KaaS/Button/CancelButton/CancelButton';
import ProgressStepperContent from '@components/organisms/KaaS/ProgressStepperContent/ProgressStepperContent';
import clsx from 'clsx';

export interface FormValue {
  cluster: ClusterFormValue;
  settings: SettingsFormValue;
}

export default function Create() {
  const {
    control,
    getValues,
    formState: { isDirty, errors },
    setError,
  } = useForm<FormValue>();

  const stepDatas = [
    {
      label: 'Cluster',
      content: (
        <Controller
          name="cluster"
          control={control}
          render={({ field: { value, onChange } }) => (
            <ClusterSubForm
              values={value}
              handleSubmit={onChange}
              handleError={(errors) => setError('cluster', errors)}
            />
          )}
        />
      ),
    },
    {
      label: 'Settings',
      content: (
        <Controller
          name="settings"
          control={control}
          render={({ field: { onChange } }) => <SettingSubForm handleSubmit={onChange} />}
        />
      ),
    },
    {
      label: 'Static Nodes',
      content: <StaticNodeForm />,
    },
    {
      label: 'Applications',
      content: <ApplicationsSubForm />,
    },
    {
      label: 'Summary',
      content: <SummarySubForm formValue={getValues()} />,
    },
  ];
  const [activeStepIndex, setActiveStep] = useState(0);

  const hasBack = (currentStepIndex: number) => currentStepIndex > 0;
  const hasNext = (currentStepIndex: number, totalStepSize: number) => currentStepIndex < totalStepSize - 1;
  const handleBack = (currentStepIndex: number) => hasBack(currentStepIndex) && setActiveStep((prev) => prev - 1);
  const handleNext = (currentStepIndex: number) =>
    hasNext(currentStepIndex, stepDatas.length) && setActiveStep((prev) => prev + 1);

  const navigate = useNavigate();

  return (
    <Paper className={clsx(style.mainContainer, style.mainForm, commonStyle.mainContainer)}>
      <Typography variant="h5" sx={{ marginBottom: '20px' }}>
        Create Cluster
      </Typography>

      <ProgressStepperContent stepDatas={stepDatas} activeStepIndex={activeStepIndex} />
      {/* {JSON.stringify(hasError)} */}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '30px',
        }}
      >
        <CancelButton onClick={() => navigate('/kaas/clusters')} className={commonStyle.kaasTertiaryColor} />
        <Box sx={{ display: 'flex', gap: '10px' }}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<ArrowBack />}
            disabled={!hasBack(activeStepIndex)}
            onClick={() => handleBack(activeStepIndex)}
            className={commonStyle.kaasTertiaryColor}
          >
            Back
          </Button>

          {hasNext(activeStepIndex, stepDatas.length) ? (
            <Button
              variant="contained"
              size="large"
              startIcon={<ArrowForward />}
              onClick={() => handleNext(activeStepIndex)}
              disabled={isDirty == false || isEmpty(errors)}
              className={commonStyle.kaasPrimaryColor}
            >
              Next
            </Button>
          ) : (
            <AddButton label="Create Cluster" onClick={() => handleNext(activeStepIndex)} />
          )}
        </Box>
      </Box>
    </Paper>
  );
}
