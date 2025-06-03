import CocktailAccount, {
  DefaultValue as AccountDefaultValue,
  FieldOptions as AccountFieldOptions,
} from "./cocktailAccount";
import CocktailCluster, {
  DefaultValue as ClusterDefaultValue,
  FieldOptions as ClusterFieldOptions,
} from "./cocktailCluster";

import { AllowOptions, UseOptions } from "@lib/constants";
import { CGFieldOption } from "@typedefines/form";
import { ValidatableEntity } from "@typedefines/index";

export default class CocktailUser implements ValidatableEntity {
  useYn: string;
  userSeq: number;
  userId: string;
  userName: string;
  userLanguage: string;
  userTimezone: string;
  lastLogin: Date;
  activeDatetime: Date;
  sleepYn: string;
  roles: string[];
  userGrant: string;
  serviceMode: string;
  initPasswordYn: string;
  resetPasswordYn: string;
  inactiveYn: string;
  loginFailCount: number;
  passwordChangeRequired: false;
  passwordPeriodExpired: true;
  otpUseYn: string;
  account: CocktailAccount;
  accountUnpaid: boolean;
  shellRoles: string[];
  kubeconfigRoles: string[];
  clusters: CocktailCluster[];
  applicationLogin: boolean;
  public customValidation = async () => {};
}

export const DefaultValue: CocktailUser = {
  useYn: "Y",
  userSeq: 10,
  userId: "ckc6086",
  userName: "최태영 - 사용자",
  userLanguage: "ko",
  userTimezone: "Asia/Seoul",
  lastLogin: new Date(2023, 11, 18, 10, 54, 46),
  activeDatetime: new Date(2023, 11, 18, 10, 54, 46),
  sleepYn: "Y",
  roles: ["DEVOPS"],
  userGrant: "MANAGER",
  serviceMode: "PRD",
  initPasswordYn: "N",
  resetPasswordYn: "N",
  inactiveYn: "N",
  loginFailCount: 0,
  passwordChangeRequired: false,
  passwordPeriodExpired: true,
  otpUseYn: "N",
  account: AccountDefaultValue,
  accountUnpaid: false,
  shellRoles: [],
  kubeconfigRoles: [],
  clusters: [ClusterDefaultValue],
  applicationLogin: false,
  customValidation: async () => {},
};
export const FieldOptions: CGFieldOption[] = [
  { name: "useYn", label: "사용 여부", type: "select", options: UseOptions },
  { name: "userSeq", label: "사용자 식별번호", type: "text", hidden: true },
  { name: "userId", label: "사용자 아이디", type: "text" },
  { name: "userName", label: "사용자 명", type: "text" },
  { name: "userLanguage", label: "언어", type: "text" },
  { name: "userTimezone", label: "타임존", type: "text" },
  { name: "lastLogin", label: "최종 로그인 시각", type: "date" },
  { name: "activeDatetime", label: "활성화 시각", type: "date" },
  { name: "sleepYn", label: "휴면 여부", type: "select", options: UseOptions },
  // TODO: ccambo, 문자열/숫자 등에서 Array인 경우는 처리는? select 사용?
  { name: "roles", label: "역할", type: "text", isArray: true },
  { name: "userGrant", label: "사용자 등급", type: "text" },
  { name: "serviceMode", label: "서비스 모드", type: "text" },
  {
    name: "initPasswordYn",
    label: "비밀번호 초기화 여부",
    type: "select",
    options: UseOptions,
  },
  {
    name: "resetPasswordYn",
    label: "비밀번호 리셑여부",
    type: "select",
    options: UseOptions,
  },
  {
    name: "inactiveYn",
    label: "비활성화 여부",
    type: "select",
    options: UseOptions,
  },
  { name: "loginFailCount", label: "로그인 실패 횟수", type: "number" },
  {
    name: "passwordChangeRequired",
    label: "비밀번호 갱신 요청여부",
    type: "select",
    options: AllowOptions,
  },
  {
    name: "passwordPeriodExpired",
    label: "비밀번호 만료여부",
    type: "select",
    options: AllowOptions,
  },
  {
    name: "otpUseYn",
    label: "OTP 사용 여부",
    type: "select",
    options: UseOptions,
  },
  {
    name: "account",
    label: "계정 정보",
    type: "nested",
    fields: AccountFieldOptions,
  },
  {
    name: "accountUnpaid",
    label: "계정 미지불",
    type: "select",
    options: AllowOptions,
  },
  { name: "shellRoles", label: "shell 역할들", type: "text", isArray: true },
  {
    name: "kubeconfigRoles",
    label: "Kubeconfig 역할들",
    type: "text",
    isArray: true,
  },
  {
    name: "clusters",
    label: "클러스터 정보",
    type: "nested",
    fields: ClusterFieldOptions,
    isArray: true,
  },
  {
    name: "applicationLogin",
    label: "어플리케이션 로그인 여부",
    type: "select",
    options: AllowOptions,
  },
];

