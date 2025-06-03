import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import Chip from "@mui/material/Chip";
import Link from "@mui/material/Link";

import { MRT_ColumnDef } from "material-react-table";

import BoxBoader from "@components/atoms/Box/BoxBoader";
import { SectionBox, SectionFilterHeader } from "@components/common";
import ActionMenu from "@components/molecules/ActionMenu";
import TableBox from "@components/molecules/TableBox";
import { interfaceUser } from "@domains/user";
import { SERVICE_INDENTIFIER } from "@lib/constants";
import useUIContext from "@lib/hooks/useUIContext";
import { UserService } from "@lib/services";

function List() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [users, setUsers] = useState<interfaceUser[]>([]);

  const { getService } = useUIContext();
  useEffect(() => {
    getService<UserService>(SERVICE_INDENTIFIER.User)
      .getUsers("1")
      .then((data) => setUsers(data))
      .catch((err) => alert(err instanceof Error ? err.message : err));
  }, [getService]);

  const columns = useMemo<MRT_ColumnDef<interfaceUser>[]>(
    () => [
      // const columns = useMemo(() => [
      {
        id: "userName",
        header: t("Name"),
        accessorKey: "userName",
        Cell: ({ renderedCellValue, row }) => (
          <Link
            sx={{ cursor: "pointer" }}
            onClick={() => navigate(`/users/${row.original.userSeq}`)}
          >
            {renderedCellValue}
          </Link>
        ),
      },
      { id: "userId", header: "ID", accessorKey: "userId" },
      {
        id: "role",
        header: "Role",
        accessorKey: "roles",
        Cell: ({ renderedCellValue }) => {
          return <Chip label={renderedCellValue} variant="outlined" />;
        },
      },
      {
        id: "userDepartment",
        header: "Department",
        accessorKey: "userDepartment",
      },
      { id: "lastLogin", header: "Last Login", accessorKey: "lastLogin" },
    ],
    [navigate, t],
  );
  function CreateUser() {
    navigate("/users/create");
  }

  return (
    <SectionBox
      title={
        <SectionFilterHeader
          title={t("Users")}
          noNamespaceFilter
          actions={[
            <ActionMenu menus={[{ name: "Create", onClick: CreateUser }]} />,
          ]}
        />
      }
    >
      <BoxBoader>
        <TableBox
          columns={columns as MRT_ColumnDef<any>[]}
          data={users}
          someEventHandler={(e: any) => console.log("????", e)}
        />
      </BoxBoader>
    </SectionBox>
  );
}

export default List;
