import SimpleTable, { SimpleTableProps } from '@components/common/SimpleTable';

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
