import { FormEvent, useContext } from 'react';
import { useNavigate } from 'react-router';

import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Box } from '@mui/material';

import { get, identity } from 'lodash';

import commonStyle from '../../Common.module.scss';
import { ProgressContext } from '../../Create';

import Button from '@components/atoms/KaaS/Button/Button';
import AddButton from '@components/molecules/KaaS/Button/AddButton/AddButton';
import CancelButton from '@components/molecules/KaaS/Button/CancelButton/CancelButton';
import { ProgressStatus } from '@components/organisms/KaaS/ProgressStepperContent/ProgressStepperContent';

interface FormActionProps {
  onSubmit: (e?: FormEvent<HTMLButtonElement>) => void;
  isValid: boolean;
}

const FormAction = ({ onSubmit, isValid }: FormActionProps) => {
  const progressStatus = useContext<ProgressStatus | undefined>(ProgressContext);

  const navigate = useNavigate();
  const handleCancel = () => navigate('/kaas/clusters');

  const backBtnDisable = !get(progressStatus, 'hasPreviousStep', false);
  const backBtnClick = get(progressStatus, 'prevStep', identity);

  const hasNextStep = get(progressStatus, 'hasNextStep', false);
  const nextBtnClick = get(progressStatus, 'nextStep', identity);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '30px',
      }}
    >
      <CancelButton onClick={handleCancel} className={commonStyle.kaasTertiaryColor} />
      <Box sx={{ display: 'flex', gap: '10px' }}>
        <Button
          variant="outlined"
          size="large"
          startIcon={<ArrowBack />}
          disabled={backBtnDisable}
          onClick={backBtnClick}
          className={commonStyle.kaasTertiaryColor}
        >
          Back
        </Button>

        {hasNextStep ? (
          <Button
            type="submit"
            variant="contained"
            size="large"
            startIcon={<ArrowForward />}
            disabled={!isValid}
            onClick={(e) => {
              e.preventDefault();
              onSubmit();
              nextBtnClick();
            }}
            className={commonStyle.kaasPrimaryColor}
          >
            Next
          </Button>
        ) : (
          <AddButton
            type="submit"
            label="Create Cluster"
            textTransform="none"
            className={commonStyle.kaasPrimaryColor}
            onClick={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default FormAction;
