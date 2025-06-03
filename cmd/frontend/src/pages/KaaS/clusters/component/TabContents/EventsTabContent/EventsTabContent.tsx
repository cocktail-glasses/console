import { TableSortLabel } from '@mui/material';

import Table from '@components/molecules/KaaS/Table/Table';
import { createColumnHelper } from '@tanstack/react-table';

interface Event {
  message: string;
  resourceId: string;
  type: string;
  count: string;
  occurred: string;
}

const EventsTabContent = () => {
  const columnHelper = createColumnHelper<Event>();

  const columns = [
    columnHelper.accessor('message', {
      header: () => (
        <TableSortLabel active={true} direction="asc">
          Message
        </TableSortLabel>
      ),
    }),
    columnHelper.accessor('resourceId', { header: 'Resource ID' }),
    columnHelper.accessor('type', { header: 'Type' }),
    columnHelper.accessor('count', { header: 'Count' }),
    columnHelper.accessor('occurred', { header: 'Occurred' }),
  ];

  return <Table data={[]} columns={columns} emptyMessage="No events available." />;
};

export default EventsTabContent;
