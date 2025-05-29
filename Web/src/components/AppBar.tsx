import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import LogoutIcon from "@mui/icons-material/Logout";
import { logout } from "../api/auth";
import { useNotification } from "../provider/NotificationProvider";
import { useNavigate } from "react-router-dom";
import { Fade } from "@mui/material";

const pages = [
  { name: "Home", path: "/" },
  { name: "Topics", path: "/topics" },
];

export default function ResponsiveAppBar() {
  const navigate = useNavigate();
  const { showError } = useNotification();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/auth";
    } catch (error) {
      showError(error instanceof Error ? error.message : String(error));
      console.error(error);
    }
  };

  return (
    <AppBar
      sx={{
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10000,
      }}
      position="static"
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            component="img"
            src="https://res.cloudinary.com/dvk5yt0oi/image/upload/v1744554468/avatar_tmmlz2.png"
            alt="Language Learning"
            sx={{
              width: "65px",
              height: "auto",
              borderRadius: 4,
              transform: "perspective(1000px) rotateY(-5deg)",
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "perspective(1000px) rotateY(-15deg) scale(1.05)",
              },
            }}
          />

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.name}
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate(page.path);
                  }}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    {page.name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={() => navigate(page.path)}
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  position: "relative",
                  "&:focus": {
                    outline: "none !important",
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    width: "0",
                    height: "2px",
                    bottom: "5px",
                    left: "50%",
                    backgroundColor: "white",
                    transition: "all 0.3s ease-in-out",
                  },
                  "&:hover::after": {
                    width: "80%",
                    left: "10%",
                  },
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>
          <Box
            sx={{
              flexGrow: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Fade in={true}>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  borderRadius: "20px",
                  borderColor: "rgba(255,255,255,0.3)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "rgba(255,255,255,0.8)",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    transform: "translateY(-2px)",
                  },
                  "&:active": {
                    transform: "translateY(1px)",
                  },
                  "&:focus": {
                    outline: "none",
                  },
                }}
              >
                Đăng xuất
              </Button>
            </Fade>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
