import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';

import { Link, NameValueTable, SectionBox } from '@components/common';
import helpers, { ClusterSettings } from '@helpers';
import { Icon, InlineIcon } from '@iconify/react';
import { useCluster, useClustersConf } from '@lib/k8s';

function isValidNamespaceFormat(namespace: string) {
  // We allow empty strings just because that's the default value in our case.
  if (!namespace) {
    return true;
  }

  // Validates that the namespace is a valid DNS-1123 label and returns a boolean.
  // https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-label-names
  const regex = new RegExp('^[a-z0-9]([-a-z0-9]*[a-z0-9])?$');
  return regex.test(namespace);
}

export default function SettingsCluster() {
  const cluster = useCluster();
  const clusterConf = useClustersConf();
  const { t } = useTranslation(['translation']);
  const [defaultNamespace, setDefaultNamespace] = useState('default');
  const [userDefaultNamespace, setUserDefaultNamespace] = useState('');
  const [newAllowedNamespace, setNewAllowedNamespace] = useState('');
  const [clusterSettings, setClusterSettings] = useState<ClusterSettings | null>(null);
  const theme = useTheme();

  // const navigate = useNavigate();
  // const dispatch = useDispatch();

  // const removeCluster = () => {
  //   deleteCluster(cluster || '')
  //     .then(config => {
  //       dispatch(setConfig(config));
  //       navigate('/');
  //     })
  //     .catch((err: Error) => {
  //       if (err.message === 'Not Found') {
  //         // TODO: create notification with error message
  //       }
  //     });
  // };

  // check if cluster was loaded by user
  // const removableCluster = React.useMemo(() => {
  //   if (!cluster) {
  //     return false;
  //   }

  //   const clusterInfo = (clusterConf && clusterConf[cluster]) || null;
  //   return clusterInfo?.meta_data?.source === 'dynamic_cluster';
  // }, [cluster, clusterConf]);

  useEffect(() => {
    setClusterSettings(!!cluster ? helpers.loadClusterSettings(cluster || '') : null);
  }, [cluster]);

  useEffect(() => {
    const clusterInfo = (clusterConf && clusterConf[cluster || '']) || null;
    const clusterConfNs = clusterInfo?.meta_data?.namespace;
    if (!!clusterConfNs && clusterConfNs !== defaultNamespace) {
      setDefaultNamespace(clusterConfNs);
    }
  }, [cluster, clusterConf, defaultNamespace]);

  useEffect(() => {
    if (clusterSettings?.defaultNamespace !== userDefaultNamespace) {
      setUserDefaultNamespace(clusterSettings?.defaultNamespace || '');
    }

    // Avoid re-initializing settings as {} just because the cluster is not yet set.
    if (clusterSettings !== null) {
      helpers.storeClusterSettings(cluster || '', clusterSettings);
    }
  }, [cluster, clusterSettings, userDefaultNamespace]);

  useEffect(() => {
    let timeoutHandle: NodeJS.Timeout | null = null;

    if (isEditingDefaultNamespace()) {
      // We store the namespace after a timeout.
      timeoutHandle = setTimeout(() => {
        if (isValidNamespaceFormat(userDefaultNamespace)) {
          storeNewDefaultNamespace(userDefaultNamespace);
        }
      }, 1000);
    }

    return () => {
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
        timeoutHandle = null;
      }
    };
  }, [userDefaultNamespace, isEditingDefaultNamespace, storeNewDefaultNamespace]);

  function isEditingDefaultNamespace() {
    return clusterSettings?.defaultNamespace !== userDefaultNamespace;
  }

  if (!cluster) {
    return null;
  }

  function storeNewAllowedNamespace(namespace: string) {
    setNewAllowedNamespace('');
    setClusterSettings((settings: ClusterSettings | null) => {
      const newSettings = { ...(settings || {}) };
      newSettings.allowedNamespaces = newSettings.allowedNamespaces || [];
      newSettings.allowedNamespaces.push(namespace);
      // Sort and avoid duplicates
      newSettings.allowedNamespaces = [...new Set(newSettings.allowedNamespaces)].sort();
      return newSettings;
    });
  }

  function storeNewDefaultNamespace(namespace: string) {
    let actualNamespace = namespace;
    if (namespace === defaultNamespace) {
      actualNamespace = '';
      setUserDefaultNamespace(actualNamespace);
    }

    setClusterSettings((settings: ClusterSettings | null) => {
      const newSettings = { ...(settings || {}) };
      if (isValidNamespaceFormat(namespace)) {
        newSettings.defaultNamespace = actualNamespace;
      }
      return newSettings;
    });
  }

  const isValidDefaultNamespace = isValidNamespaceFormat(userDefaultNamespace);
  const isValidNewAllowedNamespace = isValidNamespaceFormat(newAllowedNamespace);
  const invalidNamespaceMessage = t(
    "translation|Namespaces must contain only lowercase alphanumeric characters or '-', and must start and end with an alphanumeric character."
  );

  return (
    <>
      <SectionBox
        title={
          Object.keys(clusterConf || {}).length > 1
            ? t('translation|Cluster Settings ({{ clusterName }})', { clusterName: cluster || '' })
            : t('translation|Cluster Settings')
        }
        backLink
        headerProps={{
          actions: [
            <Link routeName={'settings'} align="right" style={{ color: theme.palette.text.primary }}>
              {t('translation|General Settings')}
            </Link>,
          ],
        }}
      >
        <NameValueTable
          rows={[
            {
              name: t('translation|Default namespace'),
              value: (
                <TextField
                  onChange={(event) => {
                    let value = event.target.value;
                    value = value.replace(' ', '');
                    setUserDefaultNamespace(value);
                  }}
                  value={userDefaultNamespace}
                  placeholder={defaultNamespace}
                  error={!isValidDefaultNamespace}
                  helperText={
                    isValidDefaultNamespace
                      ? t(
                          'translation|The default namespace for e.g. when applying resources (when not specified directly).'
                        )
                      : invalidNamespaceMessage
                  }
                  InputProps={{
                    endAdornment: isEditingDefaultNamespace() ? (
                      <Icon width={24} color={theme.palette.text.secondary} icon="mdi:progress-check" />
                    ) : (
                      <Icon width={24} icon="mdi:check-bold" />
                    ),
                    sx: { maxWidth: 250 },
                  }}
                />
              ),
            },
            {
              name: t('translation|Allowed namespaces'),
              value: (
                <>
                  <TextField
                    onChange={(event) => {
                      let value = event.target.value;
                      value = value.replace(' ', '');
                      setNewAllowedNamespace(value);
                    }}
                    placeholder="namespace"
                    error={!isValidNewAllowedNamespace}
                    value={newAllowedNamespace}
                    helperText={
                      isValidNewAllowedNamespace
                        ? t('translation|The list of namespaces you are allowed to access in this cluster.')
                        : invalidNamespaceMessage
                    }
                    autoComplete="off"
                    inputProps={{
                      form: {
                        autocomplete: 'off',
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => {
                            storeNewAllowedNamespace(newAllowedNamespace);
                          }}
                          disabled={!newAllowedNamespace}
                          size="medium"
                        >
                          <InlineIcon icon="mdi:plus-circle" />
                        </IconButton>
                      ),
                      onKeyPress: (event) => {
                        if (event.key === 'Enter') {
                          storeNewAllowedNamespace(newAllowedNamespace);
                        }
                      },
                      autoComplete: 'off',
                      sx: { maxWidth: 250 },
                    }}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      '& > *': {
                        margin: theme.spacing(0.5),
                      },
                      marginTop: theme.spacing(1),
                    }}
                    aria-label={t('translation|Allowed namespaces')}
                  >
                    {((clusterSettings || {}).allowedNamespaces || []).map((namespace) => (
                      <Chip
                        key={namespace}
                        label={namespace}
                        size="small"
                        clickable={false}
                        onDelete={() => {
                          setClusterSettings((settings) => {
                            const newSettings = { ...settings };
                            newSettings.allowedNamespaces = newSettings.allowedNamespaces?.filter(
                              (ns) => ns !== namespace
                            );
                            return newSettings;
                          });
                        }}
                      />
                    ))}
                  </Box>
                </>
              ),
            },
          ]}
        />
      </SectionBox>
      {/* {removableCluster && (
        <Box pt={2} textAlign="right">
          <ConfirmButton
            color="secondary"
            onConfirm={() => removeCluster()}
            confirmTitle={t('translation|Remove Cluster')}
            confirmDescription={t('translation|Are you sure you want to remove the cluster "{{ clusterName }}"?', {
              clusterName: cluster,
            })}
          >
            {t('translation|Remove Cluster')}
          </ConfirmButton>
        </Box>
      )} */}
    </>
  );
}
