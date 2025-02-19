import { OptionValue } from "@typedefines/form/index";
import dayjs from "dayjs";
import { injectable } from "inversify";
import { FieldValues } from "react-hook-form";

// @ts-expect-error 'infer f'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type StartsWith<T, b extends string> = T extends `${b}${infer f}`
  ? T
  : never;

export const lazyExportLoader = async (path: string, componentName: string) => {
  const module = await import(path);
  return { default: module[componentName] };
};

export const setNestedValue = (obj: any, path: string, value: any) => {
  const keys = path.split(",");
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key]) {
      current[key] = {};
    }
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
};

export const getNestedValue = (obj: any, path: string) => {
  const keys = path.split(".");
  let current = obj;
  for (const key of keys) {
    if (!current[key]) {
      return undefined;
    }
    current = current[key];
  }
  return current;
};

@injectable()
export default class UtilClass {
  /*===================================================
   ** 문자열 처리 관련
   *===================================================*/

  /**
   * 문자열이 특정 문자열로 시작하는지 검증
   * @param str 검증 문자열
   * @param prefix 검증 대상 시작 문자열
   * @returns str이 prefix로 시작하면 true
   */
  startsWith<T extends string, b extends string>(
    str: T,
    prefix: b,
  ): str is StartsWith<T, b> {
    return str.startsWith(prefix);
  }

  /**
   * 지장한 문자열을 패턴 식별자로 분리해서 가장 마지막을 제외한 prefix를 반환
   * (예, 1.2.3 -> 1.2)
   * @param str 대상 문자열
   * @param delimiter 패턴 식별자
   */
  removeLastPath(str: string, delimiter: string): string {
    return str.split(delimiter).slice(0, -1).join(delimiter);
  }

  getLastPath(str: string, delimiter: string): string {
    const paths = str.split(delimiter);
    if (paths.length <= 1) {
      return paths[0];
    } else {
      return paths[paths.length - 1];
    }
  }

  /*===================================================
   ** 객체 관련
   *===================================================*/

  getNestedValue(obj: FieldValues, path: string, defaultValue: any): any {
    const keys = path.split(".");
    let current = obj;
    for (const key of keys) {
      if (!current[key]) {
        return defaultValue;
      }
      current = current[key];
    }
    return current;
  }

  getStringData(
    value: any,
    options?: OptionValue<any>[],
    isArray?: boolean,
  ): string {
    let val = "";
    if (options) {
      if (isArray) {
        val = options
          .filter((opt) => value.includes(opt.value))
          .map((opt) => opt.label)
          .join(", ");
        if (val === "") val = value;
      } else {
        val = options
          .filter((opt) => opt.value === value)
          .map((opt) => opt.label)
          .join(", ");
        if (val === "") val = value;
      }
    } else {
      if (value instanceof Date) {
        // TODO: Date format 상수처리
        val = dayjs(value).format("YYYY/MM/DD");
      } else {
        val = value;
      }
    }
    console.log(
      `getStringData >> ${value}, ${JSON.stringify(options)}, ${isArray} == ${val}`,
    );
    return val;
  }

  getValueByPath(obj: FieldValues, path: string, defaultValue: any): any {
    const keys = path.split(".");
    let result: any = obj;

    for (const key of keys) {
      if (result === defaultValue) break;

      // Handle array indices
      if (key.includes("[")) {
        const [baseKey, index] = key.split(/[[\]]/).filter(Boolean);
        result = result[baseKey];
        if (Array.isArray(result)) {
          result = result[parseInt(index, 10)];
        } else {
          return defaultValue;
        }
      } else {
        result = result[key];
      }
    }

    return result;
  }

  getFieldPath(fieldName: string, parentName?: string, index: number = -1) {
    let path = fieldName;
    if (parentName) {
      if (index > -1) {
        path = `${parentName}.${index}.${fieldName}`;
      } else {
        // case: 중첩 객체인 경우
        path = `${parentName}.${fieldName}`;
      }
    }
    return path;
  }
}
