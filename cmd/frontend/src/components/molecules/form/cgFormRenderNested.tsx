import { Fragment } from "react/jsx-runtime";

import Divider from "@mui/material/Divider";

import CGFormRenderField from "./cgFormRenderField";
import CGFormRenderNestedArray from "./cgFormRenderNestedArray";

import useUIContext from "@lib/hooks/useUIContext";
import { CGFormRenderFieldProps } from "@typedefines/form";

export default function CGFormRenderNested(props: CGFormRenderFieldProps) {
  const utils = useUIContext().Utils;

  if (props.field.isArray) {
    return (
      <CGFormRenderNestedArray
        {...props}
        key={`nestedarray-${props.field.name}`}
      />
    );
  } else {
    const fieldName = utils.getFieldPath(
      props.field.name,
      props.parentName,
      props.index,
    );
    const val = utils.getValueByPath(props.initialData, fieldName, {});
    // Array가 아닌 경우는 중첩 객체에 대한 Render Fields 실행
    return props.field.fields?.map((subField, index) => (
      <Fragment key={`${fieldName}-${subField.name}`}>
        {index > 0 && !props.field.hidden && (
          <Divider key={`${fieldName}-${subField.name}`} />
        )}
        <CGFormRenderField
          {...{
            ...props,
            field: { ...subField, value: val[subField.name] },
            parentName: fieldName,
            index: -1,
          }}
          key={`nestedsingle-${fieldName}-${subField.name}`}
        />
      </Fragment>
    ));
  }
}
