import { Controller as ControllerBase } from 'react-hook-form';

const Controller = ({ ...props }: React.ComponentProps<typeof ControllerBase>) => {
  return <ControllerBase {...props} />;
};

export default Controller;
