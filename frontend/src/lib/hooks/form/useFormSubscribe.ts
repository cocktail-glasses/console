/* eslint-disable @typescript-eslint/ban-ts-comment */

/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useEffect, useMemo } from "react";
import {
  Control,
  EventType,
  FieldPath,
  FieldPathValue,
  FieldPathValues,
  FieldValues,
  InternalFieldName,
} from "react-hook-form";

import useUIContext from "../useUIContext.ts";
import useEvent from "./useEvent.ts";

import { StartsWith } from "@utils/index.ts";

/**
 * react-hook-form에 구독하기 위한 설정 형식들 (multi / single)
 */
export type SubscribeHook<TFieldValues extends FieldValues = FieldValues> = {
  // Multi
  <
    TFieldNames extends readonly FieldPath<TFieldValues>[],
    TCallback extends (
      fieldName: StartsWith<FieldPath<TFieldValues>, TFieldNames[number]>,
      fieldValue: FieldPathValues<TFieldValues, TFieldNames>,
      type: EventType,
      allValues: FieldValues,
    ) => void,
  >(
    names: readonly [...TFieldNames],
    callback: TCallback,
  ): void;

  // Single
  <
    TFieldName extends FieldPath<TFieldValues>,
    TCallback extends (
      fieldName: StartsWith<FieldPath<TFieldValues>, TFieldName>,
      fieldValue: FieldPathValue<TFieldValues, TFieldName>,
      type: EventType,
      allValues: FieldValues,
    ) => void,
  >(
    name: TFieldName,
    callback: TCallback,
  ): void;
};

/**
 * react-hook-form에 구독 등록 (대상 필드(들) 및 콜백)
 * @returns react-hook-form의 Control이 설정된 등록 함수
 */
export default function useFormSubscribe<
  TFieldValues extends FieldValues = FieldValues,
>(control: Control<TFieldValues>) {
  return useCallback(
    <
      TFieldNames extends readonly FieldPath<TFieldValues>[],
      TFieldName extends FieldPath<TFieldValues>,
      TCallback extends (
        fieldName:
          | StartsWith<FieldPath<TFieldValues>, TFieldName>
          | StartsWith<FieldPath<TFieldValues>, TFieldNames[number]>,
        fieldValue:
          | FieldPathValue<TFieldValues, TFieldName>
          | FieldPathValues<TFieldValues, TFieldNames>,
        type: EventType,
        allValues: FieldValues,
      ) => void,
    >(
      name: TFieldName | readonly [...TFieldNames],
      callback: TCallback,
    ) => {
      const utils = useUIContext().Utils;
      const fn = useEvent(callback);

      const shouldSend = useMemo<(eventName: string) => boolean>(
        () => {
          if (name instanceof Array) {
            return (eventName) =>
              name.some((n) => utils.startsWith(eventName, n));
          }
          return (eventName) => utils.startsWith(eventName, name);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        name instanceof Array ? name : [name],
      );

      useEffect(() => {
        // 기존의 'watch'가 'values' 로 이름이 변경되었다.https://github.com/react-hook-form/react-hook-form/commit/a8fb1a1ca7e9ab98545aaf1040a36f9c043cc69c
        // 이전 버전을 지원하기 위해서는 이전의 이름을 사용해야 한다.
        const subject =
          control._subjects.values ??
          // @ts-expect-error
          (control._subjects.watch as typeof control._subjects.values);

        // 정리함수 반환. (Unmount될 떄 unsubssribe 호출)
        return subject.subscribe({
          next: (payload) => {
            if (payload.name && shouldSend(payload.name)) {
              // call callback
              fn(
                payload.name as
                  | StartsWith<FieldPath<TFieldValues>, TFieldName>
                  | StartsWith<FieldPath<TFieldValues>, TFieldNames[number]>,
                control._getWatch(name as InternalFieldName),
                payload.type as EventType,
                payload.values,
              );
            }
          },
        }).unsubscribe;
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [control, fn, ...(name instanceof Array ? name : [name]), shouldSend]);
    },
    [control],
  );
}
