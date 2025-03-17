import { Box } from '@mui/material';

import ProgressStepper from '@components/molecules/KaaS/ProgressStepper/ProgressStepper';

interface StepData {
  label: string;
  content: any;
}

interface ProgressStepperContentProps {
  activeStepIndex: number;
  stepDatas: StepData[];
  progressFitWidth?: boolean;
  contentClassName?: string;
}

const ProgressStepperContent = ({
  activeStepIndex,
  stepDatas,
  progressFitWidth = false,
  contentClassName,
}: ProgressStepperContentProps) => {
  return (
    <>
      <ProgressStepper stepDatas={stepDatas} activeStepIndex={activeStepIndex} fitWidth={progressFitWidth} />
      <Box className={contentClassName}> {stepDatas[activeStepIndex].content}</Box>
    </>
  );
};

export default ProgressStepperContent;
