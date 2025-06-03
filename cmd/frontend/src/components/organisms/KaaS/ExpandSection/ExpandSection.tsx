import Collapse from '@components/atoms/KaaS/Collapse/Collapse';
import CollapseButton, { CollapseButtonProps } from '@components/molecules/KaaS/Button/CollapseButton/CollapseButton';

interface ExpandSectionProps
  extends CollapseButtonProps,
    Omit<React.ComponentPropsWithoutRef<typeof Collapse>, 'onChange'> {
  contentPorps?: Omit<React.ComponentPropsWithoutRef<typeof Collapse>, 'isCollapse' | 'data'>;
}

const ExpandSection = ({ isCollapse, onChange, label, data, contentPorps }: ExpandSectionProps) => (
  <>
    <CollapseButton label={label} isCollapse={isCollapse} onChange={onChange} />
    <Collapse {...contentPorps} isCollapse={isCollapse} data={data} />
  </>
);

export default ExpandSection;
