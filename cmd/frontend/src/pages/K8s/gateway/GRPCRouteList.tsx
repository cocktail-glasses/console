import { useTranslation } from 'react-i18next';

import ResourceListView from '@components/common/Resource/ResourceListView';
import GRPCRoute from '@lib/k8s/grpcRoute';

export default function GRPCRouteList() {
  const { t } = useTranslation(['glossary', 'translation']);

  return <ResourceListView title={t('GRPCRoutes')} resourceClass={GRPCRoute} columns={['name', 'namespace', 'age']} />;
}
