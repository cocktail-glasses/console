import { AnyFunction } from "@typedefines/index.ts";
import { useInsertionEffect, useRef } from "react";

/**
 * 렌더링 도중에 콜백이 호출되면 오류 발생
 */
function useEvent_shouldNotBeInvokedBeforeMount() {
  throw new Error(
    "INVALID_USEEVENT_INIVOCATION: the callback from useEvent cannot be invoked before the component has mounted."
  );
}

/**
 * useCallback과 거의 동일하지만, 아래와 같은 부분이 다르다.
 * - 반환된 함수는 안정적인 참조이며, 렌더링들에서 항상 동일해야 한다.
 * - 의존성이 요구되지 않는다.
 * - 콜백에서 항상 현재의 속성이나 상태에 접근한다.
 * @param callback
 */
export default function useEvent<TCallback extends AnyFunction>(
  callback: TCallback
): TCallback {
  // 마지막 콜백 추적
  const latestRef = useRef<TCallback>(
    useEvent_shouldNotBeInvokedBeforeMount as any
  );
  useInsertionEffect(() => {
    latestRef.current = callback;
  }, [callback]);

  // 최종 콜백을 호출할 수 있도록 안정된 콜백 생성
  // useCallback 대신 useRef를 이용해서 렌더링마다 빈 배열이 생성되는 것을 방지한다.
  const stableRef = useRef<TCallback>(null as any);
  if (!stableRef.current) {
    stableRef.current = function (this: any) {
      // eslint-disable-next-line prefer-rest-params
      return latestRef.current.apply(this, arguments as any);
    } as TCallback;
  }

  return stableRef.current;
}
