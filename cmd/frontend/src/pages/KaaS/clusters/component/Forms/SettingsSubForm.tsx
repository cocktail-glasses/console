import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';

import { merge } from 'lodash';

import { settingsFormSchema, settingsFormValue } from '../../schemas';
import FormAction from './FormAction';

import CheckboxLabel from '@components/molecules/KaaS/Form/CheckboxLabel';
import PasswordField from '@components/molecules/KaaS/Form/PasswordField';
import SelectField from '@components/molecules/KaaS/Form/SelectField';
import TextField from '@components/molecules/KaaS/Form/TextField';
import ControlledSelectField from '@components/organisms/KaaS/ControlledForm/ControlledSelectField';
import ControlledTextField from '@components/organisms/KaaS/ControlledForm/ControlledTextField';

interface SettingsFormProps {
  values?: settingsFormValue;
  onSave: SubmitHandler<settingsFormValue>;
}

const SettingSubForm = ({ values, onSave }: SettingsFormProps) => {
  const defaultValue = {
    providerPreset: '',
    domain: '',
    credentialType: 'userCredential',
  };

  const {
    control,
    formState: { isValid },
    handleSubmit,
  } = useForm<settingsFormValue>({
    defaultValues: merge({}, defaultValue, values),
    mode: 'onChange',
    resolver: zodResolver(settingsFormSchema),
  });

  // provider preset
  const providerPresets: string[] = ['cocktail-preset'];

  return (
    <Box component="form">
      <Box sx={{ display: 'flex', gap: '25px' }}>
        <Box sx={{ flex: 1 }}>
          <h2>Basic Settings</h2>
          <Box>
            <ControlledSelectField
              name="providerPreset"
              control={control}
              required
              label="Provider Preset"
              items={providerPresets}
              helperText="Using provider presets will disable most of the other provider-related fields."
              size="small"
            />
          </Box>
          <Box sx={{ marginTop: '20px' }}>
            <ControlledTextField
              name="domain"
              control={control}
              label="Domain"
              variant="outlined"
              required
              size="small"
              disabled
            />
          </Box>
          <Box sx={{ marginTop: '40px' }}>
            <Controller
              name="credentialType"
              control={control}
              render={({ field: { value, onChange } }) => (
                <ToggleButtonGroup
                  color="primary"
                  value={value}
                  exclusive
                  onChange={(_, select) => onChange(select)}
                  aria-label="credentialType"
                  size="small"
                >
                  <ToggleButton value="userCredential">User Credential</ToggleButton>
                  <ToggleButton value="applicationCredential">Application Credential</ToggleButton>
                </ToggleButtonGroup>
              )}
            />
          </Box>
          <Box sx={{ marginTop: '10px', display: 'flex', gap: '20px', flexDirection: 'column' }}>
            <ControlledTextField
              name="userName"
              control={control}
              label="Username"
              variant="outlined"
              required
              size="small"
              disabled
            />

            <Controller
              name="password"
              control={control}
              render={({ field: { value, onChange } }) => (
                <PasswordField label="Password" required value={value} onChange={onChange} size="small" disabled />
              )}
            />

            <ControlledTextField
              name="project"
              control={control}
              label="No Project Available"
              helperText="Please enter your credentials first."
              required
              size="small"
              disabled
            />

            <ControlledTextField name="projectID" control={control} label="Project ID" required size="small" disabled />

            <ControlledSelectField
              name="floatingIP"
              control={control}
              label="No Floating IP Pools Available"
              helperText="Please enter your credentials first."
              size="small"
              disabled
              items={[]}
            />
          </Box>
        </Box>
        <Box sx={{ flex: 1 }}>
          <h2>Advanced Settings</h2>
          <Box sx={{ marginBottom: '10px' }}>
            <Controller
              name="securityGroup"
              control={control}
              render={({ field: { value, onChange } }) => (
                <SelectField
                  disabled
                  label="No Security Groups Available"
                  helperText="Please enter your credentials first."
                  value={value}
                  onChange={onChange}
                  items={[]}
                  size="small"
                />
              )}
            />
          </Box>
          <Box sx={{ marginBottom: '10px' }}>
            <Controller
              name="network"
              control={control}
              render={({ field: { value, onChange } }) => (
                <SelectField
                  disabled
                  label="No Networks Available"
                  helperText="Please enter your credentials first."
                  value={value}
                  onChange={onChange}
                  items={[]}
                  size="small"
                />
              )}
            />
          </Box>
          <Box sx={{ marginBottom: '10px' }}>
            <Controller
              name="subnetId"
              control={control}
              render={({ field: { value, onChange } }) => (
                <SelectField
                  disabled
                  label="No IPv4 Subnet IDs Available"
                  helperText="Please enter your credentials and network first."
                  value={value}
                  onChange={onChange}
                  items={[]}
                  size="small"
                />
              )}
            />
          </Box>
          <Box sx={{ marginBottom: '10px' }}>
            <CheckboxLabel label="Enable Ingress Hostname" />
          </Box>
          <Box sx={{ marginBottom: '10px' }}>
            <Controller
              name="userName"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  disabled
                  label="Ingress Hostname Suffix"
                  helperText="Set a specific suffix for the hostnames used for the PROXY protocol workaround that is enabled by EnableIngressHostname. The suffix is set to nip.io by default."
                  value={value}
                  onChange={onChange}
                  size="small"
                />
              )}
            />
          </Box>
        </Box>
      </Box>
      <FormAction onSave={handleSubmit(onSave)} isValid={isValid} />
    </Box>
  );
};

export default SettingSubForm;
