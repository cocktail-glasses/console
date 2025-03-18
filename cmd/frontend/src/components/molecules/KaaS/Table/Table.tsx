import { ReactElement, useEffect, ReactNode } from 'react';

import {
  Table as TableBase,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';

import { isBoolean, isEmpty, isFunction, merge } from 'lodash';

import style from './Table.module.scss';

import { flexRender, getCoreRowModel, useReactTable, ColumnDef, getFilteredRowModel } from '@tanstack/react-table';
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

interface TableBaseProps<TData> extends React.ComponentPropsWithoutRef<typeof TableBase> {
  data: Array<TData>;
  columns: ColumnDef<TData, any>[];
  filter?: boolean | FilterFn;
  searchValue?: string;
  emptyMessage?: ReactNode;
  onClickRow?: (row: TData) => void;
  isLoading?: boolean;
}

const Table = <TData,>({
  data,
  columns,
  filter,
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

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: filterOption(),
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
    </TableContainer>
  );
};

export default Table;
