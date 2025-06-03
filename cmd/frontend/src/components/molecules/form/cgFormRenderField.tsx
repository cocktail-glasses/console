import Typography from "@mui/material/Typography";

import CGFormMaskedText from "./cgFormMaskedText";
import CGFormRenderNested from "./cgFormRenderNested";
import CGFormText from "./cgFormText";

import BoxBoader from "@components/atoms/Box/BoxBoader";
import CgFormDateField from "@components/atoms/form/cgFormDateField";
import CgFormMultiCheckboxField from "@components/atoms/form/cgFormMultiCheckboxField";
import CgFormRadioField from "@components/atoms/form/cgFormRadioField";
import CGFormSelectField from "@components/atoms/form/cgFormSelectField";
import CGFormTextField from "@components/atoms/form/cgFormTextField";
import useUIContext from "@lib/hooks/useUIContext";
import { CGFormFieldProps, CGFormRenderFieldProps } from "@typedefines/form";

export default function CGFormRenderField(props: CGFormRenderFieldProps) {
  const utils = useUIContext().Utils;

  /**
   * 필드에 대한 값(initialData)과 ValueFunc 호출을 통한 보여주기용 데이터 설정
   * @param fieldName 필드명
   * @param fieldProps 필드옵션
   */
  const getViewData = (fieldName: string, fieldProps: CGFormFieldProps) => {
    if (!fieldProps.value) {
      fieldProps.value = utils.getValueByPath(
        props.initialData,
        fieldName,
        fieldProps.defaultValue,
      );
    }
    if (fieldProps.valueFunc) {
      fieldProps.value = fieldProps.valueFunc(
        fieldProps.name,
        fieldProps.value,
      );
    }
  };

  // 필드명 조정
  const fieldName = utils.getFieldPath(
    props.field.name,
    props.parentName,
    props.index,
  );

  // 필드 유형에 따른 처리
  switch (props.field.type) {
    case "text":
    case "email":
    case "password":
    case "number":
      if (!props.editMode) {
        getViewData(fieldName, props.field);
        return props.field.type === "password" ? (
          <CGFormMaskedText {...props.field} key={fieldName} />
        ) : (
          <CGFormText {...props.field} />
        );
      } else {
        return (
          <CGFormTextField
            {...{ name: fieldName, fieldOption: props.field }}
            key={fieldName}
          />
        );
      }
    case "checkbox":
      if (!props.editMode) {
        getViewData(fieldName, props.field);
        return <CGFormText {...props.field} key={fieldName} />;
      } else {
        return (
          <CgFormMultiCheckboxField
            {...{ name: fieldName, fieldOption: props.field }}
            key={fieldName}
          />
        );
      }
    case "select":
      if (!props.editMode) {
        getViewData(fieldName, props.field);
        return <CGFormText {...props.field} key={fieldName} />;
      } else {
        return (
          <CGFormSelectField
            {...{ name: fieldName, fieldOption: props.field }}
            key={fieldName}
          />
        );
      }
    case "radio":
      if (!props.editMode) {
        getViewData(fieldName, props.field);
        return <CGFormText {...props.field} key={fieldName} />;
      } else {
        return (
          <CgFormRadioField
            {...{ name: fieldName, fieldOption: props.field }}
            key={fieldName}
          />
        );
      }
    case "date":
      if (!props.editMode) {
        getViewData(fieldName, props.field);
        return <CGFormText {...props.field} key={fieldName} />;
      } else {
        return (
          <CgFormDateField
            {...{ name: fieldName, fieldOption: props.field }}
            key={fieldName}
          />
        );
      }
    case "nested":
      return (
        <BoxBoader sx={{ marginTop: 2, marginBottom: 2 }}>
          <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
            {props.field.label}
          </Typography>
          <CGFormRenderNested {...props} />
        </BoxBoader>
      );
    default:
      return <span>{props.field.name}</span>;
  }
}
