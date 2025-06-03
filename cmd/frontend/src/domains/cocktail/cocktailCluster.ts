import CocktailProviderAccount, {
  DefaultValue as ProviderDefaultValue,
  FieldOptions as ProviderFieldOptions,
} from "./cocktailProviderAccount";
import CocktailServiceMap, {
  DefaultValue as ServiceMapDefaultValue,
  FieldOptions as ServiceMapFieldOptions,
} from "./cocktailServiceMap";
import CocktailSupportVolumePlugin, {
  DefaultValue as PluginDefaultValue,
  FeildOptions as PluginFieldOptions,
} from "./cocktailSupportVolumePlugin";

import { UseOptions } from "@lib/constants";
import { CGFieldOption } from "@typedefines/form";

export default class CocktailCluster {
  useYn: string;
  clusterSeq: number;
  providerAccountSeq: number;
  providerAccount: CocktailProviderAccount;
  clusterType: string;
  clusterName: string;
  regionCode: string;
  clusterId: string;
  clusterState: string;
  cubeType: string;
  authType: string;
  k8sVersion: string;
  servicemaps: CocktailServiceMap[];
  supportVolumePlugIns: CocktailSupportVolumePlugin[];
}

export const DefaultValue: CocktailCluster = {
  useYn: "Y",
  clusterSeq: 1,
  providerAccountSeq: 1,
  providerAccount: ProviderDefaultValue,
  clusterType: "CUBE",
  clusterName: "Blue Dragon",
  regionCode: "Default",
  clusterId: "gpu-cluster",
  clusterState: "RUNNING",
  cubeType: "MANAGED",
  authType: "CERT",
  k8sVersion: "1.25.11",
  servicemaps: [
    ServiceMapDefaultValue,
    {
      servicemapSeq: 10,
      workloadGroups: [
        {
          useYn: "Y",
          workloadGroupSeq: 13,
          servicemapSeq: 10,
          workloadGroupName: "Jaeger",
          columnCount: 2,
          sortOrder: 1,
        },
      ],
      servicemapMappings: [],
    },
  ],
  supportVolumePlugIns: [PluginDefaultValue],
};
export const FieldOptions: CGFieldOption[] = [
  { name: "useYn", label: "사용 여부", type: "select", options: UseOptions },
  {
    name: "clusterSeq",
    label: "클러스터 식별번호",
    type: "number",
    hidden: true,
  },
  {
    name: "providerAccountSeq",
    label: "프로바이더 식별번호",
    type: "number",
    hidden: true,
  },
  {
    name: "providerAccount",
    label: "프로바이더 계정",
    type: "nested",
    fields: ProviderFieldOptions,
  },
  { name: "clusterType", label: "클러스터 유형", type: "text" },
  { name: "clusterName", label: "클러스터 명", type: "text" },
  { name: "regionCode", label: "리전 코드", type: "text" },
  { name: "clusterId", label: "클러스터 아이디", type: "text" },
  { name: "clusterState", label: "클러스터 상태", type: "text" },
  { name: "cubeType", label: "큐브 유형", type: "text" },
  { name: "authType", label: "인증 유형", type: "text" },
  { name: "k8sVersion", label: "K8S 버전", type: "text" },
  {
    name: "servicemaps",
    label: "서비스맵 정보",
    type: "nested",
    fields: ServiceMapFieldOptions,
    isArray: true,
  },
  {
    name: "supportVolumePlugIns",
    label: "지원되는 볼룸 플러그인 정보",
    type: "nested",
    fields: PluginFieldOptions,
    isArray: true,
  },
];
