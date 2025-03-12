import eq from 'lodash/eq';

import { z } from 'zod';

export const getDeleteClusterSchema = (clusterName: string) =>
  z.object({
    clusterName: z
      .string()
      .nonempty()
      .refine((name) => eq(clusterName, name)),
  });

export const createFormSchema = z.object({
  name: z.string().nonempty('이름을 입력해주세요.'),
  cniPlugin: z.enum(['cilium', 'canal', 'none'], { message: 'abc' }),
});
