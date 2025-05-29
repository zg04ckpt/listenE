import { Snackbar, Alert } from "@mui/material";
import { useState } from "react";

type SnackbarProps = {
  message: string;
  severity?: "success" | "info" | "warning" | "error";
  duration?: number;
};

export default function useSnackbar() {
  const [open, setOpen] = useState(false);
  const [snackbarProps, setSnackbarProps] = useState<SnackbarProps>({
    message: "",
    severity: "success",
    duration: 3000,
  });

  const showSnackbar = (
    message: string,
    severity: SnackbarProps["severity"] = "success",
    duration = 3000
  ) => {
    setSnackbarProps({ message, severity, duration });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const SnackbarComponent = (
    <Snackbar
      open={open}
      autoHideDuration={snackbarProps.duration}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={handleClose}
        severity={snackbarProps.severity}
        sx={{ width: "100%" }}
      >
        {snackbarProps.message}
      </Alert>
    </Snackbar>
  );

  return { showSnackbar, SnackbarComponent };
}
