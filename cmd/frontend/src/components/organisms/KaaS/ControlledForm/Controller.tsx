import { Controller as ControllerBase } from 'react-hook-form';

const Controller = ({ ...props }: React.ComponentPropsWithoutRef<typeof ControllerBase>) => {
  return <ControllerBase {...props} />;
};

export default Controller;
