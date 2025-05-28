import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import { Typography } from "@mui/material";

import { useBoolean } from "../../../hooks/use-boolean";

import { ConfirmDialog } from "../../../components/custom-dialog";

import { ITopicItem } from "../../../types/topic";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// ----------------------------------------------------------------------

type Props = {
  onEditRow: VoidFunction;
  row: ITopicItem;
  onDeleteRow: VoidFunction;
};

export default function QuestionTableRow({
  row,
  onEditRow,
  onDeleteRow,
}: Props) {
  const { name } = row;

  const confirm = useBoolean();

  return (
    <>
      <TableRow hover>
        <TableCell>
          <Tooltip title={name}>
            <Typography
              variant="body1"
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: {
                  xs: 150, // Max width for extra small screens
                  sm: 200, // Max width for small screens
                  md: 250, // Max width for medium screens
                },
              }}
            >
              {name}
            </Typography>
          </Tooltip>
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: "nowrap" }}>
          <Tooltip title="Edit" placement="top" arrow>
            <IconButton
              onClick={() => {
                onEditRow();
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete" placement="top" arrow>
            <IconButton
              onClick={() => {
                confirm.onTrue();
              }}
              sx={{ color: "error.main" }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
