import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  alpha,
  type Theme,
} from "@mui/material";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  content: string;
  confirmButtonText: string;
  confirmButtonColor: "error" | "warning" | "primary" | "success";
  theme: Theme;
}

export default function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title,
  content,
  confirmButtonText,
  confirmButtonColor,
  theme,
}: ConfirmationDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        },
      }}
    >
      <DialogTitle
        id="confirmation-dialog-title"
        sx={{
          bgcolor: alpha(theme.palette[confirmButtonColor].main, 0.1),
          color: theme.palette[confirmButtonColor].dark,
          fontWeight: "bold",
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <DialogContentText id="confirmation-dialog-description">
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          color="primary"
          sx={{
            borderRadius: 2,
            px: 3,
          }}
        >
          Hủy
        </Button>
        <Button
          onClick={onConfirm}
          color={confirmButtonColor}
          variant="contained"
          sx={{
            borderRadius: 2,
            px: 3,
            background: `linear-gradient(45deg, ${theme.palette[confirmButtonColor].main}, ${theme.palette[confirmButtonColor].light})`,
            boxShadow: `0 4px 10px ${alpha(
              theme.palette[confirmButtonColor].main,
              0.4
            )}`,
            transition: "all 0.2s ease",
            "&:hover": {
              boxShadow: `0 6px 15px ${alpha(
                theme.palette[confirmButtonColor].main,
                0.5
              )}`,
            },
          }}
        >
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
