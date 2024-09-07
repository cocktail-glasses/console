import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";

import useUIContext from "@lib/hooks/useUIContext.ts";
import { CGFormFieldProps } from "@typedefines/form";

export default function CGFormArrayText(props: CGFormFieldProps) {
  const utils = useUIContext().Utils;

  return props.hidden ? null : (
    <FormControl component="fieldset">
      <FormLabel component="legend">{props.label}</FormLabel>
      <Typography variant="subtitle1">
        {utils.getStringData(
          props.value,
          props.options,
          props.isArray || false,
        )}
      </Typography>
    </FormControl>
  );
}
