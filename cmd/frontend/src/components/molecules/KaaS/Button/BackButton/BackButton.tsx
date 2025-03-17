import { useNavigate } from 'react-router';

import { ArrowBackIosNew } from '@mui/icons-material';

import style from './BackButton.module.scss';

import Button from '@components/atoms/KaaS/Button/Button';
import clsx from 'clsx';

interface BackButtonProps extends Omit<React.ComponentPropsWithoutRef<typeof Button>, 'onClick'> {
  url: string;
}

const BackButton = ({ url, ...props }: BackButtonProps) => {
  const navigate = useNavigate();
  const handleClick = () => navigate(url);
  return (
    <Button
      onClick={handleClick}
      variant={'outlined'}
      className={clsx(style.backBtn, props.className)}
      color="success"
      {...props}
    >
      <ArrowBackIosNew />
    </Button>
  );
};

export default BackButton;
