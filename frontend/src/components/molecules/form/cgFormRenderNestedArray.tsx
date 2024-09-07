import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Fragment } from "react/jsx-runtime";

import { Stack } from "@mui/material";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import List from "@mui/material/List";

import CGFormRenderField from "./cgFormRenderField.tsx";

import { Button } from "@components/atoms/Button";
import useUIContext from "@lib/hooks/useUIContext.ts";
import { CGFormRenderFieldProps } from "@typedefines/form";

export default function CGFormRenderNestedArray(props: CGFormRenderFieldProps) {
  const utils = useUIContext().Utils;
  const fieldName = utils.getFieldPath(
    props.field.name,
    props.parentName,
    props.index,
  );

  // TODO: Nested Array to List or Edit
  if (props.editMode) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { control } = useFormContext();
    const {
      fields: fieldArray,
      append,
      remove,
      // eslint-disable-next-line react-hooks/rules-of-hooks
    } = useFieldArray({
      control,
      name: fieldName,
    });

    const handleAppend = (fieldName: string) => {
      if (props.field.appendFunc) {
        append(props.field.appendFunc(fieldName));
      } else {
        console.log(
          `Cannot append nested object(${fieldName}). appenFunc not founded.`,
        );
      }
    };
    const handleRemove = (index: number) => {
      remove(index);
    };

    return (
      <Controller
        name={fieldName}
        control={control}
        key={`controller-${fieldName}`}
        render={({ fieldState: { error } }) => (
          <FormControl fullWidth error={!!error} key={`form-${fieldName}`}>
            {error && <FormHelperText>{error.message}</FormHelperText>}
            {fieldArray.map((item, index) => (
              <Stack spacing={2} key={item.id}>
                {props.field.fields?.map((subField) => (
                  <CGFormRenderField
                    initialData={props.initialData}
                    field={{ ...subField, value: undefined }}
                    editMode={props.editMode}
                    parentName={fieldName}
                    index={index}
                    key={`${item.id}-${subField.name}`}
                  />
                ))}
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Button
                    sx={{ width: 250, marginBottom: 3 }}
                    text="Delete"
                    onClick={() => handleRemove(index)}
                    variant="outlined"
                    color="primary"
                  />
                </Stack>
              </Stack>
            ))}
            <Stack direction="row" justifyContent="center" alignItems="center">
              <Button
                sx={{ width: "100%", marginBottom: 3 }}
                text="Add"
                onClick={() => handleAppend(props.field.name)}
                variant="outlined"
                color="secondary"
              />
            </Stack>
          </FormControl>
        )}
      />
    );
  } else {
    // 각 Array에 맞는 값을 찾아서 반복
    const vals = utils.getValueByPath(props.initialData, fieldName, []);
    return vals.map((val: any, index: number) => (
      <List
        sx={{ width: "100%", bgcolor: "background.paper", marginBottom: 3 }}
        key={`${fieldName}-${index}`}
      >
        {props.field.fields?.map((subField, subIndex) => (
          <Fragment key={`${fieldName}-${subIndex}-${subField.name}`}>
            {subIndex > 0 && !subField.hidden && (
              <Divider key={`${fieldName}-${subIndex}-${subField.name}`} />
            )}
            <CGFormRenderField
              initialData={props.initialData}
              field={{ ...subField, value: val[subField.name] }}
              editMode={props.editMode}
              parentName={fieldName}
              index={index}
            />
          </Fragment>
        ))}
      </List>
    ));
  }
}
