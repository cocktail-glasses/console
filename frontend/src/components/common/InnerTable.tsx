import SimpleTable, { SimpleTableProps } from '@components/common/SimpleTable.tsx';

export default function InnerTable(props: SimpleTableProps) {
  return (
    <SimpleTable
      sx={{
        border: 'none',
        '& .MuiTableCell-head': {
          background: 'none',
        },
      }}
      {...props}
    />
  );
}
