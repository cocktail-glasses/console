import InputPassword from "./InputPassword";
import InputSelect from "./InputSelect";
import InputText from "./InputText";

export interface InputProps {
  name: string;
  label: string;
}

export const sxProps = {
  minWidth: '25%',
  maxWidth: '75%'
}

export { InputPassword, InputSelect, InputText }
