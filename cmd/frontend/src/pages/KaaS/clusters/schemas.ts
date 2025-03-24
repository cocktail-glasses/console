import eq from 'lodash/eq';

import { z, ZodIssueCode } from 'zod';

export const getDeleteClusterSchema = (clusterName: string) =>
  z.object({
    clusterName: z
      .string()
      .nonempty()
      .refine((name) => eq(clusterName, name)),
  });

export enum CNIPlugins {
  CILIUM = 'cilium',
  CANAL = 'canal',
  NONE = 'none',
}

export interface Label {
  key: string;
  value: string;
}

export interface createFormValue {
  name: string;
  cniPlugin?: string;
  cniPluginVersion?: string;
  sshKeys?: string[];
  controlPlaneVersion?: string;
  containerRuntime: string;
  admissionPlugins?: string[];
  auditLoggin?: boolean;
  disableCSIDriver?: boolean;
  kubernetesDashboard?: boolean;
  opaIntegration?: boolean;
  userClusterLogging?: boolean;
  userClusterMonitoring?: boolean;
  userSSHKeyAgent?: boolean;
  labels?: Label[];
}

export const createFormSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.'),
  cniPlugin: z.nativeEnum(CNIPlugins, {
    errorMap: (issue, ctx) => {
      if (issue.code === ZodIssueCode.invalid_enum_value) {
        return { message: `잘못된 값입니다. 허용된 값은: ${ctx.data}` };
      }
      return { message: ctx.defaultError };
    },
  }),
  cniPluginVersion: z.string({ required_error: '필수 값입니다.' }),
  sshKeys: z.array(z.string()).optional(),
  controlPlaneVersion: z.string({ required_error: '필수 값입니다.' }),
  containerRuntime: z.string({ required_error: '필수 값입니다.' }),
  admissionPlugins: z.array(z.string()).optional(),
  auditLoggin: z.boolean().optional(),
  disableCSIDriver: z.boolean().optional(),
  kubernetesDashboard: z.boolean().optional(),
  opaIntegration: z.boolean().optional(),
  userClusterLogging: z.boolean().optional(),
  userClusterMonitoring: z.boolean().optional(),
  userSSHKeyAgent: z.boolean().optional(),
  labels: z
    .array(
      z.object({
        key: z.string().optional(),
        value: z.string().optional(),
      })
    )
    .optional(),
});

export interface settingsFormValue {
  providerPreset: string;
  domain: string;
  credentialType: string;
  userName?: string;
  password?: string;
  project?: string;
  projectID?: string;
  floatingIP?: string;
  securityGroup?: string;
  network?: string;
  subnetId?: string;
}

export const settingsFormSchema = z.object({
  providerPreset: z.string().min(1, '필수 값입니다.'),
});

export const setttingFromSchema = z.object({});

export interface staticNodesFormValue {}

export interface applicationsFormValue {}
