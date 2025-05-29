import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Breadcrumbs,
  Link,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  alpha,
  useTheme,
} from "@mui/material";
import {
  Security,
  Add,
  Edit,
  Delete,
  Search,
  Home,
  Dashboard,
  Refresh,
  AdminPanelSettings,
  LockPerson,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getAllRoles } from "../../../api/role";

// Define types
interface Role {
  id: number;
  name: string;
}

const RoleManagementPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editRoleName, setEditRoleName] = useState("");

  // Fetch all roles
  const handleGetAllRoles = async () => {
    setLoading(true);
    try {
      const response = await getAllRoles();
      setRoles(response?.data?.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetAllRoles();
  }, []);

  // Handle role deletion
  const handleDeleteClick = (roleId: number) => {
    setSelectedRoleId(roleId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedRoleId) {
      try {
        // This is a mock API call - replace with your actual API
        await axios.delete(`/api/v1/users/roles/${selectedRoleId}`);
        setRoles(roles.filter((role) => role.id !== selectedRoleId));
      } catch (error) {
        console.error("Error deleting role:", error);
      }
    }
    setDeleteDialogOpen(false);
    setSelectedRoleId(null);
  };

  // Handle role creation
  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return;

    try {
      // This is a mock API call - replace with your actual API
      const response = await axios.post("/api/v1/users/roles", {
        name: newRoleName,
      });
      setRoles([...roles, response.data]);
      setNewRoleName("");
      setCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating role:", error);
    }
  };

  // Handle role editing
  const handleEditClick = (role: Role) => {
    setSelectedRoleId(role.id);
    setEditRoleName(role.name);
    setEditDialogOpen(true);
  };

  const handleEditConfirm = async () => {
    if (!editRoleName.trim() || !selectedRoleId) return;

    try {
      // This is a mock API call - replace with your actual API
      await axios.put(`/api/v1/users/roles/${selectedRoleId}`, {
        name: editRoleName,
      });
      setRoles(
        roles.map((role) =>
          role.id === selectedRoleId ? { ...role, name: editRoleName } : role
        )
      );
      setEditDialogOpen(false);
      setSelectedRoleId(null);
      setEditRoleName("");
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  // Filter roles based on search term
  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
                Role Management
              </Typography>
            </Breadcrumbs>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              gutterBottom
              sx={{ textAlign: "left" }}
            >
              Role Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage system roles and permissions
            </Typography>
          </Box>
        </Box>

        <Paper
          elevation={2}
          sx={{
            p: 2,
            mb: 4,
            borderRadius: 2,
            background: "linear-gradient(to right, #f5f7fa, #e4e7eb)",
          }}
        >
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
          />
        </Paper>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "300px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : filteredRoles.length === 0 ? (
          <Paper
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 2,
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No roles found
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {searchTerm
                ? "Try adjusting your search."
                : "Create your first role to get started."}
            </Typography>
          </Paper>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={3}>
              {filteredRoles.map((role) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={role.id}>
                  <motion.div variants={itemVariants}>
                    <Card
                      sx={{
                        borderRadius: 2,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        transition: "transform 0.3s, box-shadow 0.3s",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: "0 12px 20px rgba(0,0,0,0.1)",
                        },
                        position: "relative",
                        overflow: "hidden",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: "4px",
                          background:
                            role.name.toLowerCase() === "admin"
                              ? "linear-gradient(90deg, #f44336, #ff9800)"
                              : "linear-gradient(90deg, #2196F3, #21CBF3)",
                        },
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              backgroundColor:
                                role.name.toLowerCase() === "admin"
                                  ? alpha(theme.palette.error.main, 0.1)
                                  : alpha(theme.palette.primary.main, 0.1),
                              borderRadius: "50%",
                              p: 1,
                              mr: 2,
                            }}
                          >
                            {role.name.toLowerCase() === "admin" ? (
                              <AdminPanelSettings
                                color="error"
                                fontSize="large"
                              />
                            ) : (
                              <LockPerson color="primary" fontSize="large" />
                            )}
                          </Box>
                          <Box>
                            <Typography
                              variant="h6"
                              component="div"
                              fontWeight="bold"
                            >
                              {role.name}
                            </Typography>
                            <Chip
                              label={`ID: ${role.id}`}
                              size="small"
                              sx={{ mt: 0.5 }}
                            />
                          </Box>
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 2 }}
                        >
                          {role.name.toLowerCase() === "admin"
                            ? "Full system access with all permissions"
                            : role.name.toLowerCase() === "user"
                            ? "Standard user access with limited permissions"
                            : `Custom role with specific permissions`}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}
      </motion.div>
    </Container>
  );
};

export default RoleManagementPage;
