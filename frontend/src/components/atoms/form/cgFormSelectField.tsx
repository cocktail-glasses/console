import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import useFormSubscribe from "@lib/hooks/form/useFormSubscribe.ts";
import useUIContext from "@lib/hooks/useUIContext.ts";
import { CGFromEditProps, FormChangeReturn } from "@typedefines/form";

export default function CGFormSelectField(props: CGFromEditProps) {
  const utils = useUIContext().Utils;
  const { control, setValue } = useFormContext();

  const [options, setOptions] = useState(
    props.fieldOption.options ?? [{ label: "선택하세요.", value: -1 }],
  );
  const [isHidden, setIsHidden] = useState(props.fieldOption.hidden);

  // DependsOn 설정
  if (props.fieldOption.dependsOn) {
    const prefix = utils.removeLastPath(props.name, ".");
    const dependsFields = prefix
      ? props.fieldOption.dependsOn.fieldNames.map(
          (name) => `${prefix}.${name}`,
        )
      : props.fieldOption.dependsOn.fieldNames;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useFormSubscribe(control)(
      dependsFields,
      (
        fieldName: string | string[],
        fieldValue: string[],
        _type: string,
        allValues: any,
      ) => {
        const returnVals: FormChangeReturn =
          props.fieldOption.dependsOn!.changeFunc(
            props.name,
            [...fieldName],
            fieldValue,
            allValues,
          );
        setIsHidden(returnVals.hidden);
        if (!returnVals.hidden) {
          if (returnVals.data) {
            setValue(props.name, returnVals.data);
          }
          if (returnVals.options) {
            setOptions(returnVals.options);
          }
        }
      },
    );
  }

  return (
    <Controller
      name={props.name}
      control={control}
      render={({
        field: { onChange, value = "", onBlur },
        fieldState: { error },
      }) =>
        isHidden ? (
          <input type="hidden" name="{props.name}" />
        ) : (
          // TODO: Multiple
          <TextField
            select
            name={props.name}
            helperText={error ? error.message || " " : ""}
            error={!!error}
            onChange={onChange}
            value={value}
            fullWidth
            label={props.fieldOption.label}
            onBlur={onBlur}
            disabled={props.fieldOption.readonly}
          >
            {options.map((opt) => (
              <MenuItem key={opt.label} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
        )
      }
    />
  );
}
