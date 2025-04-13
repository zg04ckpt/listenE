import { Container, Box, Typography } from "@mui/material";
import ForgotPasswordForm from "../components/ForgotPasswordForm";

export default function ForgotPassword() {
  return (
    <Container
      sx={{
        fontFamily: '"Poppins", sans-serif',
        maxWidth: "100% !important",
        width: "100vw",
        height: "100vh",
        display: "grid",
        placeItems: "center",
        backgroundImage: "linear-gradient(62deg, #8ec5fc 0%, #e0c3fc 100%)",
      }}
    >
      <Box
        sx={{
          overflow: "hidden",
          width: "390px",
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "rgb(38, 57, 77) 0px 20px 30px -10px",
        }}
      >
        <Box sx={{ display: "flex", width: "200%" }}>
          <Typography
            sx={{
              width: "50%",
              fontSize: "35px",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            Quên mật khẩu
          </Typography>
        </Box>
        <Box sx={{ display: "flex", width: "200%" }}>
          <ForgotPasswordForm />
        </Box>
      </Box>
    </Container>
  );
}
