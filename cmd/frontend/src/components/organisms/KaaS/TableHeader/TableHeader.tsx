import { ChangeEvent, ReactElement } from 'react';

import { Box } from '@mui/material';

import { isFunction } from 'lodash';

import style from './TableHeader.module.scss';

import Searchbar from '@components/molecules/KaaS/Form/Searchbar';

interface TableHeaderProps {
  search?: string;
  onChangeSearch?: (e: ChangeEvent, search: string) => void;
  actions: ReactElement;
}

const TableHeader = ({ search, onChangeSearch, actions }: TableHeaderProps) => (
  <Box className={style.menuContainer}>
    <Searchbar value={search} onChange={(e) => isFunction(onChangeSearch) && onChangeSearch(e, e.target.value)} />
    {actions}
  </Box>
);

export default TableHeader;
