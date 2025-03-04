import { ChangeEvent, ReactElement } from 'react';

import { Box } from '@mui/material';

import style from './TableHeader.module.scss';

import Searchbar from '@components/molecules/KaaS/Input/Searchbar/Searchbar';

interface TableHeaderProps {
  search?: string;
  onChangeSearch?: (e: ChangeEvent, search: string) => void;
  actions: ReactElement;
}

const TableHeader = ({ search, onChangeSearch, actions }: TableHeaderProps) => (
  <Box className={style.menuContainer}>
    <Searchbar value={search} onChange={onChangeSearch} />
    {actions}
  </Box>
);

export default TableHeader;
