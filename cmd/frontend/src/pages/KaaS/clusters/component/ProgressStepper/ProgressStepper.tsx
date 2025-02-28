import { Step, StepLabel, Stepper } from '@mui/material';

import map from 'lodash/map';

import './index.scss';

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
    <Stepper activeStep={activeStepIndex} className="progress-stepper-container">
      {map(stepDatas, (stepData) => (
        <Step key={stepData.label} className={clsx('step', { 'fit-width': fitWidth })}>
          <StepLabel className="label">{stepData.label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default ProgressStepper;
