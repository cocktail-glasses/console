import { DevTool } from "@hookform/devtools";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { ClassConstructor } from "class-transformer";
import { FieldValues, FormProvider, Mode, useForm } from "react-hook-form";

interface UseCGFormProps {
  schema: ClassConstructor<any>;
  mode: Mode;
  defaultValues: FieldValues;
  children: React.ReactNode;
}
/**
 * CGFormEdit 운영을 위한 훅
 * - react-hook-form의 useForm 훅 설정
 * - FormProvider를 통한 Context Boundary 구성
 * - class-validator를 사용하는 Validation Resolver 구성
 */
export default function useCGForm(props: UseCGFormProps) {
  const methods = useForm({
    mode: props.mode,
    defaultValues: props.defaultValues as FieldValues,
    resolver: classValidatorResolver(props.schema),
  });

  const FormControl = () => (
    <>
      <FormProvider {...methods}>
        <form>{props.children}</form>
        <DevTool control={methods.control} />
      </FormProvider>
    </>
  );

  return {
    methods,
    FormControl,
  };
}
