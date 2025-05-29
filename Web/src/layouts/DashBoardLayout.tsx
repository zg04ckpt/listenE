import type React from "react";

import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Collapse,
  IconButton,
  Avatar,
  Badge,
  Tooltip,
  Paper,
  Button,
  alpha,
} from "@mui/material";
import {
  People,
  Logout,
  AccountCircle,
  Topic,
  Security,
  ExpandLess,
  ExpandMore,
  AdminPanelSettings,
  LockPerson,
  QuestionAnswer,
  LocalOffer,
  Menu as MenuIcon,
  Notifications,
  Settings,
  ChevronLeft,
  Brightness4,
  Brightness7,
  School,
  Translate,
  Add,
  LibraryMusic,
  Audiotrack,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

const drawerWidth = 280;

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const slideIn = {
  hidden: { x: -20, opacity: 0 },
  visible: (custom: number) => ({
    x: 0,
    opacity: 1,
    transition: { delay: custom * 0.1, duration: 0.5 },
  }),
};

const MotionListItem = motion(ListItem);

export default function DashboardLayout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [open, setOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationEl, setNotificationEl] = useState<null | HTMLElement>(
    null
  );
  const [securityOpen, setSecurityOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [pageTitle, setPageTitle] = useState("Topics");

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("manage-topics")) setPageTitle("Topics");
    else if (path.includes("manage-questions")) setPageTitle("Questions");
    else if (path.includes("manage-tags")) setPageTitle("Tags");
    else if (path.includes("manage-users")) setPageTitle("Users");
    else if (path.includes("manage-roles")) setPageTitle("Roles");
    else if (path.includes("asign-roles")) setPageTitle("User Roles");
    else if (path.includes("manage-tracks")) setPageTitle("Tracks");
    else if (path.includes("create-track")) setPageTitle("Create Track");
    else if (path.includes("edit-track")) setPageTitle("Edit Track");
    else setPageTitle("Topics");
  }, [location]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenu = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClose = () => {
    setNotificationEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    navigate("/auth");
  };

  const handleSecurityToggle = () => {
    setSecurityOpen(!securityOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const isSecurityPath =
    location.pathname.includes("/dashboard/manage-roles") ||
    location.pathname.includes("/dashboard/asign-roles");

  const isTracksPath = location.pathname.includes("/dashboard/manage-tracks");

  useEffect(() => {
    if (isSecurityPath && !securityOpen) {
      setSecurityOpen(true);
    }
  }, [isSecurityPath, securityOpen]);

  const menuItems = [
    { text: "Topics", icon: <Topic />, path: "/dashboard/manage-topics" },
    {
      text: "Questions",
      icon: <QuestionAnswer />,
      path: "/dashboard/manage-questions",
    },
    { text: "Tags", icon: <LocalOffer />, path: "/dashboard/manage-tags" },
    {
      text: "Tracks",
      icon: <LibraryMusic />,
      path: "/dashboard/manage-tracks",
    },
    { text: "Users", icon: <People />, path: "/dashboard/manage-users" },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: darkMode ? "rgb(17, 24, 39)" : "rgb(249, 250, 251)",
        color: darkMode ? "white" : "inherit",
        transition: "all 0.3s ease",
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${open ? drawerWidth : 0}px)` },
          ml: { md: open ? `${drawerWidth}px` : 0 },
          bgcolor: darkMode ? "rgb(31, 41, 55)" : "white",
          color: darkMode ? "white" : "text.primary",
          boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
        elevation={0}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            style={{ display: "flex", alignItems: "center" }}
          >
            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{
                flexGrow: 1,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              {pageTitle === "Tracks" ||
              pageTitle === "Create Track" ||
              pageTitle === "Edit Track" ? (
                <LibraryMusic sx={{ mr: 1 }} />
              ) : (
                <School sx={{ mr: 1 }} />
              )}
              {pageTitle}
            </Typography>
          </motion.div>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isTracksPath && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Add />}
                  size="small"
                  onClick={() => navigate("/dashboard/create-track")}
                  sx={{
                    mr: 2,
                    borderRadius: "8px",
                    boxShadow:
                      "0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)",
                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                  }}
                >
                  New Track
                </Button>
              </motion.div>
            )}

            <Tooltip title={darkMode ? "Light Mode" : "Dark Mode"}>
              <IconButton color="inherit" onClick={toggleDarkMode}>
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Notifications">
              <IconButton color="inherit" onClick={handleNotificationMenu}>
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Settings">
              <IconButton color="inherit">
                <Settings />
              </IconButton>
            </Tooltip>

            <Tooltip title="Account">
              <IconButton
                onClick={handleProfileMenu}
                color="inherit"
                sx={{ ml: 1 }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: theme.palette.primary.main,
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  A
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={isMobile ? handleDrawerToggle : undefined}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: darkMode ? "rgb(31, 41, 55)" : "#f8f9fa",
            color: darkMode ? "white" : "inherit",
            borderRight: darkMode
              ? "1px solid rgba(255,255,255,0.1)"
              : "1px solid rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
          },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: [2],
            py: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Translate
              sx={{ color: theme.palette.primary.main, fontSize: 28 }}
            />
            <Typography variant="h5" fontWeight="bold" color="primary">
              EnglishApp
            </Typography>
          </Box>
          {isMobile && (
            <IconButton onClick={handleDrawerToggle}>
              <ChevronLeft />
            </IconButton>
          )}
        </Toolbar>

        <Divider />

        <Box sx={{ p: 2 }}></Box>

        <List sx={{ px: 2 }} component="nav">
          {menuItems.map((item, index) => (
            <MotionListItem
              key={item.text}
              disablePadding
              custom={index}
              initial="hidden"
              animate="visible"
              variants={slideIn}
            >
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: "10px",
                  mb: 0.5,
                  transition: "all 0.2s",
                  "&.Mui-selected": {
                    bgcolor: darkMode
                      ? alpha(theme.palette.primary.main, 0.2)
                      : alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    "&:hover": {
                      bgcolor: darkMode
                        ? alpha(theme.palette.primary.main, 0.3)
                        : alpha(theme.palette.primary.main, 0.2),
                    },
                    "& .MuiListItemIcon-root": {
                      color: theme.palette.primary.main,
                    },
                  },
                  "&:hover": {
                    bgcolor: darkMode
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.04)",
                    transform: "translateX(5px)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color:
                      location.pathname === item.path
                        ? theme.palette.primary.main
                        : darkMode
                        ? "rgba(255,255,255,0.7)"
                        : "inherit",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: location.pathname === item.path ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </MotionListItem>
          ))}

          <MotionListItem
            disablePadding
            custom={menuItems.length - 1}
            initial="hidden"
            animate="visible"
            variants={slideIn}
          >
            <ListItemButton
              onClick={handleSecurityToggle}
              sx={{
                borderRadius: "10px",
                mb: 0.5,
                transition: "all 0.2s",
                bgcolor: isSecurityPath
                  ? darkMode
                    ? alpha(theme.palette.primary.main, 0.2)
                    : alpha(theme.palette.primary.main, 0.1)
                  : "transparent",
                color: isSecurityPath ? theme.palette.primary.main : "inherit",
                "&:hover": {
                  bgcolor: isSecurityPath
                    ? darkMode
                      ? alpha(theme.palette.primary.main, 0.3)
                      : alpha(theme.palette.primary.main, 0.2)
                    : darkMode
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.04)",
                  transform: "translateX(5px)",
                },
                "& .MuiListItemIcon-root": {
                  color: isSecurityPath
                    ? theme.palette.primary.main
                    : darkMode
                    ? "rgba(255,255,255,0.7)"
                    : "inherit",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Security />
              </ListItemIcon>
              <ListItemText
                primary="Security"
                primaryTypographyProps={{
                  fontWeight: isSecurityPath ? 600 : 400,
                }}
              />
              {securityOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </MotionListItem>

          <AnimatePresence>
            {securityOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Collapse in={securityOpen} timeout="auto">
                  <List component="div" disablePadding>
                    <MotionListItem
                      disablePadding
                      custom={menuItems.length + 1}
                      initial="hidden"
                      animate="visible"
                      variants={slideIn}
                    >
                      <ListItemButton
                        selected={location.pathname.includes(
                          "/dashboard/manage-roles"
                        )}
                        onClick={() => navigate("/dashboard/manage-roles")}
                        sx={{
                          pl: 4,
                          borderRadius: "10px",
                          ml: 2,
                          mb: 0.5,
                          transition: "all 0.2s",
                          "&.Mui-selected": {
                            bgcolor: darkMode
                              ? alpha(theme.palette.primary.main, 0.2)
                              : alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            "&:hover": {
                              bgcolor: darkMode
                                ? alpha(theme.palette.primary.main, 0.3)
                                : alpha(theme.palette.primary.main, 0.2),
                            },
                            "& .MuiListItemIcon-root": {
                              color: theme.palette.primary.main,
                            },
                          },
                          "&:hover": {
                            bgcolor: darkMode
                              ? "rgba(255,255,255,0.05)"
                              : "rgba(0,0,0,0.04)",
                            transform: "translateX(5px)",
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <AdminPanelSettings />
                        </ListItemIcon>
                        <ListItemText
                          primary="Roles"
                          primaryTypographyProps={{
                            fontWeight: location.pathname.includes(
                              "/dashboard/manage-roles"
                            )
                              ? 600
                              : 400,
                          }}
                        />
                      </ListItemButton>
                    </MotionListItem>

                    <MotionListItem
                      disablePadding
                      custom={menuItems.length + 2}
                      initial="hidden"
                      animate="visible"
                      variants={slideIn}
                    >
                      <ListItemButton
                        selected={location.pathname.includes(
                          "/dashboard/asign-roles"
                        )}
                        onClick={() => navigate("/dashboard/asign-roles")}
                        sx={{
                          pl: 4,
                          borderRadius: "10px",
                          ml: 2,
                          mb: 0.5,
                          transition: "all 0.2s",
                          "&.Mui-selected": {
                            bgcolor: darkMode
                              ? alpha(theme.palette.primary.main, 0.2)
                              : alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            "&:hover": {
                              bgcolor: darkMode
                                ? alpha(theme.palette.primary.main, 0.3)
                                : alpha(theme.palette.primary.main, 0.2),
                            },
                            "& .MuiListItemIcon-root": {
                              color: theme.palette.primary.main,
                            },
                          },
                          "&:hover": {
                            bgcolor: darkMode
                              ? "rgba(255,255,255,0.05)"
                              : "rgba(0,0,0,0.04)",
                            transform: "translateX(5px)",
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <LockPerson />
                        </ListItemIcon>
                        <ListItemText
                          primary="User Roles"
                          primaryTypographyProps={{
                            fontWeight: location.pathname.includes(
                              "/dashboard/asign-roles"
                            )
                              ? 600
                              : 400,
                          }}
                        />
                      </ListItemButton>
                    </MotionListItem>
                  </List>
                </Collapse>
              </motion.div>
            )}
          </AnimatePresence>
        </List>

        <Box sx={{ mt: "auto", p: 2 }}>
          <Divider sx={{ mb: 2 }} />

          <ListItem disablePadding>
            <ListItemButton
              sx={{
                color: "error.main",
                borderRadius: "10px",
                transition: "all 0.2s",
                "&:hover": {
                  bgcolor: darkMode
                    ? "rgba(244,67,54,0.1)"
                    : "rgba(244,67,54,0.05)",
                  transform: "translateX(5px)",
                },
              }}
              onClick={handleLogout}
            >
              <ListItemIcon sx={{ color: "error.main" }}>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${open ? drawerWidth : 0}px)` },
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ml: 0,
          mt: 8,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{ height: "100%" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 180,
            borderRadius: 2,
            bgcolor: darkMode ? "rgb(31, 41, 55)" : "white",
            color: darkMode ? "white" : "inherit",
            "& .MuiMenuItem-root": {
              px: 2,
              py: 1.5,
              borderRadius: 1,
              mx: 0.5,
              my: 0.25,
              "&:hover": {
                bgcolor: darkMode
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.04)",
              },
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Admin User
          </Typography>
          <Typography
            variant="body2"
            color={darkMode ? "rgba(255,255,255,0.7)" : "text.secondary"}
          >
            admin@example.com
          </Typography>
        </Box>
        <Divider />
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate("/admin/profile");
          }}
        >
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={toggleDarkMode}>
          <ListItemIcon>
            {darkMode ? (
              <Brightness7 fontSize="small" />
            ) : (
              <Brightness4 fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>{darkMode ? "Light Mode" : "Dark Mode"}</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ color: "error" }}
          />
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={notificationEl}
        open={Boolean(notificationEl)}
        onClose={handleNotificationClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            width: 320,
            maxWidth: "100%",
            borderRadius: 2,
            bgcolor: darkMode ? "rgb(31, 41, 55)" : "white",
            color: darkMode ? "white" : "inherit",
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Notifications
          </Typography>
          <Button size="small" color="primary">
            Mark all as read
          </Button>
        </Box>
        <Divider />
        <Box sx={{ maxHeight: 320, overflow: "auto" }}>
          {[1, 2, 3].map((item) => (
            <MenuItem
              key={item}
              onClick={handleNotificationClose}
              sx={{ py: 1.5, px: 2 }}
            >
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    width: 40,
                    height: 40,
                  }}
                >
                  {item === 1 ? (
                    <People />
                  ) : item === 2 ? (
                    <QuestionAnswer />
                  ) : (
                    <Audiotrack />
                  )}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    {item === 1
                      ? "New user registered"
                      : item === 2
                      ? "New question added"
                      : "New track uploaded"}
                  </Typography>
                  <Typography
                    variant="caption"
                    color={
                      darkMode ? "rgba(255,255,255,0.7)" : "text.secondary"
                    }
                  >
                    {item === 1
                      ? "A new user has registered to the platform"
                      : item === 2
                      ? "A new question has been added to Part 3"
                      : "A new listening track has been uploaded"}
                  </Typography>
                  <Typography
                    variant="caption"
                    display="block"
                    color={darkMode ? "rgba(255,255,255,0.5)" : "text.disabled"}
                    sx={{ mt: 0.5 }}
                  >
                    {item === 1
                      ? "2 minutes ago"
                      : item === 2
                      ? "1 hour ago"
                      : "5 hours ago"}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          ))}
        </Box>
        <Divider />
        <Box sx={{ p: 1.5 }}>
          <Button fullWidth size="small" onClick={handleNotificationClose}>
            View all notifications
          </Button>
        </Box>
      </Menu>
    </Box>
  );
}
