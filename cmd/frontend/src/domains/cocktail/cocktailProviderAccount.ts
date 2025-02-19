import { CGFieldOption } from "@typedefines/form";

export default class CocktailProviderAccount {
  providerCode: string;
  providerCodeName: string;
  providerName: string;
  clusterNames: string[];
  seq: number;
  useType: string;
}

export const DefaultValue: CocktailProviderAccount = {
  providerCode: "OPM",
  providerCodeName: "On-Premise",
  providerName: "gpu-cluster",
  clusterNames: [],
  seq: 1,
  useType: "USER",
};

export const FieldOptions: CGFieldOption[] = [
  { name: "providerCode", label: "공급자 코드", type: "text" },
  { name: "providerCodeName", label: "공급자 코드 명", type: "text" },
  { name: "providerName", label: "공급자 명", type: "text" },
  { name: "clusterNames", label: "클러스터 명칭들", type: "text" },
  { name: "seq", label: "공급자 식별번호", type: "number" },
  { name: "useType", label: "사용 유형", type: "text" },
];
