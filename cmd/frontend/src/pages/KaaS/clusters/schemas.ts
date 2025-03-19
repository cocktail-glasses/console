import eq from 'lodash/eq';

import { z, ZodIssueCode } from 'zod';

export const getDeleteClusterSchema = (clusterName: string) =>
  z.object({
    clusterName: z
      .string()
      .nonempty()
      .refine((name) => eq(clusterName, name)),
  });

export const createFormSchema = z.object({
  name: z.string().trim().min(1, '이름을 입력해주세요.'),
  cniPlugin: z.enum(['cilium', 'canal', 'none'], {
    errorMap: (issue, ctx) => {
      if (issue.code === ZodIssueCode.invalid_enum_value) {
        return { message: `잘못된 값입니다. 허용된 값은: ${ctx.data}` };
      }
      return { message: ctx.defaultError };
    },
  }),
  cniPluginVersion: z.string().trim().min(1, '필수 값입니다.'),
  controlPlaneVersion: z.string().trim().min(1, '필수 값입니다.'),
});
