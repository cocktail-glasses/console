import { createContext, useEffect, useState } from 'react';

import { Paper, Typography } from '@mui/material';

import { curry, get } from 'lodash';

import commonStyle from './Common.module.scss';
import style from './Create.module.scss';
import ApplicationsSubForm from './component/Forms/ApplicationsSubForm';
import ClusterSubForm from './component/Forms/ClusterSubForm';
import SettingSubForm from './component/Forms/SettingsSubForm';
import StaticNodeForm from './component/Forms/StaticNodeSubForm';
import SummarySubForm from './component/Forms/SummarySubForm';
import { applicationsFormValue, createFormValue, settingsFormValue, staticNodesFormValue } from './schemas';

import ProgressStepper, { Controller } from '@components/molecules/KaaS/ProgressStepper/ProgressStepper';
import clsx from 'clsx';

export interface FormValue {
  cluster?: createFormValue;
  settings?: settingsFormValue;
  statisNodes?: staticNodesFormValue;
  applications?: applicationsFormValue;
}

export const ProgressContext = createContext<Controller | undefined>(undefined);

export default function Create() {
  const [formValue, setFormValue] = useState<FormValue>({});
  useEffect(() => {
    console.log(formValue);
  }, [formValue]);

  const handleSubmitFormValue = curry((field: string, data: any) =>
    setFormValue((prev: FormValue) => ({ ...prev, [field]: data }))
  );

  const steps = [
    { label: 'Cluster' },
    { label: 'Settings' },
    { label: 'Static Nodes' },
    { label: 'Applications' },
    { label: 'Summary' },
  ];
  const contents = [
    <ClusterSubForm values={get(formValue, 'cluster')} onSave={handleSubmitFormValue('cluster')} />,
    <SettingSubForm values={get(formValue, 'settings')} onSave={handleSubmitFormValue('settings')} />,
    <StaticNodeForm values={get(formValue, 'statisNodes')} onSave={handleSubmitFormValue('statisNodes')} />,
    <ApplicationsSubForm values={get(formValue, 'applications')} onSave={handleSubmitFormValue('applications')} />,
    <SummarySubForm values={formValue} onSubmit={(e) => console.log(e)} />,
  ];

  return (
    <Paper className={clsx(style.mainContainer, style.mainForm, commonStyle.mainContainer)}>
      <Typography variant="h5" sx={{ marginBottom: '20px' }}>
        Create Cluster
      </Typography>

      <ProgressStepper
        steps={steps}
        currentStep={0}
        Render={(c: Controller) => (
          <ProgressContext.Provider value={c}>{contents[c.currentStep]}</ProgressContext.Provider>
        )}
      />
    </Paper>
  );
}
