import CocktailVolumnPlugin, {
  DefaultValue as PluginDefaultValue,
  FieldOptions as PluginFieldOptions,
} from "./cocktailVolumnPlugin";

import { CGFieldOption } from "@typedefines/form";

export default class CocktailSupportVolumePlugin {
  plugin: CocktailVolumnPlugin;
  bindingMode: string[];
  addMountOptionEnabled: boolean;
  storageType: string;
  params: string[];
  addParamEnabled: boolean;
}

export const DefaultValue: CocktailSupportVolumePlugin = {
  plugin: PluginDefaultValue,
  bindingMode: [],
  addMountOptionEnabled: true,
  storageType: "NETWORK",
  params: [],
  addParamEnabled: true,
};
export const FeildOptions: CGFieldOption[] = [
  {
    name: "plugin",
    label: "볼륨 플러그인",
    type: "nested",
    fields: PluginFieldOptions,
  },
  { name: "bindingMode", label: "바인딩 모드", type: "text", isArray: true },
  {
    name: "addMountOptionEnabled",
    label: "마운트 옵션 추가 활성화",
    type: "checkbox",
  },
  { name: "storageType", label: "스토리지 유형", type: "text" },
  { name: "params", label: "파라미터", type: "text", isArray: true },
  { name: "addParamEnabled", label: "파라미터 추가 활성화", type: "checkbox" },
];
