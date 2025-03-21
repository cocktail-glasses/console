import { SubmitHandler } from 'react-hook-form';

import { Box } from '@mui/material';

import { staticNodesFormValue } from '../../schemas';
import FormAction from './FormAction';

interface StaticNodeFormProps {
  values?: staticNodesFormValue;
  onSave: SubmitHandler<staticNodesFormValue>;
}

const StaticNodeForm = ({ values, onSave }: StaticNodeFormProps) => {
  console.log(values, onSave);
  return (
    <Box component="form">
      <p>static node</p>
      <FormAction onSave={() => {}} isValid />
    </Box>
  );
};

export default StaticNodeForm;
