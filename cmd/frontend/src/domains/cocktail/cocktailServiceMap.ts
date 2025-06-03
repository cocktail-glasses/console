import CocktailWorkloadGroup, {
  DefaultValue as GroupDefaultValue,
  FieldOptions as GroupFieldOptions,
} from "./cocktailWorkloadGroup";

import { CGFieldOption } from "@typedefines/form";

export default class CocktailServiceMap {
  servicemapSeq: number;
  workloadGroups: CocktailWorkloadGroup[];
  servicemapMappings: string[];
}

export const DefaultValue: CocktailServiceMap = {
  servicemapSeq: 88,
  workloadGroups: [
    GroupDefaultValue,
    {
      useYn: "Y",
      workloadGroupSeq: 107,
      servicemapSeq: 88,
      workloadGroupName: "WAS",
      columnCount: 1,
      sortOrder: 2,
    },
    {
      useYn: "Y",
      workloadGroupSeq: 108,
      servicemapSeq: 88,
      workloadGroupName: "DB",
      columnCount: 1,
      sortOrder: 3,
    },
  ],
  servicemapMappings: [],
};
export const FieldOptions: CGFieldOption[] = [
  {
    name: "servicemapSeq",
    label: "서비스맵 식별번호",
    type: "number",
    hidden: true,
  },
  {
    name: "workloadGroups",
    label: "워크로드 그룹 정보",
    type: "nested",
    fields: GroupFieldOptions,
    isArray: true,
  },
  {
    name: "servicemapMappings",
    label: "서비스맵 매핑",
    type: "number",
    isArray: true,
  },
];
