import { Box, CircularProgress, Typography, alpha } from "@mui/material";

interface LoadingOverlayProps {
  loading: boolean;
  message: string;
}

export default function LoadingOverlay({ message }: LoadingOverlayProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        p: 4,
        borderRadius: 3,
        bgcolor: alpha("#000", 0.7),
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
      }}
    >
      <CircularProgress color="inherit" size={60} thickness={4} />
      <Typography variant="h6" sx={{ fontWeight: "medium" }}>
        {message}
      </Typography>
    </Box>
  );
}
