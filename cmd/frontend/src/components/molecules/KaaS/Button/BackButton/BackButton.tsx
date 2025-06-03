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
      {...props}
      onClick={handleClick}
      variant={props.variant || 'outlined'}
      className={clsx(style.backBtn, props.className)}
      aria-label="back-button"
    >
      <ArrowBackIosNew className={style.icon} />
    </Button>
  );
};

export default BackButton;
