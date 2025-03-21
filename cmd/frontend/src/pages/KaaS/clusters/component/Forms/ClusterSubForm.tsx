import { ReactElement } from 'react';
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { Box, FormGroup, Typography, useTheme } from '@mui/material';

import { head, map, merge, size } from 'lodash';

import commonStyle from '../../Common.module.scss';
import { createFormSchema, createFormValue } from '../../schemas';
import FormAction from './FormAction';

import AddButton from '@components/molecules/KaaS/Button/AddButton/AddButton';
import DeleteIconButton from '@components/molecules/KaaS/Button/DeleteIconButton/DeleteIconButton';
import CheckSelectField from '@components/molecules/KaaS/Form/CheckSelectField';
import CheckboxLabel from '@components/molecules/KaaS/Form/CheckboxLabel';
import ControlledSelectField from '@components/organisms/KaaS/ControlledForm/ControlledSelectField';
import ControlledTextField from '@components/organisms/KaaS/ControlledForm/ControlledTextField';
import ImageToggleButtonGroup from '@components/organisms/KaaS/ImageToggleButtonGroup/ImageToggleButtonGroup';
import Canal from '@resources/cni_canal.png';
import CiliumDark from '@resources/cni_cilium-dark.svg';
import Cilium from '@resources/cni_cilium.svg';

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
  values?: createFormValue;
  onSave: SubmitHandler<createFormValue>;
}

const ClusterSubForm = ({ values, onSave }: ClusterFormProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // cni plugins
  const cniPlugins = [
    {
      value: 'cilium',
      image: (
        <Box
          component="img"
          src={isDark ? CiliumDark : Cilium}
          alt={isDark ? CiliumDark : Cilium}
          sx={{ display: 'flex', width: '80px' }}
        />
      ),
    },
    {
      value: 'canal',
      image: <Box component="img" src={Canal} alt={Canal} sx={{ display: 'flex', width: '50px' }} />,
    },
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

  const defaultValues = {
    name: '',
    cniPlugin: head(cniPlugins)?.value,
    cniPluginVersion: head(ciliumVersions),
    controlPlaneVersion: head(controlPlaneVersions),
    containerRuntime: head(containerRuntimes),
    labels: [{ key: '', value: '' }],
  };

  // forms
  const {
    // watch,
    control,
    formState: { /* errors, */ isValid },
    handleSubmit,
  } = useForm<createFormValue>({
    defaultValues: merge({}, defaultValues, values),
    mode: 'onChange',
    resolver: zodResolver(createFormSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'labels',
  });

  const labelSize = size(fields);
  const handleLabelKeyChange = (index: number) => {
    if (labelSize === index + 1) {
      append({ key: '', value: '' });
    }
  };

  // watch((data) => {
  //   console.log(errors);
  //   console.log(data);
  //   console.log(isValid);
  // });

  return (
    <Box component="form">
      <Box sx={{ display: 'flex', gap: '25px' }}>
        <Box sx={{ flex: '1' }}>
          <Typography variant="h5" sx={{ marginY: '19.92px' }}>
            Clusters
          </Typography>

          <ControlledTextField name="name" control={control} label="Name" required size="small" />

          <Typography variant="h5" sx={{ marginY: '19.92px' }}>
            Network Configuration
          </Typography>
          <Box sx={{ marginBottom: '22px' }}>
            <Controller
              name="cniPlugin"
              control={control}
              render={({ field: { value, onChange } }) => (
                <ImageToggleButtonGroup
                  value={value}
                  onChange={(_, selected) => selected && onChange(selected)}
                  items={cniPlugins}
                />
              )}
            />
          </Box>
          <Box sx={{ marginBottom: '10px' }}>
            <ControlledSelectField
              name="cniPluginVersion"
              control={control}
              required
              label="CNI Plugin Version"
              items={ciliumVersions}
              size="small"
            />
          </Box>

          <Typography variant="h5" sx={{ marginY: '19.92px' }}>
            SSH Keys
          </Typography>
          <Box sx={{ marginBottom: '10px' }}>
            {/* <ControlledField
              control={control}
              component={SelectField}
              name="sshKeys"
              label="SSH Keys"
              items={sshKeys}
              size="small"
            /> */}
            <Controller
              name="sshKeys"
              control={control}
              render={({ field: { value, onChange } }) => (
                <CheckSelectField label="SSH Keys" value={value} onChange={onChange} items={sshKeys} size="small" />
              )}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <AddButton
              label="Add SSH Key"
              variant="outlined"
              size="large"
              textTransform="none"
              className={commonStyle.kaasQuaternaryColor}
            />
          </Box>
        </Box>

        <Box sx={{ flex: '1' }}>
          <Typography variant="h5" sx={{ marginY: '19.92px' }}>
            Specification
          </Typography>
          <Box sx={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
            <ControlledSelectField
              name="controlPlaneVersion"
              control={control}
              required
              label="Control Plane Version"
              items={controlPlaneVersions}
              size="small"
            />

            <ControlledSelectField
              name="containerRuntime"
              control={control}
              required
              label="Container Runtime"
              items={containerRuntimes}
              disabled
              size="small"
            />
          </Box>

          <Box sx={{ marginBottom: '30px' }}>
            <Controller
              name="admissionPlugins"
              control={control}
              render={({ field: { value, onChange } }) => (
                <CheckSelectField
                  label="Admission Plugins"
                  value={value}
                  onChange={onChange}
                  items={admissionPlugins}
                  size="small"
                />
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
                  render={({ field: { value = false, onChange } }) => (
                    <CheckboxLabel label={feature.label} checked={value} onChange={onChange} />
                  )}
                />
              ))}
            </FormGroup>
          </Box>

          <Box sx={{ marginBottom: '30px' }}>
            <Typography variant="h5" sx={{ marginY: '19.92px' }}>
              Labels
            </Typography>
            {fields.map((field, index) => (
              <Box key={field.id} sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <ControlledTextField
                  name={`labels.${index}.key`}
                  control={control}
                  label="key"
                  size="small"
                  onChange={() => handleLabelKeyChange(index)}
                />
                <ControlledTextField name={`labels.${index}.value`} control={control} label="Value" size="small" />
                <DeleteIconButton size="large" onClick={() => remove(index)} disabled={labelSize == 1} />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <FormAction onSave={handleSubmit(onSave)} isValid={isValid} />
    </Box>
  );
};

export default ClusterSubForm;
