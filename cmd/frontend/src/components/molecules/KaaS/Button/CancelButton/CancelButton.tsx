import { MouseEvent } from 'react';

import { Close } from '@mui/icons-material';
import { Button } from '@mui/material';

import { isFunction } from 'lodash';

interface CancelButtonProps {
  onClick?: (e: MouseEvent<HTMLButtonElement, any>) => void;
}

const CancelButton = ({ onClick, ...props }: CancelButtonProps) => (
  <Button
    variant="outlined"
    color="secondary"
    size="large"
    startIcon={<Close />}
    onClick={(e) => isFunction(onClick) && onClick(e)}
    {...props}
  >
    Cancel
  </Button>
);

export default CancelButton;
