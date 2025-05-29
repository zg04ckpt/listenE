import type React from "react";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  IconButton,
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
  MenuItem,
  Badge,
  Avatar,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Dashboard,
  Home,
  Refresh,
  ArrowUpward,
  ArrowDownward,
  MenuBook,
  QuestionAnswer,
  Image as ImageIcon,
  AudioFile,
  Tag,
  Clear,
  FilterAlt,
  PlayArrow,
  Groups,
  FormatListNumbered,
  ViewList,
  ViewModule,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { motion, AnimatePresence } from "framer-motion";
import {
  getAllQuestions,
  deleteQuestion,
  getAllGroups,
  deleteGroup,
} from "../../../../api/question";
import { getAllTags } from "../../../../api/tag";
import { useNotification } from "../../../../provider/NotificationProvider";
import type {
  IQuestionResponseItem,
  FetchQuestionsParams,
  IGroupResponseItem,
} from "../../../../types/question";
import type { ITagItem } from "../../../../types/tag";

// Define question type display names and colors
const QUESTION_TYPE_CONFIG: Record<
  string,
  { label: string; color: string; icon: React.ElementType }
> = {
  Part1: { label: "Part 1 (Image & Audio)", color: "#4CAF50", icon: ImageIcon }, // Green
  Part2: { label: "Part 2 (Audio Only)", color: "#2196F3", icon: AudioFile }, // Blue
  Part3: { label: "Part 3 (Conversation)", color: "#9C27B0", icon: Groups }, // Purple
  Part4: {
    label: "Part 4 (Short Talk)",
    color: "#FF9800",
    icon: FormatListNumbered,
  }, // Orange
};

// Define sort direction type
type SortDirection = "asc" | "desc";

