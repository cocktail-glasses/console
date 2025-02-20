import { Box, Button, Container, TextField } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  KamajiClastixIoV1alpha1Api as KamajiAPI,
  IoClastixKamajiV1alpha1TenantControlPlane,
  IoClastixKamajiV1alpha1TenantControlPlaneList,
} from "@lib/kamaji";
import { useEffect, useState } from "react";
import _ from "lodash";
import { Link } from "react-router-dom";

export default function KaaSClusterList() {
  interface TenantControlPlaneFields
    extends IoClastixKamajiV1alpha1TenantControlPlane {
    pods: string;
    dataStorage: string;
  }

  const tableFields = (
    cluster: IoClastixKamajiV1alpha1TenantControlPlane,
  ): TenantControlPlaneFields => {
    const deployment = cluster.status?.kubernetesResources?.deployment;
    const availableReplicas = deployment?.availableReplicas || 0;
    const replicas = deployment?.replicas || "-";

    const storage = cluster.status?.storage;
    const dataStoreName = storage?.dataStoreName || "";
    const drivder = storage?.driver || "";

    return {
      ...cluster,
      pods: `${availableReplicas}/${replicas}`,
      dataStorage: `${dataStoreName} (${drivder})`,
    };
  };

  const [tenantControlPlane, setTenantControlPlane] =
    useState<IoClastixKamajiV1alpha1TenantControlPlaneList>();
  useEffect(() => {
    const kamajiAPI = new KamajiAPI(undefined, "http://localhost:4466");
    kamajiAPI
      .listKamajiClastixIoV1alpha1NamespacedTenantControlPlane("tenant-root")
      .then((res) => res.data)
      .then((tcl) => setTenantControlPlane(tcl));
  }, []);

  return (
    <Container>
      <h2>KaaS 클러스터 관리</h2>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "flex-end" }}>
          <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
          <TextField id="input-with-sx" label="With sx" variant="standard" />
        </Box>
        <Button variant="contained">Create Cluster</Button>
      </Box>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Namespace</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Pods</TableCell>
              <TableCell align="right">Endpoints</TableCell>
              <TableCell align="right">Version</TableCell>
              <TableCell align="right">dataStorage (driver)</TableCell>
              <TableCell align="right">Age</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {_.chain(tenantControlPlane?.items)
              .map(tableFields)
              .map((controlPlane, i) => (
                <TableRow
                  key={`row-${controlPlane.metadata?.name || i}`}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Link
                      to={`/kaas/clusters/${controlPlane.metadata?.namespace}/${controlPlane.metadata?.name}`}
                    >
                      {controlPlane?.metadata?.name}
                    </Link>
                  </TableCell>
                  <TableCell align="right" onClick={() => console.log("sdf")}>
                    {controlPlane?.metadata?.namespace}
                  </TableCell>
                  <TableCell align="right">
                    {controlPlane?.status?.kubernetesResources?.version?.status}
                  </TableCell>
                  <TableCell align="right">{controlPlane.pods}</TableCell>
                  <TableCell align="right">
                    {controlPlane.status?.controlPlaneEndpoint}
                  </TableCell>
                  <TableCell align="right">
                    {controlPlane.spec?.kubernetes.version}
                  </TableCell>
                  <TableCell align="right">
                    {controlPlane.dataStorage}
                  </TableCell>
                  <TableCell align="right">
                    {controlPlane.metadata?.creationTimestamp}
                  </TableCell>
                </TableRow>
              ))
              .value()}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
