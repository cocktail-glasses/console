import InputPassword from "./InputPassword.tsx";
import InputSelect from "./InputSelect.tsx";
import InputText from "./InputText.tsx";

export interface InputProps {
  name: string;
  label: string;
}

export const sxProps = {
  minWidth: '25%',
  maxWidth: '75%'
}

export { InputPassword, InputSelect, InputText }
