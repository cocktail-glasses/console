import { useCallback } from "react";

import UtilClass from "@utils/index";
import diContainer from "src/config/inversify.config";

/**
 * UI 전역으로 사용하기 위한 Hook
 * @returns UI에서 사용할 전역 변수/함수 등을 반환합니다.
 */
export default function useUIContext() {
  const Utils = diContainer.get<UtilClass>(UtilClass);
  /**
   * IoC로 구성된 서비스 인스턴스를 반환합니다.
   */
  const getService = useCallback(<T>(serviceId: symbol): T => {
    return diContainer.get<T>(serviceId);
  }, []);

  return {
    getService,
    Utils,
  };
}
