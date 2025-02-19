import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@mui/material/styles';
//MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  // MRT_GlobalFilterTextField,
  // MRT_ToggleFiltersButton,
  MRT_RowSelectionState,
  MRT_Localization,
} from 'material-react-table';
import { MRT_Localization_KO } from 'material-react-table/locales/ko';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import { useTranslation } from 'react-i18next';

// //Material UI Imports
// import {
//   Box,
//   Button,
//   ListItemIcon,
//   MenuItem,
//   Typography,
//   lighten,
// } from '@mui/material';

// //Icons Imports
// import { AccountCircle, Send } from '@mui/icons-material';

interface TabelBoxProps {
  columns: MRT_ColumnDef<any>[],
  data: any[],
  someEventHandler: any
}

const tableLocalizationMap: Record<string, MRT_Localization> = {
  ko: MRT_Localization_KO,
  en: MRT_Localization_EN,
};

const TableBox = (props: TabelBoxProps) => {
  const { columns, data, someEventHandler } = props;
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({})
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  useEffect(() => {
    someEventHandler(table.getSelectedRowModel().rows)

  }, [rowSelection])
  const table = useMaterialReactTable({
    columns,
    data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableStickyHeader: true,
    enableColumnFilterModes: false,
    enableColumnOrdering: true,
    enableGrouping: false,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowActions: false,
    enableRowSelection: true,
    // initialState: {
    //   showColumnFilters: false,
    //   showGlobalFilter: false,
    //   columnPinning: {
    //     left: ['mrt-row-expand', 'mrt-row-select'],
    //     right: ['mrt-row-actions'],
    //   },
    // },
    paginationDisplayMode: 'default',
    positionToolbarAlertBanner: 'bottom',
    muiSearchTextFieldProps: {
      size: 'small',
      variant: 'outlined',
    },
    muiPaginationProps: {
      color: 'secondary',
      rowsPerPageOptions: [10, 20, 30],
      shape: 'rounded',
      variant: 'outlined'
    },
    onRowSelectionChange: setRowSelection, //hoist up the row selection state to your own scope
    state: {
      rowSelection, //pass the row selection state back to the table instance
    },
    localization: tableLocalizationMap[i18n.language],
    muiTopToolbarProps: ({ table }) => ({
      sx: { backgroundColor: 'transparent' }
    }),
    muiBottomToolbarProps: ({ table }) => ({
      sx: { backgroundColor: 'transparent', boxShadow: 'none', }
    }),
    muiTableHeadRowProps: ({ table }) => ({
      sx: { backgroundColor: 'transparent', boxShadow: 'none', }
    }),
    muiTableBodyRowProps: ({ table }) => ({
      sx: { backgroundColor: 'transparent' }
    }),
    muiTableFooterRowProps: ({ table }) => ({
      sx: { backgroundColor: 'transparent' }
    }),
    muiTablePaperProps: ({ table }) => ({
      style: {
        boxShadow: 'none',
        backgroundColor: 'transparent'
      },
    })
  });

  return <MaterialReactTable table={table} />;
};

export default TableBox;
