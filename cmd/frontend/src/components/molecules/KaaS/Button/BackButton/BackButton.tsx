import { useNavigate } from 'react-router';

import { ArrowBackIosNew } from '@mui/icons-material';
import { ButtonOwnProps } from '@mui/material';

import style from './BackButton.module.scss';

import Button from '@components/atoms/KaaS/Button/Button';

interface BackButtonProps extends ButtonOwnProps {
  url: string;
}

const BackButton = ({ url }: BackButtonProps) => {
  const navigate = useNavigate();
  const handleClick = () => navigate(url);
  return (
    <Button onClick={handleClick} variant="outlined" className={style.backBtn} color="success">
      <ArrowBackIosNew />
    </Button>
  );
};

export default BackButton;
