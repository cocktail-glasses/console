import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Link from '@components/common/Link.tsx';
import ResourceListView from '@components/common/Resource/ResourceListView.tsx';
import ClusterRole from '@lib/k8s/clusterRole.ts';
import Role from '@lib/k8s/role.ts';
import { useErrorState } from '@lib/util.ts';

interface RolesDict {
  [kind: string]: Role[] | null;
}

export default function RoleList() {
  const [roles, setRoles] = useState<RolesDict | null>(null);
  const [roleError, setRolesError] = useErrorState(setupRoles);
  const [clusterRoleError, setClusterRolesError] = useErrorState(setupClusterRoles);
  const { t } = useTranslation('glossary');

  function setupRolesWithKind(newRoles: Role[] | null, kind: string) {
    setRoles((oldRoles) => ({ ...(oldRoles || {}), [kind]: newRoles }));
  }

  function setupRoles(roles: Role[] | null) {
    setupRolesWithKind(roles, 'Role');
  }

  function setupClusterRoles(roles: ClusterRole[] | null) {
    setupRolesWithKind(roles, 'ClusterRole');
  }

  function getJointItems() {
    if (roles === null) {
      return null;
    }

    let joint: Role[] = [];
    let hasItems = false;

    for (const items of Object.values(roles)) {
      if (items !== null) {
        joint = joint.concat(items);
        hasItems = true;
      }
    }

    return hasItems ? joint : null;
  }

  function getErrorMessage() {
    if (getJointItems() === null) {
      return Role.getErrorMessage(roleError || clusterRoleError);
    }

    return null;
  }

  Role.useApiList(setupRoles, setRolesError);
  ClusterRole.useApiList(setupClusterRoles, setClusterRolesError);

  return (
    <ResourceListView
      title={t('Roles')}
      errorMessage={getErrorMessage()}
      columns={[
        'type',
        {
          label: t('translation|Name'),
          getValue: (item) => item.metadata.namespace,
          render: (item) => (
            <Link
              routeName={item.metadata.namespace ? 'role' : 'clusterrole'}
              params={{
                namespace: item.metadata.namespace || '',
                name: item.metadata.name,
              }}
            >
              {item.metadata.name}
            </Link>
          ),
        },
        'namespace',
        'age',
      ]}
      data={getJointItems()}
      id="headlamp-roles"
    />
  );
}
