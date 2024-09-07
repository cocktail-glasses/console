import { Box } from '@mui/material';

import ResourceTable, { ResourceTableProps } from '@components/common/Resource/ResourceTable.tsx';
import SectionBox from '@components/common/SectionBox.tsx';
import SectionFilterHeader, { SectionFilterHeaderProps } from '@components/common/SectionFilterHeader.tsx';
import { KubeObject } from '@lib/k8s/cluster.ts';

export interface ResourceListViewProps<ItemType> extends React.PropsWithChildren<ResourceTableProps<ItemType>> {
  title: string | JSX.Element;
  headerProps?: Omit<SectionFilterHeaderProps, 'title'>;
}

type Class<T> = new (...args: any[]) => T;

export interface ResourceListViewWithResourceClassProps<ItemType>
  extends Omit<ResourceListViewProps<ItemType>, 'data'> {
  resourceClass: Class<ItemType>;
}

export default function ResourceListView<ItemType>(
  props: ResourceListViewProps<ItemType> | ResourceListViewWithResourceClassProps<ItemType>
) {
  const { title, children, headerProps, ...tableProps } = props;
  const withNamespaceFilter = 'resourceClass' in props && (props.resourceClass as KubeObject)?.isNamespaced;

  return (
    <SectionBox
      title={
        typeof title === 'string' ? (
          <SectionFilterHeader title={title} noNamespaceFilter={!withNamespaceFilter} {...headerProps} />
        ) : (
          title
        )
      }
    >
      <Box sx={(theme) => ({ backgroundColor: theme.palette.background.paper, borderRadius: 1 })}>
        <ResourceTable {...tableProps} />
      </Box>
      {children}
    </SectionBox>
  );
}
