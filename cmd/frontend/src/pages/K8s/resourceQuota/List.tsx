import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';

import { SimpleTableProps } from '@components/common';
import ResourceListView from '@components/common/Resource/ResourceListView';
import { ApiError } from '@lib/k8s/apiProxy';
import ResourceQuota from '@lib/k8s/resourceQuota';

const WrappingBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'left',
  flexWrap: 'wrap',
  '& > *': {
    margin: theme.spacing(0.5),
  },
}));

const PaddedChip = styled(Chip)({
  paddingTop: '2px',
  paddingBottom: '2px',
});

export interface ResourceQuotaProps {
  resourceQuotas: ResourceQuota[] | null;
  error: ApiError | null;
  hideColumns?: string[];
  reflectTableInURL?: SimpleTableProps['reflectInURL'];
  noNamespaceFilter?: boolean;
}

export function ResourceQuotaRenderer(props: ResourceQuotaProps) {
  const { resourceQuotas, error, hideColumns = [], reflectTableInURL = 'resourcequotas', noNamespaceFilter } = props;
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <ResourceListView
      title={t('glossary|Resource Quotas')}
      hideColumns={hideColumns}
      columns={[
        'name',
        'namespace',
        {
          id: 'requests',
          label: t('translation|Request'),
          getValue: (item) => item.requests.join(', '),
          render: (item) => {
            const requests: JSX.Element[] = [];
            item.requests.forEach((request: string) => {
              requests.push(<PaddedChip label={request} variant="outlined" size="small" />);
            });
            return <WrappingBox>{requests}</WrappingBox>;
          },
        },
        {
          id: 'limits',
          label: t('translation|Limit'),
          getValue: (item) => item?.limits?.join(', '),
          render: (item) => {
            const limits: JSX.Element[] = [];
            item.limits.forEach((limit: string) => {
              limits.push(<PaddedChip label={limit} variant="outlined" size="small" />);
            });
            return <WrappingBox>{limits}</WrappingBox>;
          },
        },
        'age',
      ]}
      headerProps={{
        noNamespaceFilter,
      }}
      errorMessage={ResourceQuota.getErrorMessage(error)}
      data={resourceQuotas}
      reflectInURL={reflectTableInURL}
      id="headlamp-resourcequotas"
    />
  );
}

export default function ResourceQuotaList() {
  const [resourceQuotas, error] = ResourceQuota.useList();

  return <ResourceQuotaRenderer resourceQuotas={resourceQuotas} error={error} reflectTableInURL />;
}
