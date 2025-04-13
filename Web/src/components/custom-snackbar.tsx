import {
  Snackbar,
  IconButton,
  Slide,
  Typography,
  type SlideProps,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

export type NotificationType = "success" | "error" | "warning" | "info";

interface CustomSnackbarProps {
  open: boolean;
  onClose: () => void;
  message: string;
  type?: NotificationType;
  autoHideDuration?: number;
}

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

export default function CustomSnackbar({
  open,
  onClose,
  message,
  type = "info",
  autoHideDuration = 100000,
}: CustomSnackbarProps) {
  const theme = useTheme();

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "#17c820";
      case "error":
        return theme.palette.error.main;
      case "warning":
        return theme.palette.warning.main;
      case "info":
      default:
        return theme.palette.info.main;
    }
  };

  return (
    <Snackbar
      open={open}
      onClose={onClose}
      autoHideDuration={autoHideDuration}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      TransitionComponent={SlideTransition}
      message={<Typography variant="body2">{message}</Typography>}
      action={
        <IconButton size="small" color="inherit" onClick={onClose}>
          <Close fontSize="small" />
        </IconButton>
      }
      sx={{
        top: "80px !important",
        "& .MuiPaper-root": {
          backgroundColor: getBackgroundColor(),
          color: "white",
          padding: "4px 16px",
          borderRadius: theme.shape.borderRadius,
        },
      }}
    />
  );
}
