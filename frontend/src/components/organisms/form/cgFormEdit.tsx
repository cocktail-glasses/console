import { forwardRef, useEffect, useImperativeHandle } from "react";

import { DevTool } from "@hookform/devtools";

import { ValidationError } from "class-validator";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import CGFormRenderField from "@components/molecules/form/cgFormRenderField.tsx";
import useCGForm from "@lib/hooks/form/useCGForm.tsx";
import { CGFormOption } from "@typedefines/form";

interface CGFormEditProps {
  formOption: CGFormOption;
}

const CGFormEdit = forwardRef((props: CGFormEditProps, ref: React.Ref<any>) => {
  /**
   * 외부에서 저장 버튼이 눌리면 Validation / Custom Validation 수행 후 정상적이면 formOption의 submitHandler 호출
   * @param data Form 데이터
   */
  const onSubmit = async (data: any) => {
    if (data.customValidation) {
      try {
        await data.customValidation();
        props.formOption.submitHandler!(data);
      } catch (validationErrors) {
        if (validationErrors instanceof Array) {
          validationErrors.forEach((err: ValidationError) => {
            if (err.constraints) {
              Object.keys(err.constraints).forEach((key) => {
                methods.setError(key as any, {
                  type: "manual",
                  message: err.constraints ? err.constraints[key] : "Unknown",
                });
              });
            }
          });
        }
      }
    } else {
      props.formOption.submitHandler!(data);
    }
  };

  const onError = async (err: any) => {
    // TODO: Error 처리 검증 필요.
    console.log("form error", err);
  };

  /**
   * Form 내부에서 사용할 입력대상 필드들을 생성한다.
   * @returns 렌더링된 Form Chlld Nodes
   */
  const renderChild = (): React.ReactNode => {
    return (
      <Stack spacing={2}>
        <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
          {props.formOption.title}
        </Typography>
        {props.formOption.fields.map((field) => (
          <CGFormRenderField
            initialData={props.formOption.initialData}
            field={Object.assign(field, { value: undefined })}
            editMode={true}
            key={`editstack-${field.name}`}
          />
        ))}
      </Stack>
    );
  };

  /**
   * Form 관리용 Hook 호출 및 Child 실행
   */
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { methods, FormControl } = useCGForm({
    schema: props.formOption.schema!,
    mode: props.formOption.validationMode!,
    defaultValues: props.formOption.initialData,
    children: renderChild(),
  });

  /**
   * 외부에서 접근할 수 있는 함수들 노출 (By useRef)
   */
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useImperativeHandle(ref, () => ({
    submit: methods.handleSubmit(onSubmit, onError),
    isDirty: () => {
      return (
        Object.keys(methods.control._formState.dirtyFields).length > 0 &&
        methods.control._formState.isDirty
      );
    },
    reset: () => {
      methods.reset(props.formOption.initialData);
      if (props.formOption.validateAfterRender) {
        methods.trigger();
      }
    },
  }));

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (props.formOption.validateAfterRender) {
      methods.trigger();
    }
  }, [methods, props]);

  return (
    <>
      <FormControl />
      <DevTool control={methods.control} />
    </>
  );
});

export default CGFormEdit;
