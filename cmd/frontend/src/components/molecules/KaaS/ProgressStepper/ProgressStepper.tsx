import { Step, StepLabel, Stepper } from '@mui/material';

import { map } from 'lodash';

import style from './ProgressStepper.module.scss';

import clsx from 'clsx';

interface ProgressStepperProps {
  steps: string[];
  currentStep: number;
  fitWidth?: boolean;
}

const ProgressStepper = ({ steps, currentStep, fitWidth = false }: ProgressStepperProps) => {
  return (
    <Stepper activeStep={currentStep} className={style.progressStepperContainer}>
      {map(steps, (step, index) => (
        <Step key={index} className={clsx(style.step, { [style.fitWidth]: fitWidth })}>
          <StepLabel className={style.label}>{step}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default ProgressStepper;
