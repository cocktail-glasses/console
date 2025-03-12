import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { Box, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';

import { getDeleteClusterSchema } from './schemas';

import DeleteButton from '@components/molecules/KaaS/Button/DeleteButton/DeleteButton';
import Dialog from '@components/molecules/KaaS/Dialog/Dialog';

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
    <Dialog
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
        <DeleteButton label="Delete Cluster" onClick={() => onDelete(getValues())} size="large" disabled={!isValid} />
      }
    />
  );
};

export default DeleteClusterDialog;
