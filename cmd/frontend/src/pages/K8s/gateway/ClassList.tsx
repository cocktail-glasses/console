import { useTranslation } from 'react-i18next';

import { Box } from '@mui/material';

import { LightTooltip, StatusLabel, StatusLabelProps } from '@components/common';
import ResourceListView from '@components/common/Resource/ResourceListView';
import GatewayClass from '@lib/k8s/gatewayClass';

export function makeGatewayStatusLabel(conditions: any[] | null) {
  if (!conditions) {
    return null;
  }

  const conditionOptions = {
    Accepted: {
      status: 'success',
      icon: 'mdi:check-bold',
    },
  };

  const condition = conditions.find(
    ({ status, type }: { status: string; type: string }) => type in conditionOptions && status === 'True'
  );

  if (!condition) {
    return null;
  }

  const tooltip = '';

  const conditionInfo = conditionOptions[condition.type as 'Accepted'];

  return (
    <LightTooltip title={tooltip} interactive>
      <Box display="inline">
        <StatusLabel status={conditionInfo.status as StatusLabelProps['status']}>{condition.type}</StatusLabel>
      </Box>
    </LightTooltip>
  );
}

export default function GatewayClassList() {
  const { t } = useTranslation('glossary');

  return (
    <ResourceListView
      title={t('Gateway Classes')}
      headerProps={{
        noNamespaceFilter: true,
      }}
      resourceClass={GatewayClass}
      columns={[
        'name',
        {
          id: 'controllerName',
          label: t('Controller'),
          getValue: (gatewayClass: GatewayClass) => gatewayClass.spec?.controllerName,
        },
        {
          id: 'conditions',
          label: t('translation|Conditions'),
          getValue: (gatewayClass: GatewayClass) =>
            gatewayClass.status?.conditions?.find(({ status }: { status: string }) => status === 'True')?.type || null,
          render: (gatewayClass: GatewayClass) => makeGatewayStatusLabel(gatewayClass.status?.conditions || null),
        },
        'age',
      ]}
    />
  );
}
