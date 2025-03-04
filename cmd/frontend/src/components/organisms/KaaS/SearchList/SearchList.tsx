import { useState, ChangeEvent } from 'react';

import { Box, Typography, Stack } from '@mui/material';

import { curry, filter, isFunction } from 'lodash';
import map from 'lodash/map';

import Searchbar from '@components/molecules/KaaS/Input/Searchbar/Searchbar';

interface SearchListProps<TItem> {
  search?: string;
  onChangeSearch?: (e: ChangeEvent, v: any) => void;
  data: TItem[];
  displayFn: (item: TItem) => any;
  filterFn?: (search: string, item: TItem) => boolean;
  emptyMessage?: string;
}

const SearchList = <TItem,>({
  search,
  onChangeSearch,
  data,
  displayFn,
  filterFn,
  emptyMessage = 'No result.',
}: SearchListProps<TItem>) => {
  const [_search, setSearch] = useState(search || '');
  const handleChangeSearch = (e: ChangeEvent, v: any) => {
    setSearch(v);
    if (isFunction(onChangeSearch)) onChangeSearch(e, v);
  };

  const list = isFunction(filterFn) ? filter(data, curry(filterFn)(_search)) : data;

  return (
    <>
      <Searchbar value={_search} onChange={handleChangeSearch} />

      <Stack sx={{ maxHeight: '500px', overflowY: 'scroll', marginTop: '30px', gap: '10px', flex: '1' }}>
        {list.length > 0 ? (
          map(list, (item, i) => <Box key={i}>{displayFn(item)}</Box>)
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', padding: '30px' }}>
            <Typography variant="body2">{emptyMessage}</Typography>
          </Box>
        )}
      </Stack>
    </>
  );
};

export default SearchList;
