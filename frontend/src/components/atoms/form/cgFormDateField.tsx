import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import dayjs from "dayjs";

import { CGFromEditProps } from "@typedefines/form";

export default function CgFormDateField(props: CGFromEditProps) {
  const { control } = useFormContext();
  const [isHidden] = useState(props.fieldOption.hidden);

  return (
    <Controller
      name={props.name}
      control={control}
      render={({ field: { onChange, value = "" }, fieldState: { error } }) =>
        isHidden ? (
          <input type="hidden" name={props.name} />
        ) : (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              // TODO: Date Format 상수 처리
              format="YYYY/MM/DD"
              label={props.fieldOption.label}
              value={dayjs(value) || null}
              onChange={(date) => {
                onChange(date?.toDate());
              }}
              disabled={props.fieldOption.readonly}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "normal",
                  error: !!error,
                  helperText: error?.message,
                  disabled: props.fieldOption.readonly,
                },
              }}
            />
          </LocalizationProvider>
        )
      }
    />
  );
}
