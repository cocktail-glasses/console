import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import DialogContent from '@mui/material/DialogContent';

import { Dialog, NameValueTable } from '@components/common';
import helpers from '@helpers';
import { setVersionDialogOpen } from 'redux/actions/actions';
import { useTypedSelector } from 'redux/reducers/reducers';

export default function VersionDialog() {
  const open = useTypedSelector((state) => state.ui.isVersionDialogOpen);
  const dispatch = useDispatch();
  const { t } = useTranslation(['glossary', 'translation']);
  const { VERSION, GIT_VERSION } = helpers.getVersion();

  return (
    <Dialog
      maxWidth="sm"
      open={open}
      onClose={() => dispatch(setVersionDialogOpen(false))}
      title={helpers.getProductName()}
      // We want the dialog to show on top of the cluster chooser one if needed
      style={{ zIndex: 1900 }}
    >
      <DialogContent>
        <NameValueTable
          rows={[
            {
              name: t('translation|Version'),
              value: VERSION,
            },
            {
              name: t('Git Commit'),
              value: GIT_VERSION,
            },
          ]}
        />
      </DialogContent>
    </Dialog>
  );
}
