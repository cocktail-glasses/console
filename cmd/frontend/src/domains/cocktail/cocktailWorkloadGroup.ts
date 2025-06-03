import { UseOptions } from "@lib/constants";
import { CGFieldOption } from "@typedefines/form";

export default class CocktailWorkloadGroup {
  useYn: string;
  workloadGroupSeq: number;
  servicemapSeq: number;
  workloadGroupName: string;
  columnCount: number;
  sortOrder: number;
}

export const DefaultValue: CocktailWorkloadGroup = {
  useYn: "Y",
  workloadGroupSeq: 106,
  servicemapSeq: 88,
  workloadGroupName: "WEB",
  columnCount: 1,
  sortOrder: 1,
};
export const FieldOptions: CGFieldOption[] = [
  { name: "useYn", label: "사용 여부", type: "select", options: UseOptions },
  { name: "workloadGroupSeq", label: "워크로드 그룹 식별번호", type: "number" },
  { name: "servicemapSeq", label: "서비스맵 식별번호", type: "number" },
  { name: "workloadGroupName", label: "워크로드 그룹명", type: "text" },
  { name: "columnCount", label: "컬럼 수", type: "number" },
  { name: "sortOrder", label: "정렬 순서", type: "number" },
];
