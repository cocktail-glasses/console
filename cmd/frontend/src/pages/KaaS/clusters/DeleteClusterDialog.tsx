import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { DeleteOutline } from '@mui/icons-material';
import { Box, Button, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';

import DialogBase from './component/DialogBase/DialogBase';
import style from './component/DialogBase/DialogBase.module.scss';
import { getDeleteClusterSchema } from './schemas';

export interface DeleteClusterDialogProp {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (deleteClusterOptions: DeleteClusterForm) => void;
  clusterName: string;
}

export interface DeleteClusterForm {
  clusterName: string;
  cleanupLoadBalancers: boolean;
  cleanupVolumes: boolean;
}

const DeleteClusterDialog = ({ isOpen, onClose, onDelete, clusterName }: DeleteClusterDialogProp) => {
  const {
    register,
    formState: { isValid },
    getValues,
    reset,
  } = useForm<DeleteClusterForm>({
    defaultValues: {
      clusterName: '',
    },
    resolver: zodResolver(getDeleteClusterSchema(clusterName)),
  });

  useEffect(() => {
    reset();
  }, [isOpen, reset]);

  return (
    <DialogBase
      isOpen={isOpen}
      onClose={onClose}
      closeBtn
      title="Delete Cluster"
      content={
        <>
          <Typography variant="body1">
            {`Delete `}
            <strong>{clusterName}</strong>
            {` cluster permanently?`}
          </Typography>
          <Box sx={{ marginTop: '8px', marginBottom: '15px !important' }}>
            <TextField variant="outlined" label="Cluster Name" required fullWidth {...register('clusterName')} />
          </Box>

          <FormControlLabel
            control={<Checkbox {...register('cleanupLoadBalancers')} />}
            label="Cleanup connected Load Balancers"
          />
          <FormControlLabel
            control={<Checkbox {...register('cleanupVolumes')} />}
            label="Cleanup connected volumes (dynamically provisioned PVs and PVCs)"
          />
        </>
      }
      footer={
        <Button
          className={style.actionButton}
          variant="contained"
          size="large"
          startIcon={<DeleteOutline fontSize="large" />}
          onClick={() => onDelete(getValues())}
          disabled={!isValid}
        >
          Delete Cluster
        </Button>
      }
    />
  );
};

export default DeleteClusterDialog;
