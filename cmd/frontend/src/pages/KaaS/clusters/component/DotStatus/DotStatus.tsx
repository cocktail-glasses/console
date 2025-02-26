import DotStatusEnum from "./DotStatusEnum";
import "./index.scss";

interface DotStatusProps {
  status?: DotStatusEnum;
}

const DotStatus: React.FC<DotStatusProps> = ({
  status = DotStatusEnum.DEFAULT,
}) => (
  <div className="dot-status-container">
    <div className={`dot-status ${status}`} />
  </div>
);

export default DotStatus;
