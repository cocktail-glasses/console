import React from 'react';

import { getSourceNameAndPluralKind } from '../helpers';
import { PluralName } from '../helpers/pluralName';
import StatusLabel from './StatusLabel';

import {
  Table as HTable,
  TableProps as HTableProps,
  TableColumn,
  DateLabel,
  Link,
  ShowHideLabel,
} from '@components/common';
import { KubeObject } from '@lib/k8s/KubeObject';
import { KubeCRD } from '@lib/k8s/crd';

type CommonColumnType = 'namespace' | 'name' | 'lastUpdated' | 'age' | 'source' | 'message' | 'status' | 'revision';

interface TableCol {
  header: string;
  accessorKey?: string;
  accessorFn?: (item: any) => React.ReactNode;
  Cell?: (props: { row: { original: any } }) => React.ReactNode;
}

interface NameColumn extends Partial<TableCol> {
  extends: 'name';
  routeName?: string;
}

export interface TableProps extends Omit<HTableProps<any>, 'columns'> {
  columns: (TableCol | CommonColumnType | NameColumn | TableColumn<any, any>)[];
}

function prepareLastUpdated(item: KubeCRD) {
  const condition = item?.jsonData?.status?.conditions?.find((c) => c.type === 'Ready');
  return condition?.lastTransitionTime;
}

function prepareNameColumn(colProps: Partial<NameColumn> = {}): TableCol {
  const { routeName, ...genericProps } = colProps;

  // Remove the extends property from the genericProps
  delete genericProps.extends;

  return {
    header: 'Name',
    accessorKey: 'metadata.name',
    Cell: ({ row: { original: item } }) => (
      <Link
        routeName={routeName}
        params={{
          name: item.metadata.name,
          namespace: item.metadata.namespace,
          pluralName: PluralName(item.kind),
        }}
      >
        {item.metadata.name}
      </Link>
    ),
    ...genericProps,
  };
}

export function Table(props: TableProps) {
  const { columns, data, ...otherProps } = props;

  const processedColumns = React.useMemo(() => {
    return columns.map((column) => {
      if (typeof column === 'string') {
        switch (column) {
          case 'namespace':
            return {
              header: 'Namespace',
              accessorKey: 'metadata.namespace',
              Cell: ({ row: { original: item } }) => (
                <Link
                  routeName="namespace"
                  params={{
                    name: item.metadata.namespace,
                  }}
                >
                  {item.metadata.namespace}
                </Link>
              ),
            };
          case 'name':
            return prepareNameColumn();
          case 'lastUpdated':
            return {
              header: 'Last Updated',
              accessorFn: (item) => prepareLastUpdated(item),
              Cell: ({ cell }: any) => <DateLabel format="mini" date={cell.getValue()} />,
            };
          case 'age':
            return {
              id: 'age',
              header: 'Age',
              gridTemplate: 'min-content',
              accessorFn: (item: KubeObject) => -new Date(item.metadata.creationTimestamp).getTime(),
              enableColumnFilter: false,
              muiTableBodyCellProps: {
                align: 'right',
              },
              Cell: ({ row }) =>
                row.original && <DateLabel date={row.original.metadata.creationTimestamp} format="mini" />,
            };
          case 'source':
            return {
              header: 'Source',
              accessorFn: (item) => {
                const { name } = getSourceNameAndPluralKind(item);
                return name;
              },
              Cell: ({ row }: any) => {
                const { name, pluralKind, namespace } = getSourceNameAndPluralKind(row.original);
                return (
                  <Link
                    routeName="source"
                    params={{
                      pluralName: pluralKind,
                      namespace: namespace ?? row.original.jsonData.metadata.namespace,
                      name: name,
                    }}
                  >
                    {name}
                  </Link>
                );
              },
            };
          case 'status':
            return {
              header: 'Status',
              accessorFn: (item) => {
                return <StatusLabel item={item} />;
              },
            };
          case 'revision':
            return {
              header: 'Revision',
              accessorFn: (item) => {
                const reference = item.jsonData.status?.lastAttemptedRevision;
                return <ShowHideLabel labelId={`${item?.metadata?.uid}-revision`}>{reference ?? ''}</ShowHideLabel>;
              },
            };
          case 'message':
            return {
              header: 'Message',
              accessorFn: (item) => {
                const message = item.jsonData.status?.conditions?.find((c) => c.type === 'Ready')?.message;
                return <ShowHideLabel labelId={`${item?.metadata?.uid}-message`}>{message ?? ''}</ShowHideLabel>;
              },
            };
          default:
            return column;
        }
      }

      if ((column as NameColumn).extends === 'name') {
        return prepareNameColumn(column as NameColumn);
      }

      return column;
    });
  }, [columns]);

  return <HTable data={data} loading={data === null} {...otherProps} columns={processedColumns as TableCol[]} />;
}

export default Table;
