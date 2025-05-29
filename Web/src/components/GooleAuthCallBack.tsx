import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { handleGoogleCallback } from "../api/auth";

export default function GoogleCallback() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      handleGoogleCallback();
    } catch (err) {
      setError("Đã xảy ra lỗi khi xử lý đăng nhập Google. Vui lòng thử lại.");
      console.error("Google callback error:", err);
    }
  }, []);

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          <a href="/auth">Quay lại trang đăng nhập</a>
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" sx={{ mt: 4 }}>
        Đang xử lý đăng nhập...
      </Typography>
    </Box>
  );
}
