import Collapse, { CollapseProps } from '@components/atoms/KaaS/Collapse/Collapse';
import CollapseButton, { CollapseButtonProps } from '@components/molecules/KaaS/Button/CollapseButton/CollapseButton';

interface ExpandSectionProps extends CollapseButtonProps, CollapseProps {}

const ExpandSection = ({ isCollapse, onChange, label, data }: ExpandSectionProps) => (
  <>
    <CollapseButton label={label} isCollapse={isCollapse} onChange={onChange} />
    <Collapse isCollapse={isCollapse} data={data} />
  </>
);

export default ExpandSection;
