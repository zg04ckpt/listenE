import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Breadcrumbs,
  Link,
  Skeleton,
  Divider,
  Chip,
  Avatar,
  useTheme,
  alpha,
  CardActionArea,
  CardMedia,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack,
  Home,
  LocalOffer,
  QuestionAnswer,
  Tag as TagIcon,
  PlayArrow,
  Info,
  MenuBook,
  School,
  Headphones,
  VolumeUp,
  Bookmark,
  BookmarkBorder,
  Search,
  Refresh,
  GraphicEq,
  Audiotrack,
  Numbers,
  ArrowUpward,
  ArrowDownward,
  ViewList,
  PlaylistPlay,
  Layers,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import type { ITopicItem } from "../types/topic";
import type { ITagItem } from "../types/tag";
import type { ITrackResponseItem } from "../types/track";
import { getDetailsTopic } from "../api/topic";
import { getAllTags } from "../api/tag";
import { getAllTracks } from "../api/track";

export default function TopicDetailsPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const [topic, setTopic] = useState<ITopicItem | null>(null);
  const [tags, setTags] = useState<ITagItem[]>([]);
  const [tracks, setTracks] = useState<ITrackResponseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tracksLoading, setTracksLoading] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [favoriteTracks, setFavoriteTracks] = useState<number[]>([]);
  const [hoveredTag, setHoveredTag] = useState<number | null>(null);
  const [hoveredTrack, setHoveredTrack] = useState<number | null>(null);
  const [isBasicPractice, setIsBasicPractice] = useState(false);

  // Track pagination state
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("order");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchTopicAndTags = async (topicId: number) => {
    setLoading(true);
    try {
      // Fetch topic details
      const topicRes = await getDetailsTopic(topicId);
      const topicData = topicRes?.data?.data;
      setTopic(topicData);

      // Check if topic type is BasicPractice
      const isBasic = topicData?.type === "BasicPractice";
      setIsBasicPractice(isBasic);

      if (topicData?.type) {
        if (isBasic) {
          // For BasicPractice, we'll fetch tracks instead of tags
          await fetchTracks();
        } else {
          // For other types, fetch tags as usual
          const tagsRes = await getAllTags({ type: topicData.type });
          setTags(tagsRes?.items || []);
        }
      }
    } catch (error) {
      console.error("Error fetching topic and tags:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTracks = useCallback(async () => {
    setTracksLoading(true);
    try {
      const response = await getAllTracks({
        page,
        size,
        name: searchTerm,
        sortField,
        sortDirection,
      });

      setTracks(response.items || []);
      setTotalPages(response.totalPages || 1);
      setTotalItems(response.totalItems || 0);
    } catch (error) {
      console.error("Error fetching tracks:", error);
    } finally {
      setTracksLoading(false);
    }
  }, [page, size, searchTerm, sortField, sortDirection]);

  useEffect(() => {
    if (topicId) fetchTopicAndTags(Number(topicId));

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem("favoriteTags");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    const savedFavoriteTracks = localStorage.getItem("favoriteTracks");
    if (savedFavoriteTracks) {
      setFavoriteTracks(JSON.parse(savedFavoriteTracks));
    }
  }, [topicId]);

  useEffect(() => {
    if (isBasicPractice) {
      fetchTracks();
    }
  }, [isBasicPractice, fetchTracks, refreshKey]);

  const handleTagClick = (tagId: number) => {
    // Navigate to questions page filtered by tag
    navigate(`/topic/${topicId}/tag/${tagId}/questions`);
  };

  const handleTrackPracticeAll = (trackId: number) => {
    // Navigate to track practice page (current logic)
    navigate(`/topic/${topicId}/track/${trackId}`);
  };

  const handleTrackPracticeSegments = (trackId: number) => {
    // Navigate to track segments page
    navigate(`/topic/${topicId}/track/${trackId}/segments`);
  };

  const toggleFavorite = (tagId: number, event: React.MouseEvent) => {
    event.stopPropagation();

    const newFavorites = favorites.includes(tagId)
      ? favorites.filter((id) => id !== tagId)
      : [...favorites, tagId];

    setFavorites(newFavorites);
    localStorage.setItem("favoriteTags", JSON.stringify(newFavorites));
  };

  const toggleFavoriteTrack = (trackId: number, event: React.MouseEvent) => {
    event.stopPropagation();

    const newFavorites = favoriteTracks.includes(trackId)
      ? favoriteTracks.filter((id) => id !== trackId)
      : [...favoriteTracks, trackId];

    setFavoriteTracks(newFavorites);
    localStorage.setItem("favoriteTracks", JSON.stringify(newFavorites));
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleSizeChange = (event: SelectChangeEvent<number>) => {
    setSize(Number(event.target.value));
    setPage(1); // Reset to first page when changing size
  };

  const handleSortChange = (field: string) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset to first page when searching
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

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

  const getTagIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "part1":
        return <School />;
      case "part2":
        return <VolumeUp />;
      case "part3":
        return <Headphones />;
      case "part4":
        return <MenuBook />;
      default:
        return <LocalOffer />;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ pb: 6, pt: 10 }}>
        <Skeleton variant="text" height={30} width={200} />
        <Skeleton
          variant="rectangular"
          height={200}
          sx={{ my: 3, borderRadius: 2 }}
        />
        <Skeleton variant="text" height={40} />
        <Skeleton variant="text" height={100} />

        <Box sx={{ mt: 4 }}>
          <Skeleton variant="text" height={40} width={150} />
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {Array.from(new Array(6)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Skeleton
                  variant="rectangular"
                  height={160}
                  sx={{ borderRadius: 2 }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    );
  }

  if (!topic) {
    return (
      <Container maxWidth="lg" sx={{ pb: 6, pt: 10 }}>
        <Typography variant="h4">Topic not found</Typography>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/")}
          sx={{ mt: 2 }}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ pb: 6, pt: 10 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Breadcrumbs sx={{ mb: 3 }}>
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
            onClick={() => navigate("/topics")}
            style={{ cursor: "pointer" }}
          >
            <MenuBook sx={{ mr: 0.5 }} fontSize="inherit" />
            Topics
          </Link>
          <Typography color="text.primary">{topic.name}</Typography>
        </Breadcrumbs>

        {/* Topic Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card
            elevation={2}
            sx={{
              mb: 5,
              borderRadius: 3,
              overflow: "hidden",
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.primary.main,
                0.05
              )} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    topic.thumbnailUrl ||
                    "/placeholder.svg?height=200&width=1200"
                  }
                  alt={topic.name}
                  sx={{
                    objectFit: "cover",
                    filter: "brightness(0.85)",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    bgcolor: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    p: 3,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Button
                      startIcon={<ArrowBack />}
                      onClick={() => window.history.back()}
                      sx={{
                        mr: 2,
                        color: "white",
                        borderColor: "rgba(255,255,255,0.5)",
                      }}
                      variant="outlined"
                      size="small"
                    >
                      Back
                    </Button>
                    <Typography
                      variant="h4"
                      component="h1"
                      sx={{ fontWeight: 700 }}
                    >
                      {topic.name}
                    </Typography>
                    {topic.type && (
                      <Chip
                        label={topic.type}
                        size="small"
                        color="primary"
                        icon={<TagIcon fontSize="small" />}
                        sx={{ ml: 2, fontWeight: 500 }}
                      />
                    )}
                  </Box>
                </Box>
              </Box>

              <Box sx={{ p: 3 }}>
                <Typography variant="body1" paragraph>
                  {topic.description}
                </Typography>

                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                  <Chip
                    icon={<Info />}
                    label={`Type: ${topic.type}`}
                    variant="outlined"
                    color="primary"
                  />
                  {isBasicPractice ? (
                    <Chip
                      icon={<Audiotrack />}
                      label={`${totalItems} Tracks Available`}
                      variant="outlined"
                      color="info"
                    />
                  ) : (
                    <Chip
                      icon={<QuestionAnswer />}
                      label={`${tags.length} Tags Available`}
                      variant="outlined"
                      color="info"
                    />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {isBasicPractice ? (
          // TRACKS SECTION FOR BASIC PRACTICE
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  mt: 6,
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  "&:after": {
                    content: '""',
                    position: "absolute",
                    bottom: -8,
                    left: 0,
                    width: 60,
                    height: 4,
                    borderRadius: 2,
                    bgcolor: theme.palette.primary.main,
                  },
                }}
              >
                <Audiotrack sx={{ mr: 1 }} />
                Available Tracks ({totalItems})
              </Typography>

              <Tooltip title="Refresh tracks">
                <IconButton
                  onClick={handleRefresh}
                  color="primary"
                  sx={{
                    animation: tracksLoading
                      ? "spin 1s linear infinite"
                      : "none",
                    "@keyframes spin": {
                      "0%": { transform: "rotate(0deg)" },
                      "100%": { transform: "rotate(360deg)" },
                    },
                  }}
                >
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose how you want to practice: segment by segment or the entire
              track
            </Typography>

            {/* Search and Filter Controls */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 2,
                  mb: 4,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <TextField
                  placeholder="Search tracks..."
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={searchTerm}
                  onChange={handleSearchChange}
                  sx={{ maxWidth: { xs: "100%", md: "300px" } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />

                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Sort by:
                    </Typography>
                    <Button
                      size="small"
                      variant={sortField === "order" ? "contained" : "outlined"}
                      onClick={() => handleSortChange("order")}
                      endIcon={
                        sortField === "order" ? (
                          sortDirection === "asc" ? (
                            <ArrowUpward />
                          ) : (
                            <ArrowDownward />
                          )
                        ) : null
                      }
                    >
                      Order
                    </Button>
                    <Button
                      size="small"
                      variant={sortField === "name" ? "contained" : "outlined"}
                      onClick={() => handleSortChange("name")}
                      endIcon={
                        sortField === "name" ? (
                          sortDirection === "asc" ? (
                            <ArrowUpward />
                          ) : (
                            <ArrowDownward />
                          )
                        ) : null
                      }
                    >
                      Name
                    </Button>
                  </Box>

                  <FormControl size="small" sx={{ minWidth: 80 }}>
                    <InputLabel id="page-size-label">Show</InputLabel>
                    <Select
                      labelId="page-size-label"
                      value={size}
                      label="Show"
                      onChange={handleSizeChange}
                    >
                      <MenuItem value={6}>6</MenuItem>
                      <MenuItem value={12}>12</MenuItem>
                      <MenuItem value={24}>24</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </motion.div>

            <Divider sx={{ mb: 4 }} />

            {tracksLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress />
              </Box>
            ) : tracks.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  No tracks available
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {searchTerm
                    ? `No results found for "${searchTerm}"`
                    : "Tracks will appear here when available"}
                </Typography>
                {searchTerm && (
                  <Button
                    variant="outlined"
                    sx={{ mt: 2 }}
                    onClick={() => setSearchTerm("")}
                  >
                    Clear Search
                  </Button>
                )}
              </Box>
            ) : (
              <motion.div variants={container} initial="hidden" animate="show">
                <Grid container spacing={3}>
                  {tracks.map((track) => (
                    <Grid item xs={12} sm={6} md={4} key={track.id}>
                      <motion.div
                        variants={item}
                        onHoverStart={() => setHoveredTrack(track.id)}
                        onHoverEnd={() => setHoveredTrack(null)}
                        whileHover={{ scale: 1.02 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 15,
                        }}
                      >
                        <Card
                          sx={{
                            height: "100%",
                            transition: "all 0.3s ease",
                            boxShadow:
                              hoveredTrack === track.id
                                ? "0 12px 28px rgba(0, 0, 0, 0.15)"
                                : "0 8px 16px rgba(0, 0, 0, 0.08)",
                            borderRadius: 3,
                            overflow: "hidden",
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            background: `linear-gradient(135deg, ${alpha(
                              theme.palette.background.paper,
                              1
                            )} 0%, ${alpha(
                              theme.palette.background.paper,
                              0.9
                            )} 100%)`,
                          }}
                        >
                          {favoriteTracks.includes(track.id) && (
                            <Box
                              sx={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                bgcolor: "warning.main",
                                color: "white",
                                px: 2,
                                py: 0.5,
                                borderBottomLeftRadius: 8,
                                zIndex: 1,
                                fontSize: "0.75rem",
                                fontWeight: "bold",
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Bookmark fontSize="small" />
                              Favorite
                            </Box>
                          )}

                          <CardContent
                            sx={{
                              p: 3,
                              flexGrow: 1,
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 2,
                                justifyContent: "space-between",
                              }}
                            >
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <Avatar
                                  sx={{
                                    bgcolor: alpha(
                                      theme.palette.primary.main,
                                      0.1
                                    ),
                                    color: theme.palette.primary.main,
                                    width: 48,
                                    height: 48,
                                    mr: 2,
                                  }}
                                >
                                  <GraphicEq />
                                </Avatar>
                                <Box>
                                  <Typography
                                    variant="h6"
                                    component="h3"
                                    sx={{
                                      fontWeight: 600,
                                      display: "-webkit-box",
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: "vertical",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      minHeight: "3.2em",
                                    }}
                                  >
                                    {track.name}
                                  </Typography>
                                  <Chip
                                    label={`Order: ${track.order}`}
                                    size="small"
                                    sx={{
                                      mt: 0.5,
                                      bgcolor: alpha(
                                        theme.palette.info.main,
                                        0.1
                                      ),
                                      color: theme.palette.info.main,
                                      fontWeight: 500,
                                    }}
                                    variant="outlined"
                                  />
                                </Box>
                              </Box>

                              <Tooltip
                                title={
                                  favoriteTracks.includes(track.id)
                                    ? "Remove from favorites"
                                    : "Add to favorites"
                                }
                              >
                                <IconButton
                                  onClick={(e) =>
                                    toggleFavoriteTrack(track.id, e)
                                  }
                                  color={
                                    favoriteTracks.includes(track.id)
                                      ? "warning"
                                      : "default"
                                  }
                                  sx={{
                                    opacity:
                                      hoveredTrack === track.id ||
                                      favoriteTracks.includes(track.id)
                                        ? 1
                                        : 0.3,
                                    transition: "opacity 0.3s ease",
                                  }}
                                >
                                  {favoriteTracks.includes(track.id) ? (
                                    <Bookmark />
                                  ) : (
                                    <BookmarkBorder />
                                  )}
                                </IconButton>
                              </Tooltip>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 3, flexGrow: 1 }}
                            >
                              Practice this track with audio exercises. Choose
                              between segment-by-segment practice or complete
                              track practice.
                            </Typography>

                            {/* Action Buttons */}
                            <Box sx={{ mt: "auto" }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 2,
                                  justifyContent: "center",
                                  mt: 2,
                                }}
                              >
                                <Button
                                  variant="contained"
                                  size="medium"
                                  startIcon={<ViewList />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTrackPracticeSegments(track.id);
                                  }}
                                  sx={{
                                    borderRadius: 2,
                                    px: 2,
                                    py: 1,
                                    background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.secondary.light} 90%)`,
                                    boxShadow: `0 3px 5px 2px ${alpha(
                                      theme.palette.secondary.main,
                                      0.3
                                    )}`,
                                    "&:hover": {
                                      background: `linear-gradient(45deg, ${theme.palette.secondary.dark} 30%, ${theme.palette.secondary.main} 90%)`,
                                      transform: "translateY(-2px)",
                                    },
                                    transition: "transform 0.2s",
                                    flexGrow: 1,
                                  }}
                                >
                                  Practice Segments
                                </Button>
                                <Button
                                  variant="contained"
                                  size="medium"
                                  startIcon={<PlaylistPlay />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTrackPracticeAll(track.id);
                                  }}
                                  sx={{
                                    borderRadius: 2,
                                    px: 2,
                                    py: 1,
                                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                                    boxShadow: `0 3px 5px 2px ${alpha(
                                      theme.palette.primary.main,
                                      0.3
                                    )}`,
                                    "&:hover": {
                                      background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                                      transform: "translateY(-2px)",
                                    },
                                    transition: "transform 0.2s",
                                    flexGrow: 1,
                                  }}
                                >
                                  Practice All
                                </Button>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            )}

            {/* Pagination */}
            {!tracksLoading && tracks.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 4,
                    mb: 2,
                  }}
                >
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                    size="large"
                    sx={{
                      "& .MuiPaginationItem-root": {
                        transition: "all 0.2s",
                        "&:hover": {
                          transform: "scale(1.1)",
                        },
                        "&.Mui-selected": {
                          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                          color: "white",
                          fontWeight: "bold",
                        },
                      },
                    }}
                  />
                </Box>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    Showing {tracks.length} of {totalItems} tracks
                  </Typography>
                </Box>
              </motion.div>
            )}
          </>
        ) : (
          // TAGS SECTION FOR OTHER TOPIC TYPES (unchanged)
          <>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 600,
                mt: 6,
                display: "flex",
                alignItems: "center",
                position: "relative",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  bottom: -8,
                  left: 0,
                  width: 60,
                  height: 4,
                  borderRadius: 2,
                  bgcolor: theme.palette.primary.main,
                },
              }}
            >
              <LocalOffer sx={{ mr: 1 }} />
              Available Tags ({tags.length})
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Click on a tag to view all questions in that category
            </Typography>
            <Divider sx={{ mb: 4 }} />

            {tags.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No tags available for this topic type
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Tags with type "{topic.type}" will appear here
                </Typography>
              </Box>
            ) : (
              <motion.div variants={container} initial="hidden" animate="show">
                <Grid container spacing={3}>
                  {tags.map((tag) => (
                    <Grid item xs={12} sm={6} md={4} key={tag.id}>
                      <motion.div
                        variants={item}
                        onHoverStart={() => setHoveredTag(tag.id)}
                        onHoverEnd={() => setHoveredTag(null)}
                      >
                        <Card
                          sx={{
                            height: "100%",
                            transition: "all 0.3s ease",
                            transform:
                              hoveredTag === tag.id
                                ? "translateY(-8px)"
                                : "none",
                            boxShadow:
                              hoveredTag === tag.id
                                ? "0 12px 28px rgba(0, 0, 0, 0.15)"
                                : "0 8px 16px rgba(0, 0, 0, 0.08)",
                            borderRadius: 3,
                            overflow: "hidden",
                            position: "relative",
                          }}
                        >
                          {favorites.includes(tag.id) && (
                            <Box
                              sx={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                bgcolor: "warning.main",
                                color: "white",
                                px: 2,
                                py: 0.5,
                                borderBottomLeftRadius: 8,
                                zIndex: 1,
                                fontSize: "0.75rem",
                                fontWeight: "bold",
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Bookmark fontSize="small" />
                              Favorite
                            </Box>
                          )}

                          <CardActionArea
                            onClick={() => handleTagClick(tag.id)}
                            sx={{ height: "100%" }}
                          >
                            <CardContent sx={{ p: 3 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mb: 2,
                                  justifyContent: "space-between",
                                }}
                              >
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <Avatar
                                    sx={{
                                      bgcolor: alpha(
                                        theme.palette.primary.main,
                                        0.1
                                      ),
                                      color: theme.palette.primary.main,
                                      width: 48,
                                      height: 48,
                                      mr: 2,
                                    }}
                                  >
                                    {getTagIcon(tag.type)}
                                  </Avatar>
                                  <Box>
                                    <Typography
                                      variant="h6"
                                      component="h3"
                                      sx={{
                                        fontWeight: 600,
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        minHeight: "3.2em",
                                      }}
                                    >
                                      {tag.name}
                                    </Typography>
                                    <Chip
                                      label={tag.type}
                                      size="small"
                                      color="info"
                                      variant="outlined"
                                      sx={{ mt: 0.5 }}
                                    />
                                  </Box>
                                </Box>

                                <Tooltip
                                  title={
                                    favorites.includes(tag.id)
                                      ? "Remove from favorites"
                                      : "Add to favorites"
                                  }
                                >
                                  <IconButton
                                    onClick={(e) => toggleFavorite(tag.id, e)}
                                    color={
                                      favorites.includes(tag.id)
                                        ? "warning"
                                        : "default"
                                    }
                                    sx={{
                                      opacity:
                                        hoveredTag === tag.id ||
                                        favorites.includes(tag.id)
                                          ? 1
                                          : 0.3,
                                      transition: "opacity 0.3s ease",
                                    }}
                                  >
                                    {favorites.includes(tag.id) ? (
                                      <Bookmark />
                                    ) : (
                                      <BookmarkBorder />
                                    )}
                                  </IconButton>
                                </Tooltip>
                              </Box>

                              <Divider sx={{ my: 2 }} />

                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 2 }}
                              >
                                Practice questions related to {tag.name} in the{" "}
                                {topic.name} topic.
                              </Typography>

                              <AnimatePresence>
                                {hoveredTag === tag.id && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        mt: 2,
                                      }}
                                    >
                                      <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={<PlayArrow />}
                                        sx={{
                                          borderRadius: 6,
                                          px: 2,
                                          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                                          boxShadow: `0 3px 5px 2px ${alpha(
                                            theme.palette.primary.main,
                                            0.3
                                          )}`,
                                        }}
                                      >
                                        Start Practice
                                      </Button>
                                    </Box>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            )}
          </>
        )}

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay:
              0.5 +
              Math.min(isBasicPractice ? tracks.length : tags.length, 6) * 0.1,
          }}
        >
          <Box
            sx={{
              mt: 6,
              p: 4,
              borderRadius: 3,
              textAlign: "center",
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.info.main,
                0.05
              )} 0%, ${alpha(theme.palette.info.main, 0.15)} 100%)`,
              border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
            }}
          >
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Ready to improve your English skills?
            </Typography>
            <Typography variant="body1" paragraph>
              {isBasicPractice
                ? "Choose a track above to start practicing with audio exercises."
                : "Choose a tag above to start practicing with interactive exercises."}
            </Typography>
            <Button
              variant="contained"
              color="info"
              size="large"
              onClick={() => navigate("/topics")}
              startIcon={<MenuBook />}
              sx={{
                mt: 1,
                borderRadius: 6,
                px: 3,
                py: 1,
                background: `linear-gradient(45deg, ${theme.palette.info.main} 30%, ${theme.palette.info.light} 90%)`,
                boxShadow: `0 3px 5px 2px ${alpha(
                  theme.palette.info.main,
                  0.3
                )}`,
              }}
            >
              Explore More Topics
            </Button>
          </Box>
        </motion.div>
      </motion.div>
    </Container>
  );
}
