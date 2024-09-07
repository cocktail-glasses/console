import { CGFieldOption } from "@typedefines/form";

export default class CocktailVolumnPlugin {
  groupId: string;
  code: string;
  value: string;
  description: string;
}

export const DefaultValue: CocktailVolumnPlugin = {
  groupId: "VOLUME_PLUGIN",
  code: "NFS_CSI",
  value: "nfsDynamicVolume",
  description: "NFS CSI",
};
export const FieldOptions: CGFieldOption[] = [
  { name: "groupId", label: "그룹 아이디", type: "text" },
  { name: "code", label: "플러그인 코드", type: "text" },
  { name: "value", label: "프러그인 값", type: "text" },
  { name: "description", label: "설명", type: "text" },
];