/*
  {
      "useYn": "Y",
      "userSeq": 10,
      "userId": "ckc6086",
      "userName": "최태영 - 사용자",
      "userLanguage": "ko",
      "userTimezone": "Asia/Seoul",
      "lastLogin": "2023-12-18 10:54:46",
      "activeDatetime": "2023-12-18 10:54:46",
      "sleepYn": "Y",
      "roles": [
          "DEVOPS"
      ],
      "userGrant": "MANAGER",
      "serviceMode": "PRD",
      "initPasswordYn": "N",
      "resetPasswordYn": "N",
      "inactiveYn": "N",
      "loginFailCount": 0,
      "passwordChangeRequired": false,
      "passwordPeriodExpired": true,
      "otpUseYn": "N",
      "account": {
          "accountSeq": 1,
          "accountType": "ENT",
          "accountName": "PAAS Platform",
          "organizationName": "",
          "description": "13d12",
          "baseLanguage": "ko",
          "accountCode": "MASTER",
          "userAuthType": "PLAIN",
          "concurrentSessionYn": "Y",
          "accountConfig": {
              "internalBuildServerUseYn": "Y",
              "clusterRegUseYn": "Y"
          }
      },
      "accountUnpaid": false,
      "shellRoles": [],
      "kubeconfigRoles": [],
      "clusters": [
          {
              "useYn": "Y",
              "clusterSeq": 1,
              "providerAccountSeq": 1,
              "providerAccount": {
                  "providerCode": "OPM",
                  "providerCodeName": "On-Premise",
                  "providerName": "gpu-cluster",
                  "clusterNames": [],
                  "seq": 1,
                  "useType": "USER"
              },
              "clusterType": "CUBE",
              "clusterName": "Blue Dragon",
              "regionCode": "Default",
              "clusterId": "gpu-cluster",
              "clusterState": "RUNNING",
              "cubeType": "MANAGED",
              "authType": "CERT",
              "k8sVersion": "1.25.11",
              "servicemaps": [
                  {
                      "servicemapSeq": 88,
                      "workloadGroups": [
                          {
                              "useYn": "Y",
                              "workloadGroupSeq": 106,
                              "servicemapSeq": 88,
                              "workloadGroupName": "WEB",
                              "columnCount": 1,
                              "sortOrder": 1
                          },
                          {
                              "useYn": "Y",
                              "workloadGroupSeq": 107,
                              "servicemapSeq": 88,
                              "workloadGroupName": "WAS",
                              "columnCount": 1,
                              "sortOrder": 2
                          },
                          {
                              "useYn": "Y",
                              "workloadGroupSeq": 108,
                              "servicemapSeq": 88,
                              "workloadGroupName": "DB",
                              "columnCount": 1,
                              "sortOrder": 3
                          }
                      ],
                      "servicemapMappings": []
                  },
                  {
                      "servicemapSeq": 10,
                      "workloadGroups": [
                          {
                              "useYn": "Y",
                              "workloadGroupSeq": 13,
                              "servicemapSeq": 10,
                              "workloadGroupName": "Jaeger",
                              "columnCount": 2,
                              "sortOrder": 1
                          }
                      ],
                      "servicemapMappings": []
                  }
              ],
              "supportVolumePlugIns": [
                  {
                      "plugin": {
                          "groupId": "VOLUME_PLUGIN",
                          "code": "NFS_CSI",
                          "value": "nfsDynamicVolume",
                          "description": "NFS CSI"
                      },
                      "bindingMode": [],
                      "addMountOptionEnabled": true,
                      "storageType": "NETWORK",
                      "params": [],
                      "addParamEnabled": true
                  }
              ]
          }
      ],
      "applicationLogin": false
  }
  */
