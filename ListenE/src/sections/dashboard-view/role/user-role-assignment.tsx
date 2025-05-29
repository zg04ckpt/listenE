import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Breadcrumbs,
  Link,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Avatar,
  alpha,
  useTheme,
  Autocomplete,
} from "@mui/material";
import {
  Security,
  Search,
  Home,
  Dashboard,
  Refresh,
  Save,
  CheckCircle,
  Cancel,
  People,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { getAllRoles } from "../../../api/role";
import { getAllUsers } from "../../../api/user";
import { IUserResponseItem } from "../../../types/user";
import { IRoleItem } from "../../../types/role";
import { asignRoles } from "../../../api/role";
import { useNotification } from "../../../provider/NotificationProvider";

const UserRoleAssignment = () => {
  const { showSuccess, showError } = useNotification();
  const theme = useTheme();
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();

  const [roles, setRoles] = useState<IRoleItem[]>([]);
  const [users, setUsers] = useState<IUserResponseItem[]>([]);
  const [selectedUser, setSelectedUser] = useState<IUserResponseItem | null>(
    null
  );
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all roles
  const handleGetAllRoles = async () => {
    try {
      const response = await getAllRoles();
      setRoles(response?.data?.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  // Fetch all users
  const handleGetAllUsers = async () => {
    try {
      const response = await getAllUsers({ size: 100 });
      setUsers(response?.items);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data loading
  useEffect(() => {
    Promise.all([handleGetAllRoles(), handleGetAllUsers()]);
  }, []);

  // Handle URL parameter for user selection
  useEffect(() => {
    if (userId && !isNaN(Number(userId)) && users.length > 0) {
      // Find user from the existing users array
      const user = users.find((u) => u.id === Number(userId));
      if (user) {
        setSelectedUser(user);
        setSelectedRoles(user.roles || []);
      }
    }
  }, [userId, users]);

  // Handle role toggle
  const handleRoleToggle = (roleName: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleName)
        ? prev.filter((r) => r !== roleName)
        : [...prev, roleName]
    );
  };

  // Handle user selection
  const handleUserSelect = (user: IUserResponseItem | null) => {
    if (user) {
      setSelectedUser(user);
      setSelectedRoles(user.roles || []);
      // Update URL without reloading
      navigate(`/dashboard/asign-roles/${user.id}`, { replace: true });
    } else {
      setSelectedUser(null);
      setSelectedRoles([]);
      navigate(`/dashboard/asign-roles`, { replace: true });
    }
  };

  // Save user roles
  const handleSaveRoles = async () => {
    if (!selectedUser) return;

    setSaving(true);
    try {
      await asignRoles(selectedRoles, selectedUser.id);
      showSuccess("Updated successfully!");

      // Update local state
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id ? { ...user, roles: selectedRoles } : user
        )
      );

      // Update selected user state
      setSelectedUser({
        ...selectedUser,
        roles: selectedRoles,
      });
      navigate("/dashboard/manage-roles");
    } catch (error) {
      showError("Failed to asgin roles for this user, please try again later!");
      console.error("Error updating user roles:", error);
    } finally {
      setSaving(false);
    }
  };

  // Filter roles based on search term
  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get initials for avatar
  const getInitials = (firstName: string, lastName: string) => {
    return (
      firstName.charAt(0) + (lastName ? lastName.charAt(0) : "")
    ).toUpperCase();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Breadcrumbs sx={{ mb: 1 }}>
              <Link
                underline="hover"
                color="inherit"
                sx={{ display: "flex", alignItems: "center" }}
                onClick={() => navigate("/")}
                style={{ cursor: "pointer" }}
              >
                <Home sx={{ mr: 0.5 }} fontSize="inherit" />
                Home
              </Link>
              <Link
                underline="hover"
                color="inherit"
                sx={{ display: "flex", alignItems: "center" }}
                onClick={() => navigate("/dashboard")}
                style={{ cursor: "pointer" }}
              >
                <Dashboard sx={{ mr: 0.5 }} fontSize="inherit" />
                Dashboard
              </Link>
              <Typography
                color="text.primary"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Security sx={{ mr: 0.5 }} fontSize="inherit" />
                User Role Assignment
              </Typography>
            </Breadcrumbs>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              gutterBottom
              sx={{ textAlign: "left" }}
            >
              User Role Assignment
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Assign roles and permissions to users
            </Typography>
          </Box>

          <Box sx={{ mt: { xs: 2, md: 0 } }}>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSaveRoles}
              disabled={!selectedUser || saving}
              sx={{
                mr: 1,
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-3px)",
                },
              }}
            >
              {saving ? <CircularProgress size={24} /> : "Save Changes"}
            </Button>
            <IconButton
              onClick={() => window.location.reload()}
              color="primary"
            >
              <Refresh />
            </IconButton>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* User Selection Panel */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
                height: "100%",
                background: `linear-gradient(135deg, ${alpha(
                  theme.palette.background.paper,
                  0.9
                )}, ${alpha(theme.palette.background.paper, 0.95)})`,
                backdropFilter: "blur(10px)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: "linear-gradient(90deg, #2196F3, #21CBF3)",
                },
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Select User
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Choose a user to manage their roles and permissions
              </Typography>

              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100px",
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : (
                <Autocomplete
                  options={users}
                  getOptionLabel={(option) =>
                    `${option.firstName} ${option.lastName} (${option.email})`
                  }
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        {option.imageUrl ? (
                          <Avatar
                            src={option.imageUrl}
                            alt={`${option.firstName} ${option.lastName}`}
                            sx={{ mr: 2, width: 32, height: 32 }}
                          />
                        ) : (
                          <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                            {getInitials(option.firstName, option.lastName)}
                          </Avatar>
                        )}
                        <Box>
                          <Typography variant="body1">
                            {option.firstName} {option.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {option.email}
                          </Typography>
                        </Box>
                      </Box>
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search Users"
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <InputAdornment position="start">
                              <Search />
                            </InputAdornment>
                            {params.InputProps.startAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  value={selectedUser}
                  onChange={(_, newValue) => handleUserSelect(newValue)}
                  fullWidth
                />
              )}

              {selectedUser && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Box
                    sx={{
                      mt: 4,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      border: `1px solid ${alpha(
                        theme.palette.primary.main,
                        0.1
                      )}`,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      {selectedUser.imageUrl ? (
                        <Avatar
                          src={selectedUser.imageUrl}
                          alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                          sx={{ width: 64, height: 64, mr: 2 }}
                        />
                      ) : (
                        <Avatar sx={{ width: 64, height: 64, mr: 2 }}>
                          {getInitials(
                            selectedUser.firstName,
                            selectedUser.lastName
                          )}
                        </Avatar>
                      )}
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {selectedUser.firstName} {selectedUser.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedUser.email}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" gutterBottom>
                      Current Roles:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {selectedUser.roles && selectedUser.roles.length > 0 ? (
                        selectedUser.roles.map((role) => (
                          <Chip
                            key={role}
                            label={role}
                            size="small"
                            color={
                              role.toLowerCase() === "admin"
                                ? "error"
                                : "primary"
                            }
                          />
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No roles assigned
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </motion.div>
              )}
            </Paper>
          </Grid>

          {/* Role Assignment Panel */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${alpha(
                  theme.palette.background.paper,
                  0.9
                )}, ${alpha(theme.palette.background.paper, 0.95)})`,
                backdropFilter: "blur(10px)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: "linear-gradient(90deg, #2196F3, #21CBF3)",
                },
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Assign Roles
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Select the roles you want to assign to the user
              </Typography>

              <TextField
                fullWidth
                placeholder="Search roles..."
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              {!selectedUser ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 8,
                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                    borderRadius: 2,
                    border: `1px dashed ${alpha(
                      theme.palette.text.secondary,
                      0.2
                    )}`,
                  }}
                >
                  <People
                    sx={{
                      fontSize: 60,
                      color: alpha(theme.palette.text.secondary, 0.3),
                      mb: 2,
                    }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No User Selected
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Please select a user from the panel on the left
                    <br />
                    to manage their roles
                  </Typography>
                </Box>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <List sx={{ width: "100%" }}>
                    {filteredRoles.map((role) => (
                      <motion.div key={role.id} variants={itemVariants}>
                        <ListItem
                          disablePadding
                          sx={{
                            mb: 1,
                            borderRadius: 2,
                            overflow: "hidden",
                            bgcolor: selectedRoles.includes(role.name)
                              ? alpha(theme.palette.primary.main, 0.1)
                              : "transparent",
                            border: `1px solid ${
                              selectedRoles.includes(role.name)
                                ? alpha(theme.palette.primary.main, 0.3)
                                : alpha(theme.palette.divider, 1)
                            }`,
                            transition: "all 0.2s",
                          }}
                        >
                          <ListItemIcon sx={{ ml: 2 }}>
                            <Checkbox
                              edge="start"
                              checked={selectedRoles.includes(role.name)}
                              onChange={() => handleRoleToggle(role.name)}
                              color="primary"
                              icon={<Cancel color="action" />}
                              checkedIcon={<CheckCircle color="primary" />}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography
                                variant="subtitle1"
                                fontWeight="medium"
                              >
                                {role.name}
                              </Typography>
                            }
                            secondary={
                              role.name.toLowerCase() === "admin"
                                ? "Full system access with all permissions"
                                : role.name.toLowerCase() === "user"
                                ? "Standard user access with limited permissions"
                                : `Custom role with specific permissions`
                            }
                            sx={{ py: 1 }}
                          />
                          <Chip
                            label={`ID: ${role.id}`}
                            size="small"
                            sx={{ mr: 2 }}
                            variant="outlined"
                          />
                        </ListItem>
                      </motion.div>
                    ))}
                  </List>

                  {filteredRoles.length === 0 && (
                    <Box
                      sx={{
                        textAlign: "center",
                        py: 4,
                        bgcolor: alpha(theme.palette.background.paper, 0.5),
                        borderRadius: 2,
                        border: `1px dashed ${alpha(
                          theme.palette.text.secondary,
                          0.2
                        )}`,
                      }}
                    >
                      <Typography variant="body1" color="text.secondary">
                        No roles found matching your search.
                      </Typography>
                    </Box>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      mt: 3,
                      pt: 2,
                      borderTop: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="inherit"
                      onClick={() => setSelectedRoles(selectedUser.roles || [])}
                      sx={{ mr: 2 }}
                    >
                      Reset
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSaveRoles}
                      disabled={saving}
                    >
                      {saving ? <CircularProgress size={24} /> : "Save Changes"}
                    </Button>
                  </Box>
                </motion.div>
              )}
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default UserRoleAssignment;
