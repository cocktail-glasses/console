import SearchOutlined from '@mui/icons-material/SearchOutlined';

import style from './SearchIconButton.module.scss';

import Button from '@components/atoms/KaaS/Button/Button';
import clsx from 'clsx';

interface SearchButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  label: string;
}

const SearchButton = ({ label, ...props }: SearchButtonProps) => {
  return (
    <Button
      {...props}
      className={clsx(style.searchButton, props.className)}
      variant={props.variant || 'contained'}
      startIcon={<SearchOutlined fontSize="large" />}
    >
      {label}
    </Button>
  );
};

export default SearchButton;