export default function QuestionListView() {
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  const theme = useTheme();

  const [questions, setQuestions] = useState<IQuestionResponseItem[]>([]);
  const [groups, setGroups] = useState<IGroupResponseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupsLoading, setGroupsLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
    null
  );
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>("");
  const [filterTag, setFilterTag] = useState<number | "">("");
  const [showFilters, setShowFilters] = useState(false);
  const [tags, setTags] = useState<ITagItem[]>([]);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [activeTab, setActiveTab] = useState<"questions" | "groups">(
    "questions"
  );

  // Pagination state
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Group pagination state
  const [groupPage, setGroupPage] = useState(1);
  const [groupSize, setGroupSize] = useState(10);
  const [groupTotalPages, setGroupTotalPages] = useState(1);
  const [groupTotalItems, setGroupTotalItems] = useState(0);

  // Sorting state
  const [sortField, setSortField] = useState<string>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Group sorting state
  const [groupSortField, setGroupSortField] = useState<string>("groupId");
  const [groupSortDirection, setGroupSortDirection] =
    useState<SortDirection>("desc");

  // Fetch all tags
  useEffect(() => {
    const fetchTags = async () => {
      setTagsLoading(true);
      try {
        const response = await getAllTags();
        if (response?.items) {
          setTags(response.items);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
        showError("Failed to load tags. Please try again.");
      } finally {
        setTagsLoading(false);
      }
    };

    fetchTags();
  }, []);

  const handleGetAllQuestions = async () => {
    setLoading(true);
    try {
      const params: FetchQuestionsParams = {
        page,
        size,
        type: filterType || undefined,
        tagId: filterTag ? Number(filterTag) : undefined,
        sortField,
        sortDirection,
      };

      const response = await getAllQuestions(params);

      setQuestions(response.items);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
    } catch (error) {
      console.error("Error fetching questions:", error);
      showError("Failed to load questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetAllGroups = async () => {
    setGroupsLoading(true);
    try {
      const params: FetchQuestionsParams = {
        page: groupPage,
        size: groupSize,
        type: filterType || undefined,
        tagId: filterTag ? Number(filterTag) : undefined,
        sortField: groupSortField,
        sortDirection: groupSortDirection,
      };

      const response = await getAllGroups(params);

      setGroups(response.items);
      setGroupTotalPages(response.totalPages);
      setGroupTotalItems(response.totalItems);
    } catch (error) {
      console.error("Error fetching question groups:", error);
      showError("Failed to load question groups. Please try again.");
    } finally {
      setGroupsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "questions") {
      handleGetAllQuestions();
    } else {
      handleGetAllGroups();
    }
  }, [
    activeTab,
    page,
    size,
    sortField,
    sortDirection,
    groupPage,
    groupSize,
    groupSortField,
    groupSortDirection,
    filterType,
    filterTag,
  ]); // Refetch when these parameters change

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === "questions") {
        if (page !== 1) {
          setPage(1); // Reset to page 1 when search changes
        } else {
          handleGetAllQuestions();
        }
      } else {
        if (groupPage !== 1) {
          setGroupPage(1); // Reset to page 1 when search changes
        } else {
          handleGetAllGroups();
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, activeTab]);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    if (activeTab === "questions") {
      setPage(value);
    } else {
      setGroupPage(value);
    }
  };

  const handleSizeChange = (event: SelectChangeEvent<number>) => {
    const newSize = event.target.value as number;
    if (activeTab === "questions") {
      setSize(newSize);
      setPage(1);
    } else {
      setGroupSize(newSize);
      setGroupPage(1);
    }
  };

  const handleSort = (field: string) => {
    if (activeTab === "questions") {
      const isAsc = sortField === field && sortDirection === "asc";
      setSortDirection(isAsc ? "desc" : "asc");
      setSortField(field);
    } else {
      const isAsc = groupSortField === field && groupSortDirection === "asc";
      setGroupSortDirection(isAsc ? "desc" : "asc");
      setGroupSortField(field);
    }
  };

  const handleEditQuestion = (questionId: number, questionType: string) => {
    navigate(`/dashboard/questions/${questionId}/edit?type=${questionType}`);
  };

  const handleEditGroup = (groupId: number, groupType: string) => {
    navigate(`/dashboard/groups/${groupId}/edit?type=${groupType}`);
  };

  const handleDeleteClick = (questionId: number) => {
    setSelectedQuestionId(questionId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteGroupClick = (groupId: number) => {
    setSelectedGroupId(groupId);
    setDeleteGroupDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedQuestionId(null);
  };

  const handleDeleteGroupCancel = () => {
    setDeleteGroupDialogOpen(false);
    setSelectedGroupId(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedQuestionId) {
      setDeleteLoading(true);
      try {
        await deleteQuestion(selectedQuestionId);
        setQuestions(
          questions.filter((question) => question.id !== selectedQuestionId)
        );
        if (questions.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          handleGetAllQuestions();
        }
        showSuccess("Question deleted successfully!");
      } catch (error) {
        console.error("Error deleting question:", error);
        showError(`Failed to delete question: ${error}`);
      } finally {
        setDeleteLoading(false);
      }
    }
    setDeleteDialogOpen(false);
    setSelectedQuestionId(null);
  };

  const handleDeleteGroupConfirm = async () => {
    if (selectedGroupId) {
      setDeleteLoading(true);
      try {
        await deleteGroup(selectedGroupId);
        setGroups(groups.filter((group) => group.groupId !== selectedGroupId));
        if (groups.length === 1 && groupPage > 1) {
          setGroupPage(groupPage - 1);
        } else {
          handleGetAllGroups();
        }
        showSuccess("Question group deleted successfully!");
      } catch (error) {
        console.error("Error deleting question group:", error);
        showError(`Failed to delete question group: ${error}`);
      } finally {
        setDeleteLoading(false);
      }
    }
    setDeleteGroupDialogOpen(false);
    setSelectedGroupId(null);
  };

  const handleRefresh = () => {
    if (activeTab === "questions") {
      handleGetAllQuestions();
    } else {
      handleGetAllGroups();
    }
  };

  const handleViewQuestion = (questionId: number, questionType: string) => {
    // Determine the correct route based on question type
    if (questionType === "Part1" || questionType === "Part2") {
      navigate(`/practice/${questionType}/${questionId}`);
    } else {
      navigate(`/practice/group/${questionType}/${questionId}`);
    }
  };

  const handleViewGroup = (groupId: number, groupType: string) => {
    navigate(`/practice/group/${groupType}/${groupId}`);
  };

  const handleFilterTypeChange = (event: SelectChangeEvent<string>) => {
    setFilterType(event.target.value);
    if (activeTab === "questions") {
      setPage(1);
    } else {
      setGroupPage(1);
    }
  };

  const handleFilterTagChange = (event: SelectChangeEvent<number | string>) => {
    setFilterTag(Number(event.target.value));
    if (activeTab === "questions") {
      setPage(1);
    } else {
      setGroupPage(1);
    }
  };

  const handleClearFilters = () => {
    setFilterType("");
    setFilterTag("");
    setSearchTerm("");
    if (activeTab === "questions") {
      setPage(1);
    } else {
      setGroupPage(1);
    }
  };

  const handleTabChange = (
    _: React.SyntheticEvent,
    newValue: "questions" | "groups"
  ) => {
    setActiveTab(newValue);
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

  const filterVariants = {
    hidden: { opacity: 0, height: 0, overflow: "hidden" },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
      },
    },
  };

  // Function to get question type config
  const getQuestionTypeConfig = (type: string) => {
    return (
      QUESTION_TYPE_CONFIG[type] || {
        label: type,
        color: "#757575",
        icon: QuestionAnswer,
      }
    ); // Default gray
  };

  // Function to render question type chip
  const renderQuestionTypeChip = (type: string) => {
    const config = getQuestionTypeConfig(type);
    return (
      <Chip
        icon={<config.icon fontSize="small" />}
        label={config.label}
        sx={{
          bgcolor: alpha(config.color, 0.1),
          color: config.color,
          fontWeight: 500,
          borderRadius: "4px",
          border: `1px solid ${alpha(config.color, 0.3)}`,
          "& .MuiChip-label": {
            px: 1,
          },
        }}
        size="small"
      />
    );
  };

  // Function to render tag chip
  const renderTagChip = (tagName: string) => {
    return (
      <Chip
        icon={<Tag fontSize="small" />}
        label={tagName}
        size="small"
        sx={{
          bgcolor: alpha(theme.palette.info.main, 0.1),
          color: theme.palette.info.main,
          borderRadius: "4px",
          border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
          "& .MuiChip-label": {
            px: 1,
          },
        }}
      />
    );
  };

  // Function to render question media icons
  const renderMediaIcons = (type: string) => {
    return (
      <Box sx={{ display: "flex", gap: 0.5 }}>
        {type === "Part1" && (
          <Tooltip title="Has Image">
            <Avatar
              sx={{
                width: 24,
                height: 24,
                bgcolor: alpha(theme.palette.success.main, 0.1),
                color: theme.palette.success.main,
              }}
            >
              <ImageIcon fontSize="small" />
            </Avatar>
          </Tooltip>
        )}
        {["Part1", "Part2", "Part3", "Part4"].includes(type) && (
          <Tooltip title="Has Audio">
            <Avatar
              sx={{
                width: 24,
                height: 24,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
              }}
            >
              <AudioFile fontSize="small" />
            </Avatar>
          </Tooltip>
        )}
        {["Part3", "Part4"].includes(type) && (
          <Tooltip title={type === "Part3" ? "Conversation" : "Short Talk"}>
            <Avatar
              sx={{
                width: 24,
                height: 24,
                bgcolor: alpha(
                  type === "Part3"
                    ? theme.palette.secondary.main
                    : theme.palette.warning.main,
                  0.1
                ),
                color:
                  type === "Part3"
                    ? theme.palette.secondary.main
                    : theme.palette.warning.main,
              }}
            >
              {type === "Part3" ? (
                <Groups fontSize="small" />
              ) : (
                <FormatListNumbered fontSize="small" />
              )}
            </Avatar>
          </Tooltip>
        )}
      </Box>
    );
  };

  // Render table view for questions
  const renderQuestionsTableView = () => {
    return (
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="questions table">
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
                  Question
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="center">Tag</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.map((question, index) => (
              <TableRow
                key={question.id}
                sx={{
                  "&:nth-of-type(odd)": {
                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                  },
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  },
                  transition: "background-color 0.2s",
                  // Animation with CSS
                  animation: `fadeIn 0.5s ease-out ${index * 0.05}s both`,
                  "@keyframes fadeIn": {
                    from: { opacity: 0, transform: "translateY(20px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                <TableCell component="th" scope="row">
                  {question.id}
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
                  <Tooltip title={question.name || `Question #${question.id}`}>
                    <span>{question.name || `Question #${question.id}`}</span>
                  </Tooltip>
                </TableCell>
                <TableCell align="center">
                  {renderQuestionTypeChip(question.type)}
                </TableCell>
                <TableCell align="center">
                  {renderTagChip(question.tagName)}
                </TableCell>
                <TableCell align="center">
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    <Tooltip title="Edit Question">
                      <IconButton
                        size="small"
                        color="secondary"
                        onClick={() =>
                          handleEditQuestion(question.id, question.type)
                        }
                        sx={{
                          bgcolor: alpha(theme.palette.secondary.main, 0.1),
                          "&:hover": {
                            bgcolor: alpha(theme.palette.secondary.main, 0.2),
                          },
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Question">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(question.id)}
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
    );
  };

  // Render table view for groups
  const renderGroupsTableView = () => {
    return (
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="question groups table">
          <TableHead>
            <TableRow
              sx={{
                bgcolor: alpha(theme.palette.secondary.main, 0.1),
                "& th": {
                  fontWeight: "bold",
                  color: theme.palette.secondary.main,
                },
              }}
            >
              <TableCell>
                <TableSortLabel
                  active={groupSortField === "groupId"}
                  direction={
                    groupSortField === "groupId" ? groupSortDirection : "asc"
                  }
                  onClick={() => handleSort("groupId")}
                  IconComponent={
                    groupSortField === "groupId" && groupSortDirection === "asc"
                      ? ArrowUpward
                      : ArrowDownward
                  }
                >
                  ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={groupSortField === "groupName"}
                  direction={
                    groupSortField === "groupName" ? groupSortDirection : "asc"
                  }
                  onClick={() => handleSort("groupName")}
                  IconComponent={
                    groupSortField === "groupName" &&
                    groupSortDirection === "asc"
                      ? ArrowUpward
                      : ArrowDownward
                  }
                >
                  Group Name
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="center">Tag</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groups.map((group, index) => (
              <TableRow
                key={group.groupId}
                sx={{
                  "&:nth-of-type(odd)": {
                    bgcolor: alpha(theme.palette.secondary.main, 0.02),
                  },
                  "&:hover": {
                    bgcolor: alpha(theme.palette.secondary.main, 0.05),
                  },
                  transition: "background-color 0.2s",
                  // Animation with CSS
                  animation: `fadeIn 0.5s ease-out ${index * 0.05}s both`,
                  "@keyframes fadeIn": {
                    from: { opacity: 0, transform: "translateY(20px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                <TableCell component="th" scope="row">
                  {group.groupId}
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
                  <Tooltip title={group.groupName || `Group #${group.groupId}`}>
                    <span>{group.groupName || `Group #${group.groupId}`}</span>
                  </Tooltip>
                </TableCell>
                <TableCell align="center">
                  {renderQuestionTypeChip(group.type)}
                </TableCell>
                <TableCell align="center">
                  {renderTagChip(group.tagName)}
                </TableCell>
                <TableCell align="center">
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    <Tooltip title="Edit Group">
                      <IconButton
                        size="small"
                        color="secondary"
                        onClick={() =>
                          handleEditGroup(group.groupId, group.type)
                        }
                        sx={{
                          bgcolor: alpha(theme.palette.secondary.main, 0.1),
                          "&:hover": {
                            bgcolor: alpha(theme.palette.secondary.main, 0.2),
                          },
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Group">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteGroupClick(group.groupId)}
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
    );
  };

  // Render grid view for questions
  const renderQuestionsGridView = () => {
    return (
      <Grid container spacing={3}>
        {questions.map((question, index) => (
          <Grid item xs={12} sm={6} md={4} key={question.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  },
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    height: 8,
                    width: "100%",
                    bgcolor: getQuestionTypeConfig(question.type).color,
                  }}
                />
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box>
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
                          lineHeight: 1.3,
                        }}
                      >
                        {question.name || `Question #${question.id}`}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          mb: 2,
                          flexWrap: "wrap",
                        }}
                      >
                        {renderQuestionTypeChip(question.type)}
                        {renderTagChip(question.tagName)}
                      </Box>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        fontWeight: "bold",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: "0.75rem",
                      }}
                    >
                      ID: {question.id}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mt: 2,
                    }}
                  >
                    {renderMediaIcons(question.type)}
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Practice Question">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() =>
                            handleViewQuestion(question.id, question.type)
                          }
                          sx={{
                            bgcolor: alpha(theme.palette.success.main, 0.1),
                            "&:hover": {
                              bgcolor: alpha(theme.palette.success.main, 0.2),
                            },
                          }}
                        >
                          <PlayArrow fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Question">
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() =>
                            handleEditQuestion(question.id, question.type)
                          }
                          sx={{
                            bgcolor: alpha(theme.palette.secondary.main, 0.1),
                            "&:hover": {
                              bgcolor: alpha(theme.palette.secondary.main, 0.2),
                            },
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Question">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(question.id)}
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
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    );
  };

  // Render grid view for groups
  const renderGroupsGridView = () => {
    return (
      <Grid container spacing={3}>
        {groups.map((group, index) => (
          <Grid item xs={12} sm={6} md={4} key={group.groupId}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  },
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    height: 8,
                    width: "100%",
                    bgcolor: getQuestionTypeConfig(group.type).color,
                  }}
                />
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box>
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
                          lineHeight: 1.3,
                        }}
                      >
                        {group.groupName || `Group #${group.groupId}`}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          mb: 2,
                          flexWrap: "wrap",
                        }}
                      >
                        {renderQuestionTypeChip(group.type)}
                        {renderTagChip(group.tagName)}
                      </Box>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                        color: theme.palette.secondary.main,
                        fontWeight: "bold",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: "0.75rem",
                      }}
                    >
                      ID: {group.groupId}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mt: 2,
                    }}
                  >
                    {renderMediaIcons(group.type)}
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Practice Group">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() =>
                            handleViewGroup(group.groupId, group.type)
                          }
                          sx={{
                            bgcolor: alpha(theme.palette.success.main, 0.1),
                            "&:hover": {
                              bgcolor: alpha(theme.palette.success.main, 0.2),
                            },
                          }}
                        >
                          <PlayArrow fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Group">
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() =>
                            handleEditGroup(group.groupId, group.type)
                          }
                          sx={{
                            bgcolor: alpha(theme.palette.secondary.main, 0.1),
                            "&:hover": {
                              bgcolor: alpha(theme.palette.secondary.main, 0.2),
                            },
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Group">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteGroupClick(group.groupId)}
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
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    );
  };

  // Render empty state for questions
  const renderQuestionsEmptyState = () => (
    <Paper
      sx={{
        p: 4,
        textAlign: "center",
        borderRadius: 2,
        bgcolor: "background.paper",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      <Box sx={{ mb: 3 }}>
        <QuestionAnswer
          sx={{
            fontSize: 60,
            color: alpha(theme.palette.primary.main, 0.2),
            mb: 2,
          }}
        />
        <Typography variant="h5" color="text.secondary" gutterBottom>
          No questions found
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {filterType || filterTag || searchTerm
            ? "Try adjusting your filters or search criteria."
            : "Get started by creating your first question."}
        </Typography>
      </Box>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => navigate(`/dashboard/questions/create`)}
        sx={{
          background: "linear-gradient(45deg, #9C27B0 30%, #BA68C8 90%)",
          boxShadow: "0 3px 5px 2px rgba(156, 39, 176, .3)",
          px: 3,
          py: 1,
        }}
      >
        Create New Question
      </Button>
    </Paper>
  );

  // Render empty state for groups
  const renderGroupsEmptyState = () => (
    <Paper
      sx={{
        p: 4,
        textAlign: "center",
        borderRadius: 2,
        bgcolor: "background.paper",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Groups
          sx={{
            fontSize: 60,
            color: alpha(theme.palette.secondary.main, 0.2),
            mb: 2,
          }}
        />
        <Typography variant="h5" color="text.secondary" gutterBottom>
          No question groups found
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {filterType || filterTag || searchTerm
            ? "Try adjusting your filters or search criteria."
            : "Get started by creating your first question group."}
        </Typography>
      </Box>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => navigate(`/dashboard/manage-groups/create`)}
        sx={{
          background: "linear-gradient(45deg, #9C27B0 30%, #BA68C8 90%)",
          boxShadow: "0 3px 5px 2px rgba(156, 39, 176, .3)",
          px: 3,
          py: 1,
        }}
      >
        Create New Question Group
      </Button>
    </Paper>
  );

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
                <QuestionAnswer sx={{ mr: 0.5 }} fontSize="inherit" />
                Questions
              </Typography>
            </Breadcrumbs>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              gutterBottom
              sx={{ textAlign: "left" }}
            >
              Manage Questions
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create, edit, and practice with your questions and question groups
            </Typography>
          </Box>

          <Box sx={{ mt: { xs: 2, md: 0 } }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() =>
                activeTab === "questions"
                  ? navigate(`/dashboard/questions/create`)
                  : navigate(`/dashboard/manage-groups/create`)
              }
              sx={{
                mr: 1,
                background: "linear-gradient(45deg, #9C27B0 30%, #BA68C8 90%)",
                boxShadow: "0 3px 5px 2px rgba(156, 39, 176, .3)",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-3px)",
                },
              }}
            >
              New {activeTab === "questions" ? "Question" : "Group"}
            </Button>
            <IconButton onClick={handleRefresh} color="primary">
              <Refresh />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="question management tabs"
            sx={{
              "& .MuiTabs-indicator": {
                height: 3,
                borderRadius: 1.5,
              },
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
                minWidth: 120,
              },
            }}
          >
            <Tab
              value="questions"
              label="Individual Questions"
              icon={<QuestionAnswer />}
              iconPosition="start"
            />
            <Tab
              value="groups"
              label="Question Groups"
              icon={<Groups />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.background.paper,
              0.9
            )}, ${alpha(theme.palette.background.paper, 0.95)})`,
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Button
                variant={showFilters ? "contained" : "outlined"}
                color="primary"
                size="small"
                startIcon={<FilterAlt />}
                onClick={() => setShowFilters(!showFilters)}
                sx={{
                  borderRadius: 1.5,
                  transition: "all 0.2s",
                }}
              >
                Filters
                {(filterType || filterTag) && (
                  <Badge color="error" variant="dot" sx={{ ml: 1 }} />
                )}
              </Button>
            </Box>

            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Button
                variant={viewMode === "table" ? "contained" : "outlined"}
                size="small"
                onClick={() => setViewMode("table")}
                sx={{ minWidth: 0, px: 1, borderRadius: 1 }}
              >
                <ViewList />
              </Button>
              <Button
                variant={viewMode === "grid" ? "contained" : "outlined"}
                size="small"
                onClick={() => setViewMode("grid")}
                sx={{ minWidth: 0, px: 1, borderRadius: 1 }}
              >
                <ViewModule />
              </Button>
            </Box>
          </Box>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                variants={filterVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <Box
                  sx={{
                    mt: 2,
                    pt: 2,
                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    alignItems: "center",
                  }}
                >
                  <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel id="filter-type-label">
                      Question Type
                    </InputLabel>
                    <Select
                      labelId="filter-type-label"
                      id="filter-type"
                      value={filterType}
                      label="Question Type"
                      onChange={handleFilterTypeChange}
                    >
                      <MenuItem value="">All Types</MenuItem>
                      {Object.entries(QUESTION_TYPE_CONFIG).map(
                        ([value, config]) => (
                          <MenuItem key={value} value={value}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: "50%",
                                  bgcolor: config.color,
                                  mr: 1,
                                }}
                              />
                              {config.label}
                            </Box>
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel id="filter-tag-label">Tag</InputLabel>
                    <Select
                      labelId="filter-tag-label"
                      id="filter-tag"
                      value={filterTag}
                      label="Tag"
                      onChange={handleFilterTagChange}
                      disabled={tagsLoading}
                    >
                      <MenuItem value="">All Tags</MenuItem>
                      {tags.map((tag) => (
                        <MenuItem key={tag.id} value={tag.id}>
                          {tag.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Button
                    variant="text"
                    color="inherit"
                    size="small"
                    onClick={handleClearFilters}
                    disabled={!filterType && !filterTag && !searchTerm}
                    startIcon={<Clear />}
                  >
                    Clear Filters
                  </Button>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Paper>

        <AnimatePresence mode="wait">
          {activeTab === "questions" ? (
            <motion.div
              key="questions"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "300px",
                  }}
                >
                  <CircularProgress size={60} thickness={4} />
                </Box>
              ) : questions.length === 0 ? (
                renderQuestionsEmptyState()
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {viewMode === "table"
                    ? renderQuestionsTableView()
                    : renderQuestionsGridView()}

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
                      Showing {questions.length} of {totalItems} questions
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
          ) : (
            <motion.div
              key="groups"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {groupsLoading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "300px",
                  }}
                >
                  <CircularProgress size={60} thickness={4} />
                </Box>
              ) : groups.length === 0 ? (
                renderGroupsEmptyState()
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {viewMode === "table"
                    ? renderGroupsTableView()
                    : renderGroupsGridView()}

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
                      Showing {groups.length} of {groupTotalItems} question
                      groups
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <FormControl size="small" sx={{ minWidth: 80 }}>
                        <InputLabel id="group-page-size-label">
                          Per Page
                        </InputLabel>
                        <Select
                          labelId="group-page-size-label"
                          id="group-page-size"
                          value={groupSize}
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
                        count={groupTotalPages}
                        page={groupPage}
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
          )}
        </AnimatePresence>
      </motion.div>

      {/* Delete Question Confirmation Dialog */}
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
            Are you sure you want to delete this question? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleDeleteCancel}
            color="primary"
            sx={{ borderRadius: 1.5 }}
          >
            Cancel
          </Button>
          <LoadingButton
            loading={deleteLoading}
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            autoFocus
            sx={{
              borderRadius: 1.5,
              boxShadow: "0 3px 5px 2px rgba(239, 83, 80, .2)",
            }}
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* Delete Group Confirmation Dialog */}
      <Dialog
        open={deleteGroupDialogOpen}
        onClose={handleDeleteGroupCancel}
        aria-labelledby="alert-dialog-title-group"
        aria-describedby="alert-dialog-description-group"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle id="alert-dialog-title-group">
          {"Confirm Delete"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description-group">
            Are you sure you want to delete this question group? This will
            delete all questions in this group. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleDeleteGroupCancel}
            color="primary"
            sx={{ borderRadius: 1.5 }}
          >
            Cancel
          </Button>
          <LoadingButton
            loading={deleteLoading}
            onClick={handleDeleteGroupConfirm}
            color="error"
            variant="contained"
            autoFocus
            sx={{
              borderRadius: 1.5,
              boxShadow: "0 3px 5px 2px rgba(239, 83, 80, .2)",
            }}
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
