import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import helpers, { addQuery } from '@helpers';
import { Icon } from '@iconify/react';
import { useCluster } from '@lib/k8s';
import Namespace from '@lib/k8s/namespace.ts';
import { setNamespaceFilter } from 'redux/filterSlice.ts';
import { useTypedSelector } from 'redux/reducers/reducers.tsx';

export interface PureNamespacesAutocompleteProps {
  namespaceNames: string[];
  onChange: (event: ChangeEvent<{}>, newValue: string[]) => void;
  filter: { namespaces: Set<string> };
}

export function PureNamespacesAutocomplete({
  namespaceNames,
  onChange: onChangeFromProps,
  filter,
}: PureNamespacesAutocompleteProps) {
  const theme = useTheme();
  const { t } = useTranslation(['glossary', 'translation']);
  const [namespaceInput, setNamespaceInput] = useState<string>('');
  const maxNamespacesChars = 12;

  const onInputChange = (event: object, value: string, reason: string) => {
    // For some reason, the AutoComplete component resets the text after a short
    // delay, so we need to avoid that or the user won't be able to edit/use what they type.
    if (reason !== 'reset') {
      setNamespaceInput(value);
    }
  };

  const onChange = (event: ChangeEvent<{}>, newValue: string[]) => {
    // Now we reset the input so it won't show next to the selected namespaces.
    setNamespaceInput('');
    onChangeFromProps(event, newValue);
  };

  return (
    <Autocomplete
      multiple
      id="namespaces-filter"
      autoComplete
      openOnFocus
      options={namespaceNames}
      onChange={onChange}
      onInputChange={onInputChange}
      inputValue={namespaceInput}
      // We reverse the namespaces so the last chosen appear as the first in the label. This
      // is useful since the label is ellipsized and this we get to see it change.
      value={[...filter.namespaces.values()].reverse()}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={<Icon icon="mdi:checkbox-blank-outline" />}
            checkedIcon={<Icon icon="mdi:check-box-outline" />}
            style={{
              color: selected ? theme.palette.primary.main : theme.palette.text.primary,
            }}
            checked={selected}
          />
          {option}
        </li>
      )}
      renderTags={(tags: string[]) => {
        if (tags.length === 0) {
          return <Typography variant="body2">{t('translation|All namespaces')}</Typography>;
        }

        let namespacesToShow = tags[0];
        const joiner = ', ';
        const joinerLength = joiner.length;
        let joinnedNamespaces = 1;

        tags.slice(1).forEach((tag) => {
          if (namespacesToShow.length + tag.length + joinerLength <= maxNamespacesChars) {
            namespacesToShow += joiner + tag;
            joinnedNamespaces++;
          }
        });

        return (
          <Typography style={{ overflowWrap: 'anywhere' }}>
            {namespacesToShow.length > maxNamespacesChars
              ? namespacesToShow.slice(0, maxNamespacesChars) + '…'
              : namespacesToShow}
            {tags.length > joinnedNamespaces && (
              <>
                <span>,&nbsp;</span>
                <b>{`+${tags.length - joinnedNamespaces}`}</b>
              </>
            )}
          </Typography>
        );
      }}
      renderInput={(params) => (
        <Box width="15rem">
          <TextField
            {...params}
            variant="standard"
            label={t('Namespaces')}
            fullWidth
            InputLabelProps={{ shrink: true }}
            style={{ marginTop: 0 }}
            placeholder={[...filter.namespaces.values()].length > 0 ? '' : 'Filter'}
          />
        </Box>
      )}
    />
  );
}

export function NamespacesAutocomplete() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const filter = useTypedSelector((state) => state.filter);
  const cluster = useCluster();
  const [namespaceNames, setNamespaceNames] = useState<string[]>([]);

  useEffect(() => {
    const settings = helpers.loadClusterSettings(cluster || '');
    const allowedNamespaces = settings?.allowedNamespaces || [];
    if (allowedNamespaces.length > 0) {
      setNamespaceNames(allowedNamespaces);
    }
  }, [cluster]);

  const onChange = (event: ChangeEvent<{}>, newValue: string[]) => {
    addQuery({ namespace: newValue.join(' ') }, { namespace: '' }, navigate, location, '');
    dispatch(setNamespaceFilter(newValue));
  };

  return namespaceNames.length > 0 ? (
    <PureNamespacesAutocomplete namespaceNames={namespaceNames} onChange={onChange} filter={filter} />
  ) : (
    <NamespacesFromClusterAutocomplete onChange={onChange} filter={filter} />
  );
}

function NamespacesFromClusterAutocomplete(props: Omit<PureNamespacesAutocompleteProps, 'namespaceNames'>) {
  const [namespaceNames, setNamespaceNames] = useState<string[]>([]);

  Namespace.useApiList((namespaces: Namespace[]) => {
    setNamespaceNames(namespaces.map((namespace) => namespace.metadata.name));
  });

  return <PureNamespacesAutocomplete namespaceNames={namespaceNames} {...props} />;
}
