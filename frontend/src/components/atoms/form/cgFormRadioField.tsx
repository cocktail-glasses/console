import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

import { CGFromEditProps } from "@typedefines/form";

export default function CgFormRadioField(props: CGFromEditProps) {
  const { control } = useFormContext();
  const [isHidden] = useState(props.fieldOption.hidden);

  return (
    <Controller
      name={props.name}
      control={control}
      render={({ field: { onChange, value = 0 }, fieldState: { error } }) =>
        isHidden ? (
          <input type="hidden" name={props.name} />
        ) : (
          <FormControl component="fieldset" error={!!error}>
            <FormLabel component="legend">{props.fieldOption.label}</FormLabel>
            <RadioGroup value={value} onChange={onChange} row>
              {props.fieldOption.options?.map((option) => (
                <FormControlLabel
                  key={option.label}
                  control={
                    <Radio
                      name={props.name}
                      value={option.value}
                      disabled={props.fieldOption.readonly}
                    />
                  }
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {error && <FormHelperText>{error.message}</FormHelperText>}
          </FormControl>
        )
      }
    />
  );
}
