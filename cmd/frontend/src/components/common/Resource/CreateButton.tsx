import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Fragment } from 'react/jsx-runtime';

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Button from '@mui/material/Button';

import ActionButton from '@components/common/ActionButton';
import EditorDialog from '@components/common/Resource/EditorDialog';
import { InlineIcon } from '@iconify/react';
import { useSelectedClusters } from '@lib/k8s';

interface CreateButtonProps {
  isNarrow?: boolean;
}

export default function CreateButton(props: CreateButtonProps) {
  const { isNarrow } = props;

  const [openDialog, setOpenDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { t } = useTranslation(['translation']);
  const clusters = useSelectedClusters();
  const [targetCluster, setTargetCluster] = useState(clusters[0] || '');

  // We want to avoid resetting the dialog state on close.
  const itemRef = useRef({});

  // When the clusters in the group change, we want to reset the target cluster
  // if it's not in the new list of clusters.
  useEffect(() => {
    if (clusters.length === 0) {
      setTargetCluster('');
    } else if (!clusters.includes(targetCluster)) {
      setTargetCluster(clusters[0]);
    }
  }, [clusters]);

  return (
    <Fragment>
      {isNarrow ? (
        <ActionButton
          description={t('translation|Create / Apply')}
          onClick={() => setOpenDialog(true)}
          icon="mdi:plus-box"
          width="42"
          iconButtonProps={{
            color: 'primary',
            sx: { justifyContent: 'center' },
          }}
        />
      ) : (
        <Button
          onClick={() => {
            setOpenDialog(true);
          }}
          startIcon={<InlineIcon icon="mdi:plus" />}
          color="primary"
          // fullWidth
          sx={(theme) => ({
            textTransform: 'none',
            color: theme.palette.mode === 'dark' ? 'rgb(245, 245, 245)' : 'rgb(255, 255, 255)',
            backgroundColor: theme.palette.mode === 'dark' ? 'rgb(75, 85, 99)' : 'rgb(74, 144, 226)',
          })}
          // variant="text"
          variant="contained"
        >
          {/* {t('translation|Create')} */}
          {/* {t('translation|Create / Apply')} */}
          Create / Apply
        </Button>
      )}
      <EditorDialog
        item={itemRef.current}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        setOpen={setOpenDialog}
        saveLabel={t('translation|Apply')}
        errorMessage={errorMessage}
        onEditorChanged={() => setErrorMessage('')}
        title={t('translation|Create / Apply')}
        actions={
          clusters.length > 1
            ? [
                <FormControl>
                  <InputLabel id="edit-dialog-cluster-target">{t('glossary|Cluster')}</InputLabel>
                  <Select
                    labelId="edit-dialog-cluster-target"
                    id="edit-dialog-cluster-target-select"
                    value={targetCluster}
                    onChange={(event) => {
                      setTargetCluster(event.target.value as string);
                    }}
                  >
                    {clusters.map((cluster) => (
                      <MenuItem key={cluster} value={cluster}>
                        {cluster}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>,
              ]
            : []
        }
      />
    </Fragment>
  );
}
