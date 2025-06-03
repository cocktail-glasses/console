import React, { useState } from 'react';

import { SmartToyOutlined, Person3Outlined } from '@mui/icons-material';
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material';

import eq from 'lodash/eq';
import head from 'lodash/head';

import commonStyle from '../../../Common.module.scss';
import style from './RbacTabContent.module.scss';

import AddButton from '@components/molecules/KaaS/Button/AddButton/AddButton';
import DeleteIconButton from '@components/molecules/KaaS/Button/DeleteIconButton/DeleteIconButton';
import Dialog from '@components/molecules/KaaS/Dialog/Dialog';
import SelectField from '@components/molecules/KaaS/Form/SelectField';
import Table from '@components/molecules/KaaS/Table/Table';
// import ClusterRoleBinding from '@lib/k8s/clusterRoleBinding';
// import RoleBinding, { KubeRoleBinding } from '@lib/k8s/roleBinding';
import { createColumnHelper } from '@tanstack/react-table';

const RbacTabContent = () => {
  // const [clusterRoleBindings] = ClusterRoleBinding.useList();
  // const [roleBindings] = RoleBinding.useList();

  // const filterByUser = (roleBinding: KubeRoleBinding) => roleBinding.subjects
  // const print = (roleBinding: KubeRoleBinding) => console.log('subject: ', map(roleBinding.subjects, 'kind'));

  // clusterRoleBindings?.forEach(print);

  const rbacTypes = [
    {
      value: 'serviceAccount',
      label: (
        <Box className={style.selectIconOption}>
          <SmartToyOutlined />
          Service Account
        </Box>
      ),
    },
    {
      value: 'user',
      label: (
        <Box className={style.selectIconOption}>
          <Person3Outlined />
          User
        </Box>
      ),
    },
    {
      value: 'group',
      label: (
        <Box className={style.selectIconOption}>
          <SmartToyOutlined />
          Group
        </Box>
      ),
    },
  ];
  const [rbacSelect, setRbacSelect] = useState(head(rbacTypes)?.value);

  const rbacUserData: RbacUser[] = [
    // {
    //   scope: 'Cluster',
    //   user: 'skyikho@acornsoft.io',
    //   clusterRole: 'cluster-admin',
    // },
    // {
    //   scope: 'Namespace',
    //   user: 'yunwansu@acornsoft.io',
    //   clusterRole: 'namespace-admin',
    //   namespace: 'default',
    // },
    // {
    //   scope: 'Namespace',
    //   user: 'yunwansu@acornsoft.io',
    //   clusterRole: 'namespace-editor',
    //   namespace: 'default',
    // },
  ];

  // create service account
  const [isOpen, setIsOpen] = useState(false);
  const createServiceAccountContent = (
    <Stack>
      <TextField variant="outlined" label="Name" required />

      <FormControl sx={{ marginTop: '30px' }}>
        <FormLabel>Select a Group</FormLabel>
        <RadioGroup defaultValue="" sx={{ marginTop: '10px', gap: '30px' }}>
          <FormControlLabel
            value="projectManager"
            control={<Radio name="" />}
            label={
              <Stack>
                <Typography>Project Manager</Typography>
                <Typography variant="caption">
                  Manage the project, members and service accounts, no access to clusters
                </Typography>
              </Stack>
            }
          />
          <FormControlLabel
            value="editor"
            control={<Radio name="" />}
            label={
              <Stack>
                <Typography>Editor</Typography>
                <Typography variant="caption">Write access and management of clusters, nodes and SSH Keys</Typography>
              </Stack>
            }
          />
          <FormControlLabel
            value="viewer"
            control={<Radio name="" />}
            label={
              <Stack>
                <Typography>Viewer</Typography>
                <Typography variant="caption">Read-only access, can only view existing resources</Typography>
              </Stack>
            }
          />
        </RadioGroup>
      </FormControl>
    </Stack>
  );

  const createServiceAccountFooter = (
    <Box>
      <AddButton label="Create Service Account" size="large" />
    </Box>
  );

  return (
    <Stack className={style.rbacContent}>
      <Box className={style.menuContainer}>
        <SelectField
          className={style.rbacSelector}
          size="small"
          value={rbacSelect}
          onChange={(e) => setRbacSelect(e.target.value)}
          items={rbacTypes}
        />

        <Box className={style.rbacActionContainer}>
          {eq(rbacSelect, rbacTypes[0].value) && (
            <AddButton
              label={<strong>Add Service Account</strong>}
              size="large"
              className={commonStyle.kaasPrimaryColor}
              textTransform="none"
              onClick={() => setIsOpen(true)}
            />
          )}
          <AddButton
            label={<strong>Add Binding</strong>}
            size="large"
            className={commonStyle.kaasPrimaryColor}
            textTransform="none"
          />
        </Box>
      </Box>
      <Box>
        {eq(rbacSelect, rbacTypes[0].value) && <RbacServiceAccountContent />}
        {eq(rbacSelect, rbacTypes[1].value) && <RbacUserContent rbacUserData={rbacUserData} />}
        {eq(rbacSelect, rbacTypes[2].value) && <RbacGroupContent rbacGroupData={[]} />}
      </Box>
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        closeBtn
        title="Create Service Account"
        content={createServiceAccountContent}
        footer={createServiceAccountFooter}
        sx={{ padding: '20px', '& .MuiDialog-paper': { maxWidth: '660px', minWidth: '660px' } }}
      />
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
      cell: () => <DeleteIconButton variant="outlined" className={style.actionIcon} />,
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
      cell: () => <DeleteIconButton variant="outlined" className={style.actionIcon} />,
    }),
  ];

  return <Table data={rbacGroupData} columns={rbacGroupTableColumns} emptyMessage="No bindings available." />;
};

export default RbacTabContent;
