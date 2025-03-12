import { Controller, useForm } from 'react-hook-form';

import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';

import isFunction from 'lodash/isFunction';

import CheckboxLabel from '@components/molecules/KaaS/Form/CheckboxLabel';
import PasswordField from '@components/molecules/KaaS/Form/PasswordField';
import SelectField from '@components/molecules/KaaS/Form/SelectField';
import TextField from '@components/molecules/KaaS/Form/TextField';

// import '../../common.scss';

interface SettingsFormProps {
  values?: SettingsFormValue;
  handleSubmit?: (...event: any[]) => void;
}

export interface SettingsFormValue {
  providerPreset: string;
  domain: string;
  credentialType: string;
  userName?: string;
  password?: string;
  securityGroup?: string;
  network?: string;
  subnetId?: string;
}

const SettingSubForm: React.FC<SettingsFormProps> = ({ values, handleSubmit }) => {
  // forms
  const { watch, control } = useForm<SettingsFormValue>({
    defaultValues: {
      providerPreset: values?.providerPreset || '',
      credentialType: values?.credentialType || 'userCredential',
      securityGroup: '',
    },
    mode: 'onBlur',
  });

  watch((data) => {
    if (isFunction(handleSubmit)) handleSubmit(data);
  });

  // provider preset
  const providerPresets: string[] = ['cocktail-preset'];

  return (
    <Box sx={{ display: 'flex', gap: '25px' }}>
      <Box sx={{ flex: 1 }}>
        <h2>Basic Settings</h2>
        <Box sx={{ marginBottom: '10px' }}>
          <Controller
            name="providerPreset"
            control={control}
            render={({ field: { value, onChange } }) => (
              <SelectField
                required
                label="Provider Preset"
                value={value}
                onChange={onChange}
                items={providerPresets}
                helperText="Using provider presets will disable most of the other provider-related fields."
              />
            )}
          />
        </Box>
        <Box sx={{ marginBottom: '10px' }}>
          <Controller
            name="domain"
            control={control}
            render={({ field: { value, onChange } }) => (
              <TextField label="Domain" variant="outlined" required value={value} onChange={onChange} />
            )}
          />
        </Box>
        <Box sx={{ marginBottom: '10px' }}>
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
              >
                <ToggleButton value="userCredential">User Credential</ToggleButton>
                <ToggleButton value="applicationCredential">Application Credential</ToggleButton>
              </ToggleButtonGroup>
            )}
          />
        </Box>
        <Box sx={{ marginBottom: '10px' }}>
          <Controller
            name="userName"
            control={control}
            render={({ field: { value, onChange } }) => (
              <TextField label="Username" variant="outlined" required value={value} onChange={onChange} />
            )}
          />
        </Box>
        <Box sx={{ marginBottom: '10px' }}>
          <Controller
            name="password"
            control={control}
            render={({ field: { value, onChange } }) => (
              <PasswordField label="Password" required value={value} onChange={onChange} />
            )}
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
              />
            )}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SettingSubForm;
