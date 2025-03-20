import { ReactElement, useEffect, ReactNode, useState } from 'react';

import {
  Table as TableBase,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Pagination,
  Box,
} from '@mui/material';

import { isBoolean, isEmpty, isFunction, isObject, merge } from 'lodash';

import style from './Table.module.scss';

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  getFilteredRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';
import clsx from 'clsx';

enum FilterFn {
  includeString = 'includesString',
  includeStringSensitive = 'includesStringSensitive',
  equalsString = 'equalsString',
  equalsStringSensitive = 'equalsStringSensitive',
  arrIncludes = 'arrIncludes',
  arrIncludesAll = 'arrIncludesAll',
  arrIncludesSome = 'arrIncludesSome',
  equals = 'equals',
  weakEquals = 'weakEquals',
  inNumberRange = 'inNumberRange',
}

interface PagingOption {
  pageIndex: number;
  pageSize: number;
}

interface TableBaseProps<TData> extends React.ComponentPropsWithoutRef<typeof TableBase> {
  data: Array<TData>;
  columns: ColumnDef<TData, any>[];
  filter?: boolean | FilterFn;
  // paging boolean 옵션은 단순히 페이징이 필요한 경우 페이징 기본 값을 이용해서 간단하게 사용하기 위함임
  // 만약 외부에서 데이터 크기 조건에 따라 페이징을 한다면 페이징 기본 값은 언제든 바뀔 수 있으므로 boolean 대신 PagingOption을 넘겨주는 것이 올바르다.
  paging?: boolean | PagingOption;
  searchValue?: string;
  emptyMessage?: ReactNode;
  onClickRow?: (row: TData) => void;
  isLoading?: boolean;
}

const Table = <TData,>({
  data,
  columns,
  filter,
  paging,
  searchValue,
  emptyMessage,
  onClickRow,
  isLoading,
  ...props
}: TableBaseProps<TData>): ReactElement => {
  const filterOption = () => {
    if (isBoolean(filter) && filter) {
      return getFilteredRowModel();
    }
  };

  const defaultPagingOption = {
    pageIndex: 0,
    pageSize: 10,
  };
  const pagingData = () => {
    if (isBoolean(paging) && paging == true) {
      return {
        usePaging: true,
        pagingOption: defaultPagingOption,
      };
    }

    if (isObject(paging)) {
      return {
        usePaging: true,
        pagingOption: paging,
      };
    }

    return {
      usePaging: false,
      pagingOption: defaultPagingOption, // usePaging이 false라면 동작 안함
    };
  };

  const { usePaging, pagingOption } = pagingData();
  const [pagination, setPagination] = useState(pagingOption);
  useEffect(() => {
    // 전체 데이터셋의 크기가 변경되면 페이징 설정 초기화
    usePaging && setPagination(pagingOption);
  }, [data]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: filterOption(),
    // 페이징 동작 필드
    getPaginationRowModel: usePaging ? getPaginationRowModel() : undefined,
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  useEffect(() => {
    table.setGlobalFilter(searchValue);
  }, [table, searchValue]);

  return (
    <TableContainer
      {...props}
      className={clsx(style.table, style.paddingY30)}
      sx={merge({ marginTop: '0px !important' }, props.sx)}
    >
      <TableBase>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell className={style.header} key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {isLoading && (
            <TableRow className={style.row}>
              <TableCell colSpan={columns.length} align="center">
                <CircularProgress />
              </TableCell>
            </TableRow>
          )}
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                className={style.row}
                key={row.id}
                hover
                onClick={() => isFunction(onClickRow) && onClickRow(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className={style.row}>
              <TableCell colSpan={columns.length} align="center">
                {isEmpty(emptyMessage) ? 'No Result' : emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </TableBase>
      {usePaging && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Pagination count={table.getPageCount()} onChange={(_, newPage) => table.setPageIndex(newPage - 1)} />
        </Box>
      )}
    </TableContainer>
  );
};

export default Table;
