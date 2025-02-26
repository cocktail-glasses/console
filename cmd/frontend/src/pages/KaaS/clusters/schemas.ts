import { z } from "zod";
import eq from "lodash/eq";

export const getDeleteClusterSchema = (clusterName: string) =>
  z.object({
    clusterName: z
      .string()
      .nonempty()
      .refine((name) => eq(clusterName, name)),
  });
