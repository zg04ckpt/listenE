import { useState } from "react";
import { Container, Box, Typography, Input, InputLabel } from "@mui/material";

import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

export default function Authentication() {
  const [shiftLeft, setShiftLeft] = useState(false);

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
          maxWidth: "390px",
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
              transition: "all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
              transform: shiftLeft ? "translateX(-100%)" : "translateX(0)",
            }}
          >
            Đăng nhập
          </Typography>
          <Typography
            sx={{
              width: "50%",
              fontSize: "35px",
              fontWeight: 600,
              textAlign: "center",
              transition: "all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
              transform: shiftLeft ? "translateX(-100%)" : "translateX(0)",
            }}
          >
            Đăng ký
          </Typography>
        </Box>
        <Container sx={{ width: "100%", overflow: "hidden" }}>
          <Box
            sx={{
              position: "relative",
              display: "flex",
              height: "50px",
              width: "100%",
              overflow: "hidden",
              margin: "30px 0 10px 0",
              justifyContent: "center",
              border: "1px solid lightgrey",
              borderRadius: "15px",
            }}
          >
            <Input
              sx={{ display: "none" }}
              type="radio"
              name="slide"
              id="login"
              defaultChecked
            />
            <Input
              sx={{ display: "none" }}
              type="radio"
              name="slide"
              id="signup"
              defaultChecked
            />
            <InputLabel
              sx={{
                height: "100%",
                width: "100%",
                color: !shiftLeft ? "#fff" : "#000",
                fontSize: "18px",
                fontWeight: 500,
                textAlign: "center",
                lineHeight: "48px",
                cursor: "pointer",
                zIndex: 1,
                transition: "all 0.6s ease",
              }}
              htmlFor="login"
              onClick={() => setShiftLeft(false)}
            >
              Đăng nhập
            </InputLabel>
            <InputLabel
              sx={{
                height: "100%",
                width: "100%",
                color: shiftLeft ? "#fff" : "#000",
                fontSize: "18px",
                fontWeight: 500,
                textAlign: "center",
                lineHeight: "48px",
                cursor: "pointer",
                zIndex: 1,
                transition: "all 0.6s ease",
              }}
              htmlFor="signup"
              onClick={() => setShiftLeft(true)}
            >
              Đăng ký
            </InputLabel>
            <Box
              sx={{
                position: "absolute",
                height: "100%",
                width: "50%",
                left: shiftLeft ? "50%" : "0",
                zIndex: 0,
                borderRadius: "15px",
                background:
                  "linear-gradient(to right, #003366, #004080, #0059b3, #0073e6)",
                transition: "all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
              }}
            ></Box>
          </Box>
        </Container>
        <Box sx={{ display: "flex", width: "200%" }}>
          <LoginForm shiftLeft={shiftLeft} setShiftLeft={setShiftLeft} />
          <SignupForm shiftLeft={shiftLeft} setShiftLeft={setShiftLeft} />
        </Box>
      </Box>
    </Container>
  );
}
