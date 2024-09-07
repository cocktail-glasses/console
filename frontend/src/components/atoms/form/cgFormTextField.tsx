import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import TextField from "@mui/material/TextField";

import useFormSubscribe from "@lib/hooks/form/useFormSubscribe.ts";
import useUIContext from "@lib/hooks/useUIContext.ts";
import { CGFromEditProps, FormChangeReturn } from "@typedefines/form";

export default function CGFormTextField(props: CGFromEditProps) {
  const utils = useUIContext().Utils;
  const { control, setValue } = useFormContext();
  const [isHidden] = useState(props.fieldOption.hidden);

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
      (fieldName, fieldValue, _type, allValues) => {
        const returnVals: FormChangeReturn =
          props.fieldOption.dependsOn!.changeFunc(
            props.name,
            fieldName,
            fieldValue,
            allValues,
          );
        if (returnVals.data) {
          setValue(props.name, returnVals.data);
        }
      },
    );
  }

  return (
    <Controller
      name={props.name}
      control={control}
      render={({ field, fieldState: { error } }) =>
        isHidden ? (
          <input type="hidden" name="{props.name}" />
        ) : (
          <TextField
            {...field}
            type={props.fieldOption.type}
            name={props.name}
            helperText={error ? error.message || " " : ""}
            error={!!error}
            fullWidth
            label={props.fieldOption.label}
            disabled={props.fieldOption.readonly}
          />
        )
      }
    />
  );
}
