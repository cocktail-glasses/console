import { Step, StepLabel, Stepper } from '@mui/material';

import map from 'lodash/map';

import style from './ProgressStepper.module.scss';

import clsx from 'clsx';

interface StepData {
  label: string;
}

interface ProgressStepperProps {
  stepDatas: StepData[];
  activeStepIndex: number;
  fitWidth?: boolean;
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({ stepDatas, activeStepIndex, fitWidth = false }) => {
  return (
    <Stepper activeStep={activeStepIndex} className={style.progressStepperContainer}>
      {map(stepDatas, (stepData) => (
        <Step key={stepData.label} className={clsx(style.step, { [style.fitWidth]: fitWidth })}>
          <StepLabel className={style.label}>{stepData.label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default ProgressStepper;
