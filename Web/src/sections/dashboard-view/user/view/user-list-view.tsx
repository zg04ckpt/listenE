import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Paper,
  Breadcrumbs,
  Link,
  useTheme,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TableSortLabel,
  type SelectChangeEvent,
  alpha,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Avatar,
} from "@mui/material";
import {
  Search,
  Dashboard,
  Home,
  Refresh,
  FilterList,
  ArrowUpward,
  ArrowDownward,
  Person,
  PersonAdd,
  VerifiedUser,
  Block,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { motion } from "framer-motion";

import { IUserResponseItem } from "../../../../types/user";
import { getAllUsers, deleteUser } from "../../../../api/user";
type SortDirection = "asc" | "desc";

export default function UserListView() {
  const navigate = useNavigate();
  const theme = useTheme();

  const [users, setUsers] = useState<IUserResponseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const showSuccess = (message: string) => console.log(message);
  const showError = (message: string) => console.error(message);

  const handleGetAllUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers({
        page,
        size,
        email: searchTerm,
        sortDirection,
      });

      console.log(response.items);
      setUsers(response.items);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
    } catch (error) {
      console.error("Error fetching users:", error);
      showError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetAllUsers();
  }, [page, size, sortDirection]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1) {
        setPage(1);
      } else {
        handleGetAllUsers();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (roleFilter || statusFilter) {
      setPage(1);
      handleGetAllUsers();
    }
  }, [roleFilter, statusFilter]);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleSizeChange = (event: SelectChangeEvent<number>) => {
    setSize(event.target.value as number);
    setPage(1);
  };

  const handleSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const handleEditUser = (userId: number) => {
    navigate(`/dashboard/users/${userId}/edit`);
  };

  const handleViewUserDetails = (userId: number) => {
    navigate(`/dashboard/users/${userId}`);
  };

  const handleDeleteClick = (userId: number) => {
    setSelectedUserId(userId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedUserId(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedUserId) {
      setDeleteLoading(true);
      try {
        await deleteUser();
        setUsers(users.filter((user) => user.id !== selectedUserId));
        if (users.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          handleGetAllUsers();
        }
        showSuccess("User deleted successfully!");
      } catch (error) {
        console.error("Error deleting user:", error);
        showError(`Failed to delete user: ${error}`);
      } finally {
        setDeleteLoading(false);
      }
    }
    setDeleteDialogOpen(false);
    setSelectedUserId(null);
  };

  const handleRefresh = () => {
    handleGetAllUsers();
  };

  const handleRoleFilterChange = (event: SelectChangeEvent<string>) => {
    setRoleFilter(event.target.value);
    setPage(1);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent<string>) => {
    setStatusFilter(event.target.value);
    setPage(1);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusColor = (isActivated: boolean, isEmailConfirmed: boolean) => {
    if (!isActivated) {
      return "error";
    }
    if (!isEmailConfirmed) {
      return "warning";
    }
    return "success";
  };

  const getRoleColor = (roles: string[]) => {
    const primaryRole = roles[0] || "";
    switch (primaryRole) {
      case "Admin":
        return "error";
      case "User":
        return "info";
      case "student":
        return "success";
      default:
        return "default";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const getInitials = (firstName: string, lastName: string) => {
    return (
      firstName.charAt(0) + (lastName ? lastName.charAt(0) : "")
    ).toUpperCase();
  };

  const getAvatarColor = (firstName: string, lastName: string) => {
    const name = `${firstName} ${lastName}`;
    const colors = [
      "#1E88E5",
      "#43A047",
      "#E53935",
      "#FB8C00",
      "#8E24AA",
      "#00ACC1",
      "#3949AB",
      "#00897B",
      "#7CB342",
      "#C0CA33",
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const getStatusLabel = (isActivated: boolean, isEmailConfirmed: boolean) => {
    if (!isActivated) {
      return "Blocked";
    }
    if (!isEmailConfirmed) {
      return "Pending";
    }
    return "Active";
  };

  const filteredUsers = users.filter((user) => {
    if (roleFilter && !user.roles.includes(roleFilter)) {
      return false;
    }

    if (statusFilter) {
      if (
        statusFilter === "active" &&
        user.isActivated &&
        user.isEmailConfirmed
      ) {
        return true;
      }
      if (
        statusFilter === "pending" &&
        user.isActivated &&
        !user.isEmailConfirmed
      ) {
        return true;
      }
      if (statusFilter === "blocked" && !user.isActivated) {
        return true;
      }
      if (statusFilter) {
        return false;
      }
    }

    return true;
  });

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
                <Person sx={{ mr: 0.5 }} fontSize="inherit" />
                Users
              </Typography>
            </Breadcrumbs>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              gutterBottom
              sx={{ textAlign: "left" }}
            >
              User Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your application users and their permissions
            </Typography>
          </Box>

          <Box sx={{ mt: { xs: 2, md: 0 } }}>
            <IconButton onClick={handleRefresh} color="primary">
              <Refresh />
            </IconButton>
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
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              alignItems: "center",
            }}
          >
            <TextField
              placeholder="Search by email..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flexGrow: 1, minWidth: { xs: "100%", sm: "auto" } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />

            <Box
              sx={{ display: "flex", gap: 1, ml: "auto", mt: { xs: 1, sm: 0 } }}
            >
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="role-filter-label">Role</InputLabel>
                <Select
                  labelId="role-filter-label"
                  id="role-filter"
                  value={roleFilter}
                  label="Role"
                  onChange={handleRoleFilterChange}
                >
                  <MenuItem value="">All Roles</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="teacher">Teacher</MenuItem>
                  <MenuItem value="student">Student</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  id="status-filter"
                  value={statusFilter}
                  label="Status"
                  onChange={handleStatusFilterChange}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="blocked">Blocked</MenuItem>
                </Select>
              </FormControl>

              <Button
                startIcon={<FilterList />}
                variant="outlined"
                size="small"
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                Filter
              </Button>
              <IconButton
                size="small"
                sx={{ display: { xs: "flex", md: "none" } }}
              >
                <FilterList />
              </IconButton>
            </Box>
          </Box>
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
        ) : filteredUsers.length === 0 ? (
          <Paper
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 2,
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No users found
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Try adjusting your search.
            </Typography>
          </Paper>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <Table sx={{ minWidth: 650 }} aria-label="users table">
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      "& th": {
                        fontWeight: "bold",
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    <TableCell>
                      <TableSortLabel
                        active={true}
                        direction={sortDirection}
                        onClick={() => handleSort()}
                        IconComponent={
                          sortDirection === "asc" ? ArrowUpward : ArrowDownward
                        }
                      >
                        ID
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={false}
                        direction={sortDirection}
                        onClick={() => handleSort()}
                      >
                        Email
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="center">
                      <TableSortLabel
                        active={false}
                        direction={sortDirection}
                        onClick={() => handleSort()}
                      >
                        Role
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="center">
                      <TableSortLabel
                        active={false}
                        direction={sortDirection}
                        onClick={() => handleSort()}
                      >
                        Status
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="center">
                      <TableSortLabel
                        active={false}
                        direction={sortDirection}
                        onClick={() => handleSort()}
                      >
                        Last Login
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user, index) => (
                    <TableRow
                      key={user.id}
                      sx={{
                        "&:nth-of-type(odd)": {
                          bgcolor: alpha(theme.palette.primary.main, 0.02),
                        },
                        "&:hover": {
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                        },
                        transition: "background-color 0.2s",
                        animation: `fadeIn 0.5s ease-out ${index * 0.05}s both`,
                        "@keyframes fadeIn": {
                          from: { opacity: 0, transform: "translateY(20px)" },
                          to: { opacity: 1, transform: "translateY(0)" },
                        },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {user.id}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          {user.imageUrl ? (
                            <Avatar
                              src={user.imageUrl}
                              alt={`${user.firstName} ${user.lastName}`}
                              sx={{
                                width: 40,
                                height: 40,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                              }}
                            />
                          ) : (
                            <Avatar
                              sx={{
                                bgcolor: getAvatarColor(
                                  user.firstName,
                                  user.lastName
                                ),
                                width: 40,
                                height: 40,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                              }}
                            >
                              {getInitials(user.firstName, user.lastName)}
                            </Avatar>
                          )}
                          <Box>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 600 }}
                            >
                              {`${user.firstName} ${user.lastName}`}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Joined {formatDate(user.createdAt).split(",")[0]}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          maxWidth: { xs: "120px", sm: "200px", md: "300px" },
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user.email}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={user.roles[0] || "N/A"}
                          color={getRoleColor(user.roles) as any}
                          size="small"
                          sx={{
                            minWidth: "80px",
                            fontWeight: "bold",
                            textTransform: "capitalize",
                          }}
                          icon={
                            user.roles.includes("Admin") ? (
                              <VerifiedUser
                                sx={{ fontSize: "0.8rem !important" }}
                              />
                            ) : (
                              <></>
                            )
                          }
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={getStatusLabel(
                            user.isActivated,
                            user.isEmailConfirmed
                          )}
                          color={
                            getStatusColor(
                              user.isActivated,
                              user.isEmailConfirmed
                            ) as any
                          }
                          size="small"
                          sx={{
                            minWidth: "80px",
                            fontWeight: "bold",
                            textTransform: "capitalize",
                          }}
                          icon={
                            !user.isActivated ? (
                              <Block sx={{ fontSize: "0.8rem !important" }} />
                            ) : (
                              <></>
                            )
                          }
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                        {formatDate(user.lastLogin)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination controls */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 4,
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Showing {filteredUsers.length} of {totalItems} users
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <FormControl size="small" sx={{ minWidth: 80 }}>
                  <InputLabel id="page-size-label">Per Page</InputLabel>
                  <Select
                    labelId="page-size-label"
                    id="page-size"
                    value={size}
                    label="Per Page"
                    onChange={handleSizeChange}
                  >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                  </Select>
                </FormControl>

                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  showFirstButton
                  showLastButton
                  sx={{
                    "& .MuiPaginationItem-root": {
                      borderRadius: 1,
                    },
                  }}
                />
              </Box>
            </Box>
          </motion.div>
        )}
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this user? This action cannot be
            undone and will remove all user data from the system.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <LoadingButton
            loading={deleteLoading}
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
