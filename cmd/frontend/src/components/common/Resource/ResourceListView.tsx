import { PropsWithChildren, ReactElement, ReactNode } from 'react';

import { CreateResourceButton } from '../CreateResourceButton';

import ResourceTable, { ResourceTableProps } from '@components/common/Resource/ResourceTable';
import SectionBox from '@components/common/SectionBox';
import SectionFilterHeader, { SectionFilterHeaderProps } from '@components/common/SectionFilterHeader';
import { KubeObject, KubeObjectClass } from '@lib/k8s/cluster';

export interface ResourceListViewProps<Item extends KubeObject>
  extends PropsWithChildren<Omit<ResourceTableProps<Item>, 'data'>> {
  title: ReactNode;
  headerProps?: Omit<SectionFilterHeaderProps, 'title'>;
  data: Item[] | null;
}

export interface ResourceListViewWithResourceClassProps<ItemClass extends KubeObjectClass>
  extends PropsWithChildren<Omit<ResourceListViewProps<InstanceType<ItemClass>>, 'data'>> {
  title: ReactNode;
  headerProps?: Omit<SectionFilterHeaderProps, 'title'>;
  resourceClass: ItemClass;
}

export default function ResourceListView<ItemClass extends KubeObjectClass>(
  props: ResourceListViewWithResourceClassProps<ItemClass>
): ReactElement;
export default function ResourceListView<Item extends KubeObject<any>>(
  props: ResourceListViewProps<Item>
): ReactElement;
export default function ResourceListView(
  props: ResourceListViewProps<any> | ResourceListViewWithResourceClassProps<any>
) {
  const { title, children, headerProps, ...tableProps } = props;
  const withNamespaceFilter = 'resourceClass' in props && props.resourceClass?.isNamespaced;
  const resourceClass = (props as ResourceListViewWithResourceClassProps<any>).resourceClass as KubeObjectClass;

  return (
    <SectionBox
      title={
        typeof title === 'string' ? (
          <SectionFilterHeader
            title={title}
            noNamespaceFilter={!withNamespaceFilter}
            titleSideActions={
              headerProps?.titleSideActions ||
              (resourceClass ? [<CreateResourceButton resourceClass={resourceClass} />] : undefined)
            }
            {...headerProps}
          />
        ) : (
          title
        )
      }
    >
      {/* <Box sx={(theme) => ({ backgroundColor: theme.palette.background.paper, borderRadius: 1 })}> */}
      <ResourceTable enableRowActions enableRowSelection {...tableProps} />
      {/* </Box> */}
      {children}
    </SectionBox>
  );
}
