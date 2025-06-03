import { MouseEventHandler } from 'react';

import SaveIcon from '@mui/icons-material/Save';
import Stack from '@mui/material/Stack';

import { Button } from '@components/atoms';

type buttonsProps = {
  save?: MouseEventHandler;
  cancel?: MouseEventHandler;
  refresh?: MouseEventHandler;
  edit?: MouseEventHandler;
  remove?: MouseEventHandler;
};

function Buttons(props: buttonsProps) {
  const { save, cancel, refresh, edit, remove } = props;
  console.log('remove', remove);

  return (
    <Stack direction="row" spacing={1}>
      {save && <Button text="Save" onClick={save} startIcon={<SaveIcon />} variant="contained" color="success" />}
      {cancel && <Button text="Cancel" onClick={cancel} variant="outlined" />}
      {refresh && <Button text="Refresh" onClick={refresh} variant="contained" color="primary" />}
      {edit && <Button text="Edit" onClick={edit} variant="contained" color="secondary" />}
      {remove && <Button text="Delete" onClick={remove} variant="contained" color="secondary" />}
    </Stack>
  );
}

export default Buttons;
