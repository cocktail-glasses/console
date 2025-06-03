import { useTranslation } from 'react-i18next';

import { default as MuiButton } from '@mui/material/Button';

import { ButtonProps } from '.';

export interface buttonProps extends ButtonProps {
  text?: string;
  [prop: string]: any;
}

export default function Button(props: buttonProps) {
  const { t } = useTranslation();
  const { text, ...other } = props;
  return (
    <MuiButton {...other} size="medium">
      {text && t(text)}
    </MuiButton>
  );
}
