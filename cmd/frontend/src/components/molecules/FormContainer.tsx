import { FormEventHandler, FormHTMLAttributes } from 'react';
import {
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  UseFormProps,
  UseFormReturn,
  FieldValues,
} from 'react-hook-form';

export type FormContainerProps<T extends FieldValues = FieldValues> = React.PropsWithChildren<
  UseFormProps<T> & {
    onSuccess?: SubmitHandler<T>;
    onError?: SubmitErrorHandler<T>;
    FormProps?: FormHTMLAttributes<HTMLFormElement>;
    handleSubmit?: FormEventHandler<HTMLFormElement>;
    formContext?: UseFormReturn<T>;
  }
>;

export default function FormContainer<TFieldValues extends FieldValues = FieldValues>({
  handleSubmit,
  children,
  FormProps,
  formContext,
  onSuccess,
  onError,
  ...useFormProps
}: React.PropsWithChildren<FormContainerProps<TFieldValues>>) {
  if (!formContext) {
    return (
      <FormProviderWithoutContext<TFieldValues> {...{ onSuccess, onError, FormProps, children, ...useFormProps }} />
    );
  }
  if (typeof onSuccess === 'function' && typeof handleSubmit === 'function') {
    console.warn('Property `onSuccess` will be ignored because handleSubmit is provided');
  }
  return (
    <FormProvider {...formContext}>
      <form
        noValidate
        {...FormProps}
        onSubmit={
          handleSubmit
            ? handleSubmit
            : onSuccess
              ? formContext.handleSubmit(onSuccess, onError)
              : () => console.log('submit handler `onSuccess` is missing')
        }
      >
        {children}
      </form>
    </FormProvider>
  );
}

function FormProviderWithoutContext<TFieldValues extends FieldValues = FieldValues>({
  onSuccess,
  onError,
  FormProps,
  children,
  ...useFormProps
}: React.PropsWithChildren<FormContainerProps<TFieldValues>>) {
  const methods = useForm<TFieldValues>({
    ...useFormProps,
  });
  const { handleSubmit } = methods;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(
          onSuccess ? onSuccess : () => console.log('submit handler `onSuccess` is missing'),
          onError
        )}
        noValidate
        {...FormProps}
      >
        {children}
      </form>
    </FormProvider>
  );
}
