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
  Tooltip,
  TableSortLabel,
  type SelectChangeEvent,
  alpha,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem, // Import MenuItem
} from "@mui/material";
import {
  Add,
  Search,
  Edit,
  Delete,
  Dashboard,
  Home,
  Refresh,
  Headphones,
  School,
  ArrowUpward,
  ArrowDownward,
  FilterList,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import type { ISessionItem } from "../../../../types/session";
import { getAllSessions } from "../../../../api/session";
import { useNotification } from "../../../../provider/NotificationProvider";

// Define sort direction type
type SortDirection = "asc" | "desc";

export default function SessionListView() {
  const { showSuccess } = useNotification();
  const navigate = useNavigate();
  const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [sessions, setSessions] = useState<ISessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(
    null
  );
  console.log(selectedSessionId);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [topicId, setTopicId] = useState<number | "">("");

  // Sorting state
  const [sortField, setSortField] = useState<string>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleGetAllSessions = async () => {
    setLoading(true);
    try {
      const response = await getAllSessions({
        page,
        size,
        key: searchTerm,
        topicId,
        sortField,
        sortDirection,
      });

      setSessions(response.items);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetAllSessions();
  }, [page, size, topicId, sortField, sortDirection]); // Refetch when these parameters change

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1) {
        setPage(1); // Reset to page 1 when search changes
      } else {
        handleGetAllSessions();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleSizeChange = (event: SelectChangeEvent<number>) => {
    setSize(event.target.value as number);
    setPage(1); // Reset to page 1 when size changes
  };

  const handleSort = (field: string) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const handleCreateTrack = (sessionId: number) => {
    navigate(`/dashboard/sessions/${sessionId}/create-track`);
  };

  const handleEditSession = (sessionId: number) => {
    navigate(`/dashboard/sessions/${sessionId}/edit`);
  };

  const handleDeleteClick = (sessionId: number) => {
    setSelectedSessionId(sessionId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedSessionId(null);
  };

  const handleDeleteConfirm = async () => {
    // if (selectedSessionId) {
    //   try {
    //     // Sử dụng hàm deleteSession từ api/session.ts
    //     await deleteSession(selectedSessionId);

    //     // Cập nhật UI sau khi xóa
    //     setSessions(
    //       sessions.filter((session) => session.id !== selectedSessionId)
    //     );

    //     // Refetch if this was the last item on the page
    //     if (sessions.length === 1 && page > 1) {
    //       setPage(page - 1);
    //     } else {
    //       fetchSessions();
    //     }
    //   } catch (error) {
    //     console.error("Error deleting session:", error);
    //   }
    // }
    // setDeleteDialogOpen(false);
    // setSelectedSessionId(null);
    console.log("Hello World");
  };

  const handleRefresh = () => {
    handleGetAllSessions();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
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
                <School sx={{ mr: 0.5 }} fontSize="inherit" />
                Sessions
              </Typography>
            </Breadcrumbs>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              gutterBottom
              sx={{ textAlign: "left" }}
            >
              List Session
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your learning sessions and create new tracks
            </Typography>
          </Box>

          <Box sx={{ mt: { xs: 2, md: 0 } }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              // onClick={() => navigate("/admin/sessions/create")}
              onClick={() => showSuccess("Hello World")}
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
              New Session
            </Button>
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
              placeholder="Search sessions..."
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
                <InputLabel id="topic-filter-label">Topic</InputLabel>
                <Select
                  labelId="topic-filter-label"
                  id="topic-filter"
                  value={topicId}
                  label="Topic"
                  onChange={(e) => setTopicId(e.target.value as number | "")}
                >
                  <MenuItem value="">All Topics</MenuItem>
                  <MenuItem value={1}>Everyday English</MenuItem>
                  <MenuItem value={2}>Professional English</MenuItem>
                  <MenuItem value={3}>Travel & Tourism</MenuItem>
                  <MenuItem value={4}>Grammar Mastery</MenuItem>
                  <MenuItem value={5}>Pronunciation & Listening</MenuItem>
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
        ) : sessions.length === 0 ? (
          <Paper
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 2,
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No sessions found
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Try adjusting your search or create a new session.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate("/dashboard/sessions/create")}
            >
              Create New Session
            </Button>
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
              <Table sx={{ minWidth: 650 }} aria-label="sessions table">
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
                        active={sortField === "id"}
                        direction={sortField === "id" ? sortDirection : "asc"}
                        onClick={() => handleSort("id")}
                        IconComponent={
                          sortField === "id" && sortDirection === "asc"
                            ? ArrowUpward
                            : ArrowDownward
                        }
                      >
                        ID
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === "name"}
                        direction={sortField === "name" ? sortDirection : "asc"}
                        onClick={() => handleSort("name")}
                        IconComponent={
                          sortField === "name" && sortDirection === "asc"
                            ? ArrowUpward
                            : ArrowDownward
                        }
                      >
                        Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="center">
                      <TableSortLabel
                        active={sortField === "trackCount"}
                        direction={
                          sortField === "trackCount" ? sortDirection : "asc"
                        }
                        onClick={() => handleSort("trackCount")}
                        IconComponent={
                          sortField === "trackCount" && sortDirection === "asc"
                            ? ArrowUpward
                            : ArrowDownward
                        }
                      >
                        Tracks
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sessions.map((session, index) => (
                    <TableRow
                      key={session.id}
                      sx={{
                        "&:nth-of-type(odd)": {
                          bgcolor: alpha(theme.palette.primary.main, 0.02),
                        },
                        "&:hover": {
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                        },
                        transition: "background-color 0.2s",
                        // Thêm animation với CSS thay vì Framer Motion
                        animation: `fadeIn 0.5s ease-out ${index * 0.05}s both`,
                        "@keyframes fadeIn": {
                          from: { opacity: 0, transform: "translateY(20px)" },
                          to: { opacity: 1, transform: "translateY(0)" },
                        },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {session.id}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          color: theme.palette.text.primary,
                          maxWidth: { xs: "120px", sm: "200px", md: "300px" },
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {session.name}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={session.trackCount}
                          color={session.trackCount > 0 ? "primary" : "default"}
                          size="small"
                          sx={{
                            minWidth: "60px",
                            fontWeight: "bold",
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                          }}
                        >
                          <Tooltip title="Create Track">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleCreateTrack(session.id)}
                              sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                "&:hover": {
                                  bgcolor: alpha(
                                    theme.palette.primary.main,
                                    0.2
                                  ),
                                },
                              }}
                            >
                              <Headphones fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Session">
                            <IconButton
                              size="small"
                              color="info"
                              onClick={() => handleEditSession(session.id)}
                              sx={{
                                bgcolor: alpha(theme.palette.info.main, 0.1),
                                "&:hover": {
                                  bgcolor: alpha(theme.palette.info.main, 0.2),
                                },
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Session">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteClick(session.id)}
                              sx={{
                                bgcolor: alpha(theme.palette.error.main, 0.1),
                                "&:hover": {
                                  bgcolor: alpha(theme.palette.error.main, 0.2),
                                },
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
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
                Showing {sessions.length} of {totalItems} sessions
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
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this session? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
