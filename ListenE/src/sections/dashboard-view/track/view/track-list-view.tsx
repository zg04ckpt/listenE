import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Pagination,
  Select,
  FormControl,
  InputLabel,
  type SelectChangeEvent,
  CircularProgress,
  Paper,
  alpha,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Breadcrumbs,
  Link,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Badge,
} from "@mui/material";
import {
  Search,
  Add,
  Refresh,
  MoreVert,
  Edit,
  Delete,
  GridView,
  ViewList,
  AudioFile,
  MusicNote,
  LibraryMusic,
  Home,
  FilterAlt,
  Clear,
  ArrowUpward,
  ArrowDownward,
  DragIndicator,
  Numbers,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useNotification } from "../../../../provider/NotificationProvider";
import { getAllTracks, deleteTrack } from "../../../../api/track";
import type {
  ITrackResponseItem,
  FetchTracksParams,
} from "../../../../types/track";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

const MotionGrid = motion(Grid);
const MotionCard = motion(Card);
const MotionBox = motion(Box);

export default function TrackListView() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  // State
  const [tracks, setTracks] = useState<ITrackResponseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortField, setSortField] = useState<string>("order");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTrack, setSelectedTrack] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [hoveredTrack, setHoveredTrack] = useState<number | null>(null);
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);

  // Fetch tracks
  const fetchTracks = useCallback(async () => {
    try {
      setLoading(true);
      const params: FetchTracksParams = {
        page,
        size: pageSize,
        name: debouncedSearchTerm,
        sortField,
        sortDirection,
      };

      const response = await getAllTracks(params);
      setTracks(response.items || []);
      setTotalPages(response.totalPages || 1);
      setTotalItems(response.totalItems || 0);
    } catch (error) {
      console.error("Error fetching tracks:", error);
      showError("Failed to load tracks. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [
    page,
    pageSize,
    debouncedSearchTerm,
    sortField,
    sortDirection,
    showError,
  ]);

  // Initial fetch
  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      if (page !== 1) setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, page]);

  // Handlers
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTracks();
    setRefreshing(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };

  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setSortAnchorEl(null);
  };

  const handleViewModeChange = (
    _: React.MouseEvent<HTMLElement>,
    newMode: "grid" | "list" | null
  ) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    trackId: number
  ) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedTrack(trackId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleSortOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleEditTrack = (trackId: number) => {
    navigate(`/dashboard/tracks/${trackId}/edit-track`);
    handleMenuClose();
  };

  const handleDeleteClick = (trackId: number) => {
    setSelectedTrack(trackId);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedTrack(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedTrack) {
      setDeleteLoading(true);
      try {
        await deleteTrack(selectedTrack);
        setTracks(tracks.filter((track) => track.id !== selectedTrack));
        showSuccess("Track deleted successfully");
        setDeleteDialogOpen(false);
        setSelectedTrack(null);

        // If we deleted the last item on the page, go to previous page
        if (tracks.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          fetchTracks();
        }
      } catch (error) {
        console.error("Error deleting track:", error);
        showError("Failed to delete track. Please try again.");
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  // Render functions
  const renderGridView = () => (
    <AnimatePresence>
      <motion.div variants={container} initial="hidden" animate="show">
        <Grid container spacing={3}>
          {tracks.map((track) => (
            <MotionGrid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={track.id}
              variants={item}
            >
              <MotionCard
                sx={{
                  height: "100%",
                  transition: "all 0.3s ease",
                  transform:
                    hoveredTrack === track.id ? "translateY(-8px)" : "none",
                  boxShadow:
                    hoveredTrack === track.id
                      ? "0 12px 28px rgba(0, 0, 0, 0.15)"
                      : "0 8px 16px rgba(0, 0, 0, 0.08)",
                  borderRadius: 3,
                  overflow: "hidden",
                  position: "relative",
                  cursor: "pointer",
                }}
                onMouseEnter={() => setHoveredTrack(track.id)}
                onMouseLeave={() => setHoveredTrack(null)}
              >
                <Box
                  sx={{
                    height: 80,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: `1px solid ${alpha(
                      theme.palette.primary.main,
                      0.2
                    )}`,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 50,
                      height: 50,
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                      color: theme.palette.primary.main,
                    }}
                  >
                    <AudioFile sx={{ fontSize: 28 }} />
                  </Avatar>
                </Box>

                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {track.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuOpen(e, track.id);
                      }}
                      sx={{
                        opacity: hoveredTrack === track.id ? 1 : 0.5,
                        transition: "opacity 0.2s",
                      }}
                    >
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      gap: 1,
                    }}
                  >
                    <Chip
                      icon={<Numbers />}
                      label={`Order: ${track.order}`}
                      size="small"
                      variant="outlined"
                      sx={{ borderRadius: 1 }}
                    />
                    <Badge
                      badgeContent={track.id}
                      color="primary"
                      sx={{
                        "& .MuiBadge-badge": {
                          fontSize: "0.7rem",
                          height: 18,
                          minWidth: 18,
                        },
                      }}
                    >
                      <Chip
                        icon={<DragIndicator />}
                        label="ID"
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 1 }}
                      />
                    </Badge>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
                  >
                    <Tooltip title="Edit Track">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTrack(track.id);
                        }}
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.2),
                          },
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Track">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(track.id);
                        }}
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
                </CardContent>
              </MotionCard>
            </MotionGrid>
          ))}
        </Grid>
      </motion.div>
    </AnimatePresence>
  );

  const renderListView = () => (
    <AnimatePresence>
      <motion.div variants={container} initial="hidden" animate="show">
        <Stack spacing={2}>
          {tracks.map((track) => (
            <MotionCard
              key={track.id}
              variants={item}
              sx={{
                transition: "all 0.3s ease",
                transform:
                  hoveredTrack === track.id ? "translateY(-4px)" : "none",
                boxShadow:
                  hoveredTrack === track.id
                    ? "0 8px 16px rgba(0, 0, 0, 0.15)"
                    : "0 4px 8px rgba(0, 0, 0, 0.08)",
                borderRadius: 3,
                overflow: "hidden",
                cursor: "pointer",
              }}
              onMouseEnter={() => setHoveredTrack(track.id)}
              onMouseLeave={() => setHoveredTrack(null)}
            >
              <CardContent sx={{ p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          mr: 2,
                        }}
                      >
                        <AudioFile />
                      </Avatar>
                      <Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: { xs: "200px", sm: "250px", md: "300px" },
                          }}
                        >
                          {track.name}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 0.5,
                          }}
                        >
                          <Chip
                            label={`Order: ${track.order}`}
                            size="small"
                            variant="outlined"
                            sx={{ height: 20, fontSize: "0.7rem" }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            ID: {track.id}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={8}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1,
                      }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Edit />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTrack(track.id);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<Delete />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(track.id);
                        }}
                      >
                        Delete
                      </Button>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMenuOpen(e, track.id);
                        }}
                      >
                        <MoreVert fontSize="small" />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </MotionCard>
          ))}
        </Stack>
      </motion.div>
    </AnimatePresence>
  );

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          underline="hover"
          color="inherit"
          sx={{ display: "flex", alignItems: "center" }}
          onClick={() => navigate("/dashboard")}
          style={{ cursor: "pointer" }}
        >
          <Home sx={{ mr: 0.5 }} fontSize="inherit" />
          Dashboard
        </Link>
        <Typography
          color="text.primary"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <LibraryMusic sx={{ mr: 0.5 }} fontSize="inherit" />
          Tracks
        </Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          Track Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your audio tracks for English learning. Create, edit, and
          organize tracks by order.
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 4,
          borderRadius: 3,
          bgcolor: alpha(theme.palette.primary.main, 0.03),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search tracks..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleClearSearch}>
                      <Clear fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ bgcolor: "background.paper", borderRadius: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: { xs: "flex-start", md: "flex-end" },
              }}
            >
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleRefresh}
                disabled={refreshing}
                sx={{ borderRadius: 2 }}
              >
                {refreshing ? "Refreshing..." : "Refresh"}
              </Button>
              <Button
                variant="outlined"
                startIcon={<FilterAlt />}
                onClick={handleSortOpen}
                sx={{ borderRadius: 2 }}
              >
                Sort
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate("/dashboard/create-track")}
                sx={{
                  borderRadius: 2,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                  boxShadow: `0 3px 5px 2px ${alpha(
                    theme.palette.primary.main,
                    0.3
                  )}`,
                }}
              >
                New Track
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="subtitle1">
          {loading ? (
            <Chip
              icon={<CircularProgress size={16} />}
              label="Loading tracks..."
              variant="outlined"
            />
          ) : (
            <Chip
              icon={<LibraryMusic />}
              label={`${totalItems} tracks found`}
              variant="outlined"
              color="primary"
            />
          )}
        </Typography>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          size="small"
        >
          <ToggleButton value="grid" aria-label="grid view">
            <GridView fontSize="small" />
          </ToggleButton>
          <ToggleButton value="list" aria-label="list view">
            <ViewList fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {loading ? (
        <Box sx={{ py: 8, textAlign: "center" }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Loading tracks...
          </Typography>
        </Box>
      ) : tracks.length === 0 ? (
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 3,
            bgcolor: alpha(theme.palette.primary.main, 0.03),
            border: `1px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          <MusicNote
            sx={{
              fontSize: 60,
              color: alpha(theme.palette.primary.main, 0.3),
              mb: 2,
            }}
          />
          <Typography variant="h6" gutterBottom>
            No tracks found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm
              ? `No tracks matching "${searchTerm}"`
              : "There are no tracks available. Create your first track to get started."}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/dashboard/create-track")}
            sx={{ borderRadius: 8 }}
          >
            Create New Track
          </Button>
        </Paper>
      ) : (
        <Box>{viewMode === "grid" ? renderGridView() : renderListView()}</Box>
      )}

      {!loading && tracks.length > 0 && (
        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="page-size-label">Per Page</InputLabel>
            <Select
              labelId="page-size-label"
              value={pageSize}
              onChange={handlePageSizeChange}
              label="Per Page"
            >
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={12}>12</MenuItem>
              <MenuItem value={24}>24</MenuItem>
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
                borderRadius: 2,
              },
            }}
          />
        </Box>
      )}

      {/* Track Actions Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 180,
            borderRadius: 2,
            "& .MuiMenuItem-root": {
              px: 2,
              py: 1.5,
              borderRadius: 1,
              mx: 0.5,
              my: 0.25,
            },
          },
        }}
      >
        <MenuItem
          onClick={() => selectedTrack && handleEditTrack(selectedTrack)}
        >
          <ListItemIcon>
            <Edit fontSize="small" color="info" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem
          onClick={() => selectedTrack && handleDeleteClick(selectedTrack)}
        >
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ color: "error" }}>
            Delete
          </ListItemText>
        </MenuItem>
      </Menu>

      {/* Sort Menu */}
      <Menu
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={handleSortClose}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 200,
            borderRadius: 2,
            "& .MuiMenuItem-root": {
              px: 2,
              py: 1.5,
              borderRadius: 1,
              mx: 0.5,
              my: 0.25,
            },
          },
        }}
      >
        <MenuItem onClick={() => handleSortChange("id")}>
          <ListItemIcon>
            {sortField === "id" ? (
              sortDirection === "asc" ? (
                <ArrowUpward fontSize="small" color="primary" />
              ) : (
                <ArrowDownward fontSize="small" color="primary" />
              )
            ) : (
              <span style={{ width: 24 }} />
            )}
          </ListItemIcon>
          <ListItemText
            primary="ID"
            primaryTypographyProps={{
              color: sortField === "id" ? "primary" : "inherit",
            }}
          />
        </MenuItem>
        <MenuItem onClick={() => handleSortChange("name")}>
          <ListItemIcon>
            {sortField === "name" ? (
              sortDirection === "asc" ? (
                <ArrowUpward fontSize="small" color="primary" />
              ) : (
                <ArrowDownward fontSize="small" color="primary" />
              )
            ) : (
              <span style={{ width: 24 }} />
            )}
          </ListItemIcon>
          <ListItemText
            primary="Name"
            primaryTypographyProps={{
              color: sortField === "name" ? "primary" : "inherit",
            }}
          />
        </MenuItem>
        <MenuItem onClick={() => handleSortChange("order")}>
          <ListItemIcon>
            {sortField === "order" ? (
              sortDirection === "asc" ? (
                <ArrowUpward fontSize="small" color="primary" />
              ) : (
                <ArrowDownward fontSize="small" color="primary" />
              )
            ) : (
              <span style={{ width: 24 }} />
            )}
          </ListItemIcon>
          <ListItemText
            primary="Order"
            primaryTypographyProps={{
              color: sortField === "order" ? "primary" : "inherit",
            }}
          />
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Track</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this track? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            disabled={deleteLoading}
            startIcon={
              deleteLoading ? <CircularProgress size={20} /> : <Delete />
            }
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
