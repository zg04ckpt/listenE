"use client";

import React from "react";

import { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Container,
  useMediaQuery,
  useTheme,
  Avatar,
  useScrollTrigger,
  Fade,
  ListItemButton,
} from "@mui/material";
import {
  Menu as MenuIcon,
  School,
  Settings,
  Person,
  Login,
} from "@mui/icons-material";

function ElevationScroll(props: { children: React.ReactElement<any> }) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
    sx: {
      bgcolor: trigger ? "white" : "transparent",
      color: trigger ? "text.primary" : "white",
      transition: "all 0.3s ease",
    },
  });
}

const HomeNavbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const navItems = [{ text: "Login/Signup", icon: <Login />, path: "/auth" }];

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setDrawerOpen(open);
    };

  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          my: 2,
        }}
      >
        <Avatar sx={{ width: 64, height: 64, mb: 1, bgcolor: "primary.main" }}>
          <Person fontSize="large" />
        </Avatar>
        <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
          User Name
        </Typography>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem disablePadding key={item.text}>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              sx={{
                borderRadius: 2,
                mx: 1,
                mb: 1,
                "&:hover": {
                  bgcolor: "rgba(63, 81, 181, 0.08)",
                },
              }}
            >
              <Box sx={{ mr: 2, color: "primary.main" }}>{item.icon}</Box>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Fade in={true} timeout={800}>
      <div>
        <ElevationScroll>
          <AppBar
            position="fixed"
            color="default"
            elevation={0}
            sx={{
              bgcolor: isHomePage ? "transparent" : "white",
              color: isHomePage ? "white" : "text.primary",
              left: 0,
              right: 0,
              width: "100%",
              backdropFilter: "blur(8px)",
            }}
          >
            <Container maxWidth="lg">
              <Toolbar disableGutters>
                {isMobile && (
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={toggleDrawer(true)}
                    sx={{ mr: 2 }}
                  >
                    <MenuIcon />
                  </IconButton>
                )}

                <Typography
                  variant="h6"
                  component={RouterLink}
                  to="/"
                  sx={{
                    mr: 2,
                    fontWeight: 700,
                    color: "inherit",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <School sx={{ mr: 1 }} />
                  ListenE
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                {!isMobile && (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {navItems.map((item) => (
                      <Button
                        key={item.text}
                        component={RouterLink}
                        to={item.path}
                        startIcon={item.icon}
                        sx={{
                          mx: 1,
                          fontWeight: 500,
                          color: "inherit",
                          "&:hover": {
                            color: "#fff",
                            bgcolor: isHomePage
                              ? "rgba(255, 255, 255, 0.1)"
                              : "rgba(63, 81, 181, 0.08)",
                          },
                        }}
                      >
                        {item.text}
                      </Button>
                    ))}
                  </Box>
                )}

                <Box sx={{ ml: 2 }}>
                  <IconButton color="inherit">
                    <Settings
                      sx={{
                        animation: "spin 3s linear infinite",
                        "@keyframes spin": {
                          "0%": {
                            transform: "rotate(0deg)",
                          },
                          "100%": {
                            transform: "rotate(360deg)",
                          },
                        },
                      }}
                    />
                  </IconButton>
                  <IconButton color="inherit">
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: isHomePage ? "white" : "primary.main",
                      }}
                    >
                      <Person
                        sx={{ color: isHomePage ? "primary.main" : "white" }}
                      />
                    </Avatar>
                  </IconButton>
                </Box>
              </Toolbar>
            </Container>
          </AppBar>
        </ElevationScroll>

        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          {drawer}
        </Drawer>

        <Toolbar />
      </div>
    </Fade>
  );
};

export default HomeNavbar;
