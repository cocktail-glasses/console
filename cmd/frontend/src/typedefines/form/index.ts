import { Mode } from "react-hook-form";

import { ClassConstructor } from "class-transformer";

/*================================================================================
 * Form 관련 타입/인터페이스
 ================================================================================*/

export interface OptionValue<T> {
  label: string;
  value: T;
}

export interface FormChangeReturn {
  data?: any;
  hidden: boolean;
  options?: OptionValue<any>[];
}

/**
 * CGForm 구성 옵션
 */
export interface CGFieldOption {
  name: string;
  label: string;
  defaultValue?: any;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "checkbox"
    | "radio"
    | "select"
    | "date"
    | "nested";
  hidden?: boolean;
  readonly?: boolean;
  align?: "left" | "center" | "right";
  options?: OptionValue<any>[];
  isArray?: boolean;
  columnSpan?: number;
  dependsOn?: {
    fieldNames: Array<string>;
    changeFunc: (
      fieldName: string,
      changeFieldNames: string[],
      changeFieldValues: any[],
      allValues: any,
    ) => FormChangeReturn;
  };
  valueFunc?: (fieldName: string, fieldValue: any) => any;
  appendFunc?: (fieldName: string) => any;
  fields?: CGFieldOption[];
}
export interface CGFormOption {
  columns: number;
  initialData: object;
  schema?: ClassConstructor<any>;
  validateAfterRender?: boolean;
  validationMode?: Mode;
  submitHandler?: (data: object) => void;
  title: string;
  fields: CGFieldOption[];
}

// export interface CGFormProps {
//   formOption: CGFormOption;
// }

export interface CGFormFieldProps extends CGFieldOption {
  value: any;
}

export interface CGFromEditProps {
  name: string;
  fieldOption: CGFieldOption;
}

export interface CGFormRenderFieldProps {
  initialData: object;
  field: CGFormFieldProps;
  editMode: boolean;
  parentName?: string;
  index?: number;
}
