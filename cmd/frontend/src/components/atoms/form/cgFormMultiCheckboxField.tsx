import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";

import { CGFromEditProps } from "@typedefines/form";

export default function CgFormMultiCheckboxField(props: CGFromEditProps) {
  const { control, setValue, getValues } = useFormContext();
  const [isHidden] = useState(props.fieldOption.hidden);

  const handleSelect = (value: string) => {
    const selectedItems = getValues(props.name) as any[];
    const isPresent = selectedItems?.indexOf(value);
    if (isPresent !== -1) {
      // Remove a check
      setValue(
        props.name,
        selectedItems.filter((item) => item !== value),
        {
          shouldDirty: true,
        },
      );
    } else {
      // Adding a check
      setValue(props.name, [...selectedItems, value], { shouldDirty: true });
    }
  };

  return (
    <Controller
      name={props.name}
      control={control}
      // TODO: Values 연계
      render={({ field: { value = [] }, fieldState: { error } }) =>
        isHidden ? (
          <input type="hidden" name={props.name} />
        ) : (
          <FormControl component="fieldset" error={!!error}>
            <FormLabel>{props.fieldOption.label}</FormLabel>
            <FormGroup row>
              {props.fieldOption.options?.map((option) => {
                const thisCheckboxValue = option.value || option.label;
                return (
                  <FormControl key={option.label}>
                    <FormControlLabel
                      key={option.label}
                      label={option.label}
                      control={
                        <Checkbox
                          name={option.label}
                          value={option.value}
                          checked={value.includes(thisCheckboxValue)}
                          onChange={() => handleSelect(thisCheckboxValue)}
                          disabled={props.fieldOption.readonly}
                        />
                      }
                    />
                  </FormControl>
                );
              })}
            </FormGroup>
            {error && <FormHelperText>{error.message}</FormHelperText>}
          </FormControl>
        )
      }
    />
  );
}
