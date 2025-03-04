import { ReactElement } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { Delete } from '@mui/icons-material';
import { Box, FormGroup, IconButton } from '@mui/material';

import { head, isFunction, map } from 'lodash';

import { createFormSchema } from '../../formValidation';
import style from './ClusterSubForm.module.scss';

import AddButton from '@components/molecules/KaaS/Button/AddButton/AddButton';
import CheckSelectField from '@components/molecules/KaaS/Form/CheckSelectField';
import Checkbox from '@components/molecules/KaaS/Form/Checkbox';
import SelectField from '@components/molecules/KaaS/Form/SelectField';
import TextField from '@components/molecules/KaaS/Form/TextField';
import ImageToggleButtonGroup from '@components/organisms/KaaS/ImageToggleButtonGroup/ImageToggleButtonGroup';
import clsx from 'clsx';

export interface ClusterFormValue {
  name?: string;
  sshKeys?: string[];
  cniPlugin?: string;
  cniPluginVersion?: string;
  controlPlaneVersion?: string;
  containerRuntime?: string;
  admissionPlugins?: string[];
  auditLoggin?: boolean;
  disableCSIDriver?: boolean;
  kubernetesDashboard?: boolean;
  opaIntegration?: boolean;
  userClusterLogging?: boolean;
  userClusterMonitoring?: boolean;
  userSSHKeyAgent?: boolean;
}

interface Feature {
  value:
    | 'auditLoggin'
    | 'disableCSIDriver'
    | 'kubernetesDashboard'
    | 'opaIntegration'
    | 'userClusterLogging'
    | 'userClusterMonitoring'
    | 'userSSHKeyAgent';
  label: string;
}

interface ClusterFormProps {
  values?: ClusterFormValue;
  handleSubmit?: (...event: any[]) => void;
  handleError?: (...event: any[]) => void;
}

const ClusterSubForm = ({ values, handleSubmit, handleError }: ClusterFormProps) => {
  // cni plugins
  const cniPlugins = [
    { value: 'cilium', image: <span className={clsx(style.pluginImage, style.cilium)} /> },
    { value: 'canal', image: <span className={clsx(style.pluginImage, style.canal)} /> },
    { value: 'none', image: 'None' },
  ];

  const ciliumVersions: string[] = ['1.15.3', '1.14.9', '1.13.14'];

  // sshkeys
  const sshKeys: CheckBoxOption[] = [
    { label: 'Cocktail', value: 'cocktail' },
    { label: 'OpenStack', value: 'openstack' },
  ];

  // control plane version
  const controlPlaneVersions: string[] = ['1.30.0', '1.29.4', '1.29.2', '1.29.1', '1.29.0'];

  // container runtime
  const containerRuntimes: string[] = ['containerd'];

  // admission plugins
  interface CheckBoxOption {
    label: string;
    value: string;
    option?: ReactElement;
  }

  const admissionPlugins: CheckBoxOption[] = [
    { label: 'Event Rate Limit', value: 'eventRateLimit' },
    { label: 'Pod Node Selector', value: 'podNodeSelector' },
  ];

  // checkboxes
  const features: Feature[] = [
    { label: 'Audit Logging', value: 'auditLoggin' },
    { label: 'Disable CSI Driver', value: 'disableCSIDriver' },
    { label: 'Kubernetes Dashboard', value: 'kubernetesDashboard' },
    { label: 'OPA Integration', value: 'opaIntegration' },
    { label: 'User Cluster Logging', value: 'userClusterLogging' },
    { label: 'User Cluster Monitoring', value: 'userClusterMonitoring' },
    { label: 'User SSH Key Agent', value: 'userSSHKeyAgent' },
  ];

  // forms
  const {
    watch,
    control,
    formState: { isValid },
  } = useForm<ClusterFormValue>({
    defaultValues: {
      name: values?.name || '',
      sshKeys: values?.sshKeys || [],
      cniPlugin: values?.cniPlugin,
      cniPluginVersion: values?.cniPluginVersion || head(ciliumVersions),
      controlPlaneVersion: values?.controlPlaneVersion || head(controlPlaneVersions),
      containerRuntime: values?.containerRuntime || head(containerRuntimes),
    },
    mode: 'onChange',
    resolver: zodResolver(createFormSchema),
  });

  watch((data) => {
    if (isFunction(handleSubmit)) handleSubmit(data);

    if (isFunction(handleError)) handleError(isValid);
  });

  console.log(watch());

  return (
    <Box sx={{ display: 'flex', gap: '25px' }}>
      <Box sx={{ flex: '1' }}>
        <h2>Clusters</h2>
        <Controller
          name="name"
          control={control}
          render={({ field: { value, onChange }, fieldState: { error, invalid } }) => (
            <TextField
              isRequired
              label="Name"
              value={value}
              onChange={onChange}
              error={invalid}
              errorMessage={error?.message}
            />
          )}
        />

        <h2>Network Configuration</h2>
        <Box sx={{ marginBottom: '22px' }}>
          <Controller
            name="cniPlugin"
            control={control}
            render={({ field: { value, onChange } }) => (
              <ImageToggleButtonGroup value={value} onChange={(_, selected) => onChange(selected)} items={cniPlugins} />
            )}
          />
        </Box>
        <Box sx={{ marginBottom: '10px' }}>
          <Controller
            name="cniPluginVersion"
            control={control}
            render={({ field: { value, onChange } }) => (
              <SelectField
                isRequired
                label="CNI Plugin Version"
                value={value}
                onChange={onChange}
                items={ciliumVersions}
              />
            )}
          />
        </Box>

        <h2>SSH Keys</h2>
        <Box sx={{ marginBottom: '10px' }}>
          <Controller
            name="sshKeys"
            control={control}
            render={({ field: { value, onChange } }) => (
              <CheckSelectField label="SSH Keys" value={value} onChange={onChange} items={sshKeys} />
            )}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <AddButton label="Add SSH Key" variant="outlined" color="success" size="large" />
        </Box>
      </Box>

      <Box sx={{ flex: '1' }}>
        <h2>Specification</h2>
        <Box sx={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
          <SelectField
            isRequired
            label="Control Plane Version"
            items={controlPlaneVersions}
            defaultValue={head(controlPlaneVersions)}
          />

          <SelectField
            isRequired
            label="Container Runtime"
            value={head(containerRuntimes)}
            items={containerRuntimes}
            disabled
          />
        </Box>

        <Box sx={{ marginBottom: '30px' }}>
          <Controller
            name="admissionPlugins"
            control={control}
            render={({ field: { value, onChange } }) => (
              <CheckSelectField label="Admission Plugins" value={value} onChange={onChange} items={admissionPlugins} />
            )}
          />
        </Box>

        <Box sx={{ marginBottom: '30px' }}>
          <FormGroup>
            {map(features, (feature) => (
              <Controller
                key={feature.value}
                name={feature.value}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Checkbox label={feature.label} value={value} onChange={onChange} />
                )}
              />
            ))}
          </FormGroup>
        </Box>

        <Box sx={{ marginBottom: '30px' }}>
          <h2>Labels</h2>
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <TextField label="Key" />
            <TextField label="Value" />
            <IconButton aria-label="delete" size="large" disabled>
              <Delete />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ClusterSubForm;
