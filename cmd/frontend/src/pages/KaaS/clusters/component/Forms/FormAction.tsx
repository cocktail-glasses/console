import { FormEvent, useContext } from 'react';
import { useNavigate } from 'react-router';

import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Box } from '@mui/material';

import { identity } from 'lodash';

import commonStyle from '../../Common.module.scss';
import { ProgressContext } from '../../Create';

import Button from '@components/atoms/KaaS/Button/Button';
import AddButton from '@components/molecules/KaaS/Button/AddButton/AddButton';
import CancelButton from '@components/molecules/KaaS/Button/CancelButton/CancelButton';
import { Controller } from '@components/molecules/KaaS/ProgressStepper/ProgressStepper';

interface FormActionProps {
  onSave?: () => void;
  onSubmit?: (e?: FormEvent<HTMLButtonElement>) => void;
  isValid: boolean;
}

const FormAction = ({ onSave, onSubmit, isValid }: FormActionProps) => {
  const progressStatus = useContext<Controller | undefined>(ProgressContext);

  const navigate = useNavigate();
  const handleCancel = () => navigate('/kaas/clusters');

  const backBtnDisable = !progressStatus?.hasPrev || false;
  const backBtnClick = progressStatus?.onPrev || identity;

  const hasNextStep = progressStatus?.hasNext || false;
  const nextBtnClick = progressStatus?.onNext || identity;

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
          type="submit"
          variant="outlined"
          size="large"
          startIcon={<ArrowBack />}
          disabled={backBtnDisable}
          onClick={(e) => {
            e.preventDefault();
            onSave && onSave();
            backBtnClick();
          }}
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
              onSave && onSave();
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
              onSubmit && onSubmit();
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default FormAction;
