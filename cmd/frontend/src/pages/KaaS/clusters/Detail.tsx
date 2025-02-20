import {
  IoClastixKamajiV1alpha1TenantControlPlane,
  KamajiClastixIoV1alpha1Api as KamajiAPI,
} from "@lib/kamaji";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function Detail() {
  const { managementNamespace, name } = useParams<{
    managementNamespace: string;
    name: string;
  }>();

  const [tenantControlPlane, setTenantControlPlane] =
    useState<IoClastixKamajiV1alpha1TenantControlPlane>();
  useEffect(() => {
    if (isEmpty(name) || isEmpty(managementNamespace)) return;

    const kamajiAPI = new KamajiAPI(undefined, "http://localhost:4466");
    kamajiAPI
      .readKamajiClastixIoV1alpha1NamespacedTenantControlPlane(
        name!,
        managementNamespace!,
      )
      .then((res) => res.data)
      .then((res) => setTenantControlPlane(res));
  }, []);
  return <div>{JSON.stringify(tenantControlPlane)}</div>;
}
