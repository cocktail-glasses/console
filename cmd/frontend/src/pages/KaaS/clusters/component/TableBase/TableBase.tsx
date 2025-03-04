import { ReactElement, useEffect } from 'react';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';

import { isBoolean, isEmpty, isFunction } from 'lodash';

import style from './TableBase.module.scss';

import { flexRender, getCoreRowModel, useReactTable, ColumnDef, getFilteredRowModel, Row } from '@tanstack/react-table';
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

interface TableBaseProps<TData> {
  data: Array<TData>;
  columns: ColumnDef<TData, any>[];
  filter?: boolean | FilterFn;
  searchValue?: string;
  emptyMessage?: string | ReactElement;
  onClickRow?: (row: Row<TData>) => void;
  isLoading?: boolean;
}

const TableBase = <TData,>({
  data,
  columns,
  filter,
  searchValue,
  emptyMessage,
  onClickRow,
  isLoading,
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
    <TableContainer className={clsx(style.table, style.paddingY30)} sx={{ marginTop: '0px !important' }}>
      <Table aria-label="tenant-control-plane table">
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableCell>
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
                onClick={() => isFunction(onClickRow) && onClickRow(row)}
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
      </Table>
    </TableContainer>
  );
};

export default TableBase;
