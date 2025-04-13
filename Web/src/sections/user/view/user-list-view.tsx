import isEqual from "lodash/isEqual";
import { useState, useEffect, useCallback } from "react";

import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";
import TableContainer from "@mui/material/TableContainer";

import { paths } from "../../../routes/paths";
import { useNavigate } from "react-router-dom";
import { RouterLink } from "../../../routes/components";

import { useBoolean } from "../../../hooks/use-boolean";

import { useGetUsers, updateOrCreateUser } from "../../../api/user";

import Iconify from "../../../components/iconify";
import Scrollbar from "../../../components/scrollbar";
import { ConfirmDialog } from "../../../components/custom-dialog";
import CustomBreadcrumbs from "../../../components/custom-breadcrumbs";
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from "../../../components/table";

import {
  IUserItem,
  IUserTableFilters,
  IUserTableFilterValue,
} from "../../../types/user";

import UserTableRow from "../user-table-row";
// import UserTableToolbar from "../user-table-toolbar";
import UserTableFiltersResult from "../user-table-filters-result";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "", width: 88 },
  { id: "name", label: "Name" },
  { id: "phoneNumber", label: "Phone Number", width: 180 },
  { id: "address", label: "Address", width: 220 },
  { id: "role", label: "Role", width: 180 },
  { id: "", width: 88 },
];

const defaultFilters: IUserTableFilters = {
  name: "",
  role: [],
  status: "all",
  phoneNumber: "",
  email: "",
};

// ----------------------------------------------------------------------

export default function UserListView() {
  // const { enqueueSnackbar } = useSnackbar();

  const table = useTable({
    defaultFilters,
  });

  const router = useNavigate();

  const confirm = useBoolean();

  // component TABLE
  const [filters, setFilters] = useState(defaultFilters);
  const { users, usersTotal, refetchUsers } = useGetUsers(table.queryState);

  const [tableData, setTableData] = useState<IUserItem[]>(users);
  useEffect(() => {
    setTableData(users);
  }, [users]);

  const denseHeight = table.dense ? 56 : 56 + 20;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!usersTotal && canReset) || !usersTotal;

  const handleFilters = useCallback(
    (name: string, value: IUserTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleDeleteRow = useCallback(
    (id: string) => {
      const afterDeleteRow = tableData.filter((row) => row.id !== id);
      const deleteRow = tableData.filter((row) => row.id === id);
      // Xử lý bất đồng bộ bên ngoài context return
      deleteRow.forEach((e) => {
        updateOrCreateUser(e, true).then(() => {
          // enqueueSnackbar(`Delete ${e.firstName} ${e.lastName} success!`);
        });
      });

      setTableData(afterDeleteRow);

      table.onUpdatePageDeleteRow(tableData.length);
    },
    [table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const afterDeleteRows = tableData.filter(
      async (row) => !table.selected.includes(row.id)
    );
    const deleteRow = tableData.filter((row) =>
      table.selected.includes(row.id)
    );

    deleteRow.forEach((e) => {
      updateOrCreateUser(e, true).then(() => {
        // enqueueSnackbar(`Delete ${e.firstName} ${e.lastName} success!`);
      });
    });

    setTableData(afterDeleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: tableData.length,
      totalRowsFiltered: tableData.length,
    });
  }, [table, tableData]);

  const handleEditRow = useCallback(
    (id: string) => {
      router(paths.dashboard.user.edit(id));
    },
    [router]
  );

  return (
    <>
      <Container>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            { name: "User", href: paths.dashboard.user.root },
            { name: "List" },
          ]}
          action={
            <Button
              component={RouterLink}
              to={paths.dashboard.user.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New User
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          {canReset && (
            <UserTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={usersTotal}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: "relative", overflow: "unset" }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={usersTotal}
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? "small" : "medium"}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={table.selected.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                />

                <TableBody>
                  {tableData.length > 0 &&
                    tableData.map((row) => {
                      return (
                        <UserTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                          onEditRow={() => handleEditRow(row.id)}
                          refetchUsers={refetchUsers}
                        />
                      );
                    })}
                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(
                      table.page,
                      table.rowsPerPage,
                      usersTotal
                    )}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={usersTotal}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete{" "}
            <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}
