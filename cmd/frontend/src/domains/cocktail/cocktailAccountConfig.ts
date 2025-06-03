import { UseOptions } from "@lib/constants";
import { CGFieldOption } from "@typedefines/form";

export default class CocktailAccountConfig {
  internalBuildServerUseYn: string;
  clusterRegUseYn: string;
}

export const DefaultValue: CocktailAccountConfig = {
  internalBuildServerUseYn: "Y",
  clusterRegUseYn: "Y",
};

export const FieldOptions: CGFieldOption[] = [
  {
    name: "internalBuildServerUseYn",
    label: "내부 빌드서버 사용여부",
    type: "select",
    options: UseOptions,
  },
  {
    name: "clusterRegUseYn",
    label: "클러스터 레지스트리 사용여부",
    type: "select",
    options: UseOptions,
  },
];
