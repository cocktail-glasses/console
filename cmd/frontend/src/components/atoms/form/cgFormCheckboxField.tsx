import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";

import { CGFromEditProps } from "@typedefines/form";

export default function CgFormCheckboxField(props: CGFromEditProps) {
  const { control } = useFormContext();
  const [isHidden] = useState(props.fieldOption.hidden);

  return (
    <Controller
      name={props.name}
      control={control}
      render={({
        field: { onChange, value = false },
        fieldState: { error },
      }) =>
        isHidden ? (
          <input type="hidden" name={props.name} />
        ) : (
          // TODO: Value 연계
          <FormControl error={!!error}>
            <FormGroup>
              <FormControlLabel
                key={props.name}
                control={
                  <Checkbox
                    name={props.name}
                    value={value}
                    checked={value}
                    onChange={onChange}
                    disabled={props.fieldOption.readonly}
                  />
                }
                label={props.fieldOption.label}
              />
              <FormHelperText>
                {error ? error.message || " " : " "}
              </FormHelperText>
            </FormGroup>
          </FormControl>
        )
      }
    />
  );
}
