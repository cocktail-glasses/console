import { useTranslation } from 'react-i18next';

import { SimpleTableProps } from '@components/common';
import ResourceListView from '@components/common/Resource/ResourceListView';
import { ApiError } from '@lib/k8s/apiProxy';
import { LimitRange } from '@lib/k8s/limitRange';

export interface LimitRangeProps {
  limitRanges: LimitRange[] | null;
  error: ApiError | null;
  hideColumns?: string[];
  reflectTableInURL?: SimpleTableProps['reflectInURL'];
  noNamespaceFilter?: boolean;
}

export function LimitRangeRenderer(props: LimitRangeProps) {
  const { limitRanges, error, hideColumns = [], reflectTableInURL = 'limitranges', noNamespaceFilter } = props;
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <ResourceListView
      title={t('glossary|LimitRange')}
      columns={['name', 'namespace', 'age']}
      hideColumns={hideColumns}
      headerProps={{
        noNamespaceFilter,
      }}
      errorMessage={LimitRange.getErrorMessage(error)}
      data={limitRanges}
      reflectInURL={reflectTableInURL}
      id="headlamp-limitranges"
    />
  );
}

export default function LimitRangeList() {
  const [limitRanges, error] = LimitRange.useList();

  return <LimitRangeRenderer limitRanges={limitRanges} error={error} reflectTableInURL />;
}
