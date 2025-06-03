import { FormEvent, FormEventHandler, forwardRef, MouseEvent, Ref, RefAttributes, useState } from 'react';
import {
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  UseFormProps,
  UseFormReturn,
  FieldValues,
  UseFormRegister,
} from 'react-hook-form';

import Stack from '@mui/material/Stack';

import { Button, InputPassword, InputText } from '@components/atoms';
import InputSelect from '@components/atoms/Input/InputSelect';

type FormBoxProps = {
  fields: FormField[];
  defaultValues: any;
  onSubmit: SubmitHandler<FieldValues>;
};

type FormField = {
  type: string;
  name: string;
  label: string;
  [prop: string]: any;
};

function setField(f: FormField, register: UseFormRegister<FieldValues>) {
  switch (f.type) {
    case 'text':
      return <InputText label={f.label} {...register(f.name)} key={f.name} />;
    case 'password':
      return <InputPassword label={f.label} {...register(f.name)} key={f.name} />;
    case 'select':
      return <InputSelect label={f.label} {...register(f.name)} options={f.options} key={f.name} />;

    default:
      break;
  }
}

function FormBox(props: FormBoxProps, ref: Ref<HTMLFormElement>) {
  const { fields, onSubmit, defaultValues } = props;
  const methods = useForm({ defaultValues });

  return (
    <form ref={ref} onSubmit={methods.handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2}>
        {fields.map((f) => setField(f, methods.register))}
        <button type="submit" style={{ width: '100px' }}>
          Submit
        </button>
      </Stack>
    </form>
  );
}

export default forwardRef(FormBox);
