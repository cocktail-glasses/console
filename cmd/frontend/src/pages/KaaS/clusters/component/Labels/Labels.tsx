import { useFieldArray, useForm } from 'react-hook-form';

import { Delete } from '@mui/icons-material';
import { Box, IconButton, TextField } from '@mui/material';

const LabelGroup = () => {
  const { control, register } = useForm({
    defaultValues: {
      labels: [{ key: '', value: '' }],
    },
  });
  const { fields, remove } = useFieldArray({
    control,
    name: 'labels',
  });

  return (
    <Box>
      {fields.map((label, index) => {
        return (
          <Box key={label.id} sx={{ display: 'flex', gap: '10px' }}>
            <TextField label="Key" variant="outlined" fullWidth {...register(`labels.${index}.key`)} />
            <TextField label="Value" variant="outlined" fullWidth {...register(`labels.${index}.value`)} />
            <IconButton aria-label="delete" size="large" disabled onClick={() => remove(index)}>
              <Delete />
            </IconButton>
          </Box>
        );
      })}
    </Box>
  );
};

export default LabelGroup;
