import React, { useState } from 'react';

import { Add, SmartToyOutlined, Person3Outlined, DeleteOutline } from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TableSortLabel,
  Typography,
} from '@mui/material';

import eq from 'lodash/eq';
import head from 'lodash/head';
import map from 'lodash/map';

import style from './RbacTabContent.module.scss';

import Table from '@components/molecules/KaaS/Table/Table';
import { createColumnHelper } from '@tanstack/react-table';

const RbacTabContent = () => {
  const rbacTypes = [
    {
      value: 'serviceAccount',
      label: (
        <>
          <SmartToyOutlined />
          Service Account
        </>
      ),
    },
    {
      value: 'user',
      label: (
        <>
          <Person3Outlined />
          User
        </>
      ),
    },
    {
      value: 'group',
      label: (
        <>
          <SmartToyOutlined />
          Group
        </>
      ),
    },
  ];
  const [rbacSelect, setRbacSelect] = useState(head(rbacTypes)?.value);

  const rbacUserData = [
    {
      scope: 'Cluster',
      user: 'skyikho@acornsoft.io',
      clusterRole: 'cluster-admin',
    },
    {
      scope: 'Namespace',
      user: 'yunwansu@acornsoft.io',
      clusterRole: 'namespace-admin',
      namespace: 'default',
    },
    {
      scope: 'Namespace',
      user: 'yunwansu@acornsoft.io',
      clusterRole: 'namespace-editor',
      namespace: 'default',
    },
  ];

  return (
    <Stack className={style.rbacContent}>
      <Box className={style.menuContainer}>
        <FormControl className={style.rbacSelector}>
          <Select variant="outlined" size="small" value={rbacSelect} onChange={(e) => setRbacSelect(e.target.value)}>
            {map(rbacTypes, (rbacType) => (
              <MenuItem
                value={rbacType.value}
                key={rbacType.value}
                sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                {rbacType.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box className={style.rbacActionContainer}>
          {eq(rbacSelect, rbacTypes[0].value) && (
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{
                height: '45px',
                color: 'white',
                fontSize: '16px',
                textTransform: 'none',
              }}
            >
              <strong>Add Service Account</strong>
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              height: '45px',
              color: 'white',
              fontSize: '16px',
              textTransform: 'none',
            }}
          >
            <strong>Add Binding</strong>
          </Button>
        </Box>
      </Box>
      <Box>
        {eq(rbacSelect, rbacTypes[0].value) && <RbacServiceAccountContent />}
        {eq(rbacSelect, rbacTypes[1].value) && <RbacUserContent rbacUserData={rbacUserData} />}
        {eq(rbacSelect, rbacTypes[2].value) && <RbacGroupContent rbacGroupData={[]} />}
      </Box>
    </Stack>
  );
};

const RbacServiceAccountContent = () => <Typography align="center">No service accounts available.</Typography>;

interface RbacUser {
  scope: string;
  user: string;
  clusterRole: string;
  namespace?: string;
}

interface RbacUserContentProps {
  rbacUserData: RbacUser[];
}

const RbacUserContent: React.FC<RbacUserContentProps> = ({ rbacUserData }) => {
  const columnHelper = createColumnHelper<RbacUser>();

  const rbacUserTableColumns = [
    columnHelper.accessor('scope', {
      header: () => (
        <TableSortLabel active={true} direction={'asc'}>
          Scope
        </TableSortLabel>
      ),
    }),
    columnHelper.accessor('user', { header: 'User' }),
    columnHelper.accessor('clusterRole', { header: 'Cluster Role' }),
    columnHelper.accessor('namespace', { header: 'Namespace' }),
    columnHelper.display({
      id: 'action',
      cell: () => (
        <IconButton>
          <DeleteOutline className={style.actionIcon} />
        </IconButton>
      ),
    }),
  ];

  return <Table data={rbacUserData} columns={rbacUserTableColumns} />;
};

interface RbacGroup {
  scope: string;
  group: string;
  clusterRole: string;
  namespace?: string;
}

interface RbacGroupContentProps {
  rbacGroupData: RbacGroup[];
}

const RbacGroupContent: React.FC<RbacGroupContentProps> = ({ rbacGroupData }) => {
  const columnHelper = createColumnHelper<RbacGroup>();

  const rbacGroupTableColumns = [
    columnHelper.accessor('scope', {
      header: () => (
        <TableSortLabel active={true} direction={'asc'}>
          Scope
        </TableSortLabel>
      ),
    }),
    columnHelper.accessor('group', { header: 'Group' }),
    columnHelper.accessor('clusterRole', { header: 'Cluster Role' }),
    columnHelper.accessor('namespace', { header: 'Namespace' }),
    columnHelper.display({
      id: 'action',
      cell: () => (
        <IconButton>
          <DeleteOutline className={style.actionIcon} />
        </IconButton>
      ),
    }),
  ];

  return <Table data={rbacGroupData} columns={rbacGroupTableColumns} emptyMessage="No bindings available." />;
};

export default RbacTabContent;
