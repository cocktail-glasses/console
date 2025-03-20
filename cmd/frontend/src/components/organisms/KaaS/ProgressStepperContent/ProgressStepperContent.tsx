import { ReactNode } from 'react';

import { Box } from '@mui/material';

import { defaultTo, map } from 'lodash';

import ProgressStepper from '@components/molecules/KaaS/ProgressStepper/ProgressStepper';
import { useStepper } from 'headless-stepper';

export interface ProgressStatus {
  currentStep: number;
  totalSteps: number;
  hasNextStep: boolean;
  hasPreviousStep: boolean;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
}

interface ProgressStepperContentProps extends React.ComponentPropsWithoutRef<typeof ProgressStepper> {
  children?: (statue: ProgressStatus) => ReactNode;
}

const ProgressStepperContent = ({ steps, currentStep, children, ...props }: ProgressStepperContentProps) => {
  const { state, nextStep, prevStep, setStep } = useStepper({
    steps: map(steps, (step) => ({ label: step })),
    currentStep,
  });

  map(steps);

  return (
    <Box>
      <ProgressStepper {...props} steps={steps} currentStep={state.currentStep} />
      {children &&
        children({
          currentStep: state.currentStep,
          totalSteps: state.totalSteps,
          hasNextStep: defaultTo(state.hasNextStep, false),
          hasPreviousStep: defaultTo(state.hasPreviousStep, false),
          nextStep,
          prevStep,
          setStep,
        })}
    </Box>
  );
};

export default ProgressStepperContent;
