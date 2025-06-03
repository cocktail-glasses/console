import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";

import useUIContext from "@lib/hooks/useUIContext";
import { CGFormFieldProps } from "@typedefines/form";

export default function CGFormText(props: CGFormFieldProps) {
  const utils = useUIContext().Utils;
  const value = utils.getStringData(
    props.value,
    props.options,
    props.isArray || false,
  );

  return props.hidden ? null : (
    <Box display="flex" alignItems="center">
      <ListSubheader sx={{ width: "20%", lineHeight: "48px" }}>
        {props.label}
      </ListSubheader>
      <ListItem sx={{ lineHeight: "48px" }}>
        <ListItemText primary={value} />
      </ListItem>
    </Box>
  );
}
