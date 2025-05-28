import type React from "react";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Fade,
  Zoom,
  Slide,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Lock, Home, ArrowBack, Security, Warning } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { keyframes } from "@mui/system";

// Animation keyframes
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
`;

const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(true);
  }, []);

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleLogin = () => {
    navigate("/auth");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, 
          ${theme.palette.error.light}15 0%, 
          ${theme.palette.warning.light}15 50%, 
          ${theme.palette.error.main}15 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: `${theme.palette.error.main}20`,
          animation: `${float} 6s ease-in-out infinite`,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "15%",
          right: "15%",
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          background: `${theme.palette.warning.main}20`,
          animation: `${float} 8s ease-in-out infinite reverse`,
        }}
      />

      <Container maxWidth="md">
        <Fade in={showContent} timeout={1000}>
          <Paper
            elevation={24}
            sx={{
              padding: { xs: 4, md: 6 },
              textAlign: "center",
              borderRadius: 4,
              background: `linear-gradient(145deg, 
                ${theme.palette.background.paper} 0%, 
                ${theme.palette.background.default} 100%)`,
              backdropFilter: "blur(10px)",
              border: `1px solid ${theme.palette.divider}`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative top border */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: `linear-gradient(90deg, 
                  ${theme.palette.error.main}, 
                  ${theme.palette.warning.main}, 
                  ${theme.palette.error.main})`,
              }}
            />

            <Zoom in={showContent} timeout={1500}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 3,
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    animation: `${pulse} 2s ease-in-out infinite`,
                  }}
                >
                  <Security
                    sx={{
                      fontSize: { xs: 80, md: 120 },
                      color: theme.palette.error.main,
                      filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
                    }}
                  />
                  <Lock
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      fontSize: { xs: 30, md: 40 },
                      color: theme.palette.background.paper,
                      animation: `${shake} 3s ease-in-out infinite`,
                    }}
                  />
                </Box>
              </Box>
            </Zoom>

            <Slide direction="up" in={showContent} timeout={2000}>
              <Box>
                <Typography
                  variant={isMobile ? "h3" : "h1"}
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                    color: theme.palette.error.main,
                    textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
                    marginBottom: 2,
                  }}
                >
                  403
                </Typography>

                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  component="h2"
                  gutterBottom
                  sx={{
                    fontWeight: "600",
                    color: theme.palette.text.primary,
                    marginBottom: 2,
                  }}
                >
                  Truy Cập Bị Từ Chối
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: theme.palette.text.secondary,
                    marginBottom: 4,
                    maxWidth: "600px",
                    margin: "0 auto 2rem auto",
                    lineHeight: 1.6,
                  }}
                >
                  Xin lỗi, bạn không có quyền truy cập vào trang này. Vui lòng
                  liên hệ với quản trị viên nếu bạn cho rằng đây là một lỗi.
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 4,
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Home />}
                    onClick={handleGoHome}
                    sx={{
                      borderRadius: "25px",
                      padding: "12px 30px",
                      background: `linear-gradient(45deg, 
                        ${theme.palette.primary.main}, 
                        ${theme.palette.primary.dark})`,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
                        background: `linear-gradient(45deg, 
                          ${theme.palette.primary.dark}, 
                          ${theme.palette.primary.main})`,
                      },
                      "&:active": {
                        transform: "translateY(1px)",
                      },
                    }}
                  >
                    Về Trang Chủ
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<ArrowBack />}
                    onClick={handleGoBack}
                    sx={{
                      borderRadius: "25px",
                      padding: "12px 30px",
                      borderWidth: "2px",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderWidth: "2px",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                      },
                      "&:active": {
                        transform: "translateY(1px)",
                      },
                    }}
                  >
                    Quay Lại
                  </Button>

                  <Button
                    variant="text"
                    size="large"
                    startIcon={<Warning />}
                    onClick={handleLogin}
                    sx={{
                      borderRadius: "25px",
                      padding: "12px 30px",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        backgroundColor: `${theme.palette.action.hover}`,
                      },
                      "&:active": {
                        transform: "translateY(1px)",
                      },
                    }}
                  >
                    Đăng Nhập Lại
                  </Button>
                </Box>
              </Box>
            </Slide>

            {/* Additional info section */}
            <Fade in={showContent} timeout={3000}>
              <Box
                sx={{
                  marginTop: 4,
                  padding: 2,
                  backgroundColor: `${theme.palette.info.main}10`,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.info.main}30`,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontStyle: "italic",
                  }}
                >
                  💡 Mẹo: Nếu bạn cần truy cập vào trang này, hãy liên hệ với
                  quản trị viên hoặc kiểm tra lại quyền truy cập của bạn.
                </Typography>
              </Box>
            </Fade>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default ForbiddenPage;
