export const SESSION_KEY = "cocktail";

// 공통 처리용 Combo Options
export const UseOptions = [
  { label: "사용", value: "Y" },
  { label: "사용안함", value: "N" },
];
export const AllowOptions = [
  { label: "허용", value: true },
  { label: "허용안함", value: false },
];

// TODO: ccambo, 여기에 서비스 식별을 위한 Identifier를 구성합니다.
export const SERVICE_INDENTIFIER = {
  User: Symbol.for("UserService"),
};
