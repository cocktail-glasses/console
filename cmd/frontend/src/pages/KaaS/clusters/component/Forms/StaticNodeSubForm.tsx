import { SubmitHandler } from 'react-hook-form';

import { Box } from '@mui/material';

import { staticNodesFormValue } from '../../schemas';
import FormAction from './FormAction';

interface StaticNodeFormProps {
  values?: staticNodesFormValue;
  onSubmit: SubmitHandler<staticNodesFormValue>;
}

const StaticNodeForm = ({ values, onSubmit }: StaticNodeFormProps) => {
  console.log(values, onSubmit);
  return (
    <Box component="form">
      <p>static node</p>
      <FormAction onSubmit={() => {}} isValid />
    </Box>
  );
};

export default StaticNodeForm;
