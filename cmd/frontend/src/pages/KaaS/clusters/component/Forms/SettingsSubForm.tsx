import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { VisibilityOff, Visibility } from '@mui/icons-material';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  FormHelperText,
} from '@mui/material';

import isFunction from 'lodash/isFunction';
import map from 'lodash/map';

import '../../common.scss';

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

  // user credential password
  const [isPasswordShow, setIsPasswordShow] = useState(false);

  return (
    <Box sx={{ display: 'flex', gap: '25px' }}>
      <Box sx={{ flex: 1 }}>
        <h2>Basic Settings</h2>
        <Box sx={{ marginBottom: '10px' }}>
          <Controller
            name="providerPreset"
            control={control}
            render={({ field: { value, onChange } }) => (
              <FormControl fullWidth>
                <InputLabel id="providerPreset" variant="outlined" required>
                  Provider Preset
                </InputLabel>
                <Select
                  variant="outlined"
                  labelId="providerPreset"
                  value={value}
                  onChange={onChange}
                  label="Provider Preset"
                  required
                >
                  {map(providerPresets, (providerPreset) => (
                    <MenuItem value={providerPreset} key={providerPreset}>
                      {providerPreset}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  Using provider presets will disable most of the other provider-related fields.
                </FormHelperText>
              </FormControl>
            )}
          />
        </Box>
        <Box sx={{ marginBottom: '10px' }}>
          <Controller
            name="domain"
            control={control}
            render={({ field: { value, onChange } }) => (
              <TextField label="Domain" variant="outlined" required fullWidth value={value} onChange={onChange} />
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
              <TextField label="Username" variant="outlined" required fullWidth value={value} onChange={onChange} />
            )}
          />
        </Box>
        <Box sx={{ marginBottom: '10px' }}>
          <Controller
            name="password"
            control={control}
            render={({ field: { value, onChange } }) => (
              <FormControl variant="outlined">
                <InputLabel htmlFor="password" required>
                  Password
                </InputLabel>
                <OutlinedInput
                  id="password"
                  type={isPasswordShow ? 'text' : 'password'}
                  required
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={(e) => {
                          e.preventDefault();
                          setIsPasswordShow((prev) => !prev);
                        }}
                        edge="end"
                      >
                        {isPasswordShow ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                  value={value}
                  onChange={onChange}
                />
              </FormControl>
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
              <FormControl fullWidth disabled>
                <InputLabel id="providerPreset" variant="outlined">
                  No Security Groups Available
                </InputLabel>
                <Select
                  variant="outlined"
                  labelId="providerPreset"
                  value={value}
                  onChange={onChange}
                  label="No Security Groups Available"
                ></Select>
                <FormHelperText>Please enter your credentials first.</FormHelperText>
              </FormControl>
            )}
          />
        </Box>
        <Box sx={{ marginBottom: '10px' }}>
          <Controller
            name="network"
            control={control}
            render={({ field: { value, onChange } }) => (
              <FormControl fullWidth disabled>
                <InputLabel id="network" variant="outlined">
                  No Networks Available
                </InputLabel>
                <Select
                  variant="outlined"
                  labelId="network"
                  value={value}
                  onChange={onChange}
                  label="No Networks Available"
                ></Select>
                <FormHelperText>Please enter your credentials first.</FormHelperText>
              </FormControl>
            )}
          />
        </Box>
        <Box sx={{ marginBottom: '10px' }}>
          <Controller
            name="subnetId"
            control={control}
            render={({ field: { value, onChange } }) => (
              <FormControl fullWidth disabled>
                <InputLabel htmlFor="subnetId" variant="outlined">
                  No IPv4 Subnet IDs Available
                </InputLabel>
                <Select
                  variant="outlined"
                  id="subnetId"
                  value={value}
                  onChange={onChange}
                  label="No IPv4 Subnet IDs Available"
                ></Select>
                <FormHelperText>Please enter your credentials and network first.</FormHelperText>
              </FormControl>
            )}
          />
        </Box>
        <Box sx={{ marginBottom: '10px' }}>
          <FormControlLabel
            control={<Checkbox name="enableIngressHostname" />}
            label="Enable Ingress Hostname"
            key="enableIngressHostname"
          />
        </Box>
        <Box sx={{ marginBottom: '10px' }}>
          <Controller
            name="userName"
            control={control}
            render={({ field: { value, onChange } }) => (
              <FormControl fullWidth disabled>
                <TextField
                  label="Ingress Hostname Suffix"
                  variant="outlined"
                  fullWidth
                  value={value}
                  onChange={onChange}
                  disabled
                />
                <FormHelperText>
                  Set a specific suffix for the hostnames used for the PROXY protocol workaround that is enabled by
                  EnableIngressHostname. The suffix is set to nip.io by default.
                </FormHelperText>
              </FormControl>
            )}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SettingSubForm;
