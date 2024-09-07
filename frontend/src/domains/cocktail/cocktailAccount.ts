import CocktailAccountConfig, {
  DefaultValue as ConfigDefaultValue,
  FieldOptions as ConfigFieldOptions,
} from "./cocktailAccountConfig.ts";

import { UseOptions } from "@lib/constants.ts";
import { CGFieldOption } from "@typedefines/form";

export default class CocktailAccount {
  accountSeq: number;
  accountType: string;
  accountName: string;
  organizationName: string;
  description: string;
  baseLanguage: string;
  accountCode: string;
  userAuthType: string;
  concurrentSessionYn: string;
  accountConfig: CocktailAccountConfig;
}

export const DefaultValue: CocktailAccount = {
  accountSeq: 1,
  accountType: "ENT",
  accountName: "PAAS Platform",
  organizationName: "",
  description: "13d12",
  baseLanguage: "ko",
  accountCode: "MASTER",
  userAuthType: "PLAIN",
  concurrentSessionYn: "Y",
  accountConfig: ConfigDefaultValue,
};
export const FieldOptions: CGFieldOption[] = [
  { name: "accountSeq", label: "계정식별번호", type: "number", hidden: true },
  { name: "accountType", label: "계정 유형", type: "text" },
  { name: "accountName", label: "계정 명", type: "text" },
  { name: "organizationName", label: "조직구성 명", type: "text" },
  { name: "description", label: "설명", type: "text" },
  { name: "baseLanguage", label: "기본 언어", type: "text" },
  { name: "accountCode", label: "계정 코드", type: "text" },
  { name: "userAuthType", label: "사용자 인증 유형", type: "text" },
  {
    name: "concurrentSessionYn",
    label: "동시 세션 여부",
    type: "select",
    options: UseOptions,
  },
  {
    name: "accountConfig",
    label: "계정설정 정보",
    type: "nested",
    fields: ConfigFieldOptions,
  },
];
