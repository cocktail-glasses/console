import { ReactNode, useEffect, useState } from 'react';

import { Box, Step, StepLabel, Stepper } from '@mui/material';

import { eq, get, map } from 'lodash';

import style from './ProgressStepper.module.scss';

import clsx from 'clsx';
import { useStepper, Steps } from 'headless-stepper';

interface Step extends React.ComponentPropsWithRef<typeof Step>, Steps {}

export interface Controller {
  currentStep: number;
  totalSteps: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

interface ProgressStepperProps extends Omit<React.ComponentPropsWithRef<typeof Stepper>, 'activeStep'> {
  steps: Step[];
  currentStep: number;
  onChangeCurrentStep?: (step: number) => void;
  fitWidth?: boolean;
  Render?: (c: Controller) => ReactNode;
}

const ProgressStepper = ({
  steps,
  currentStep,
  onChangeCurrentStep,
  fitWidth = false,
  Render,
  ...props
}: ProgressStepperProps) => {
  const [_currentStep, setCurrentStep] = useState(currentStep);

  const { state, nextStep, prevStep } = useStepper({
    steps,
    currentStep: _currentStep,
  });

  useEffect(() => {
    if (!eq(_currentStep, state.currentStep)) {
      setCurrentStep(state.currentStep);
      onChangeCurrentStep && onChangeCurrentStep(state.currentStep);
    }
  }, [_currentStep, state.currentStep, onChangeCurrentStep]);

  const controllerProps = {
    currentStep: state.currentStep,
    totalSteps: state.totalSteps,
    hasNext: get(state, 'hasNextStep', false),
    hasPrev: get(state, 'hasPreviousStep', false),
    onNext: nextStep,
    onPrev: prevStep,
  };

  return (
    <Box>
      <Stepper
        {...props}
        activeStep={state.currentStep}
        className={clsx(style.progressStepperContainer, props.className)}
      >
        {map(steps, (step, index) => (
          <Step
            {...step}
            key={index}
            className={clsx(style.step, { [style.fitWidth]: fitWidth }, step.className)}
            // onClick={() =>  setStep(index)}
          >
            <StepLabel className={style.label}>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {Render && Render(controllerProps)}
    </Box>
  );
};

export default ProgressStepper;
