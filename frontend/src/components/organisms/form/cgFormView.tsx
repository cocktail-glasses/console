import { Fragment } from "react/jsx-runtime";

import { Divider } from "@mui/material";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";

import CGFormRenderField from "@components/molecules/form/cgFormRenderField.tsx";
import { CGFormOption } from "@typedefines/form";

interface CGFormViewProps {
  formOption: CGFormOption;
}

export default function CGFormView(props: CGFormViewProps) {
  return (
    <List
      sx={{ width: "100%", bgcolor: "background.paper" }}
      subheader={
        <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
          기본정보
        </Typography>
      }
    >
      {props.formOption.fields.map((field, index) => (
        <Fragment key={field.name}>
          {index > 0 && !field.hidden && <Divider />}
          <CGFormRenderField
            initialData={props.formOption.initialData}
            field={{ ...field, value: undefined }}
            editMode={false}
          />
        </Fragment>
      ))}
    </List>
  );
}
