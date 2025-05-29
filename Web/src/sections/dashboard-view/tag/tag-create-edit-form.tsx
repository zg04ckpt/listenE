import type React from "react";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  Breadcrumbs,
  Link,
  useTheme,
  CircularProgress,
  alpha,
  Divider,
  Chip,
  Alert,
  Collapse,
  IconButton,
  InputAdornment,
  FormHelperText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Save,
  ArrowBack,
  Home,
  Dashboard,
  LocalOffer,
  Close,
  FilterList,
  Add,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { motion } from "framer-motion";
import { getAllTags, bulkCreateTag, updateTag } from "../../../api/tag";
import { useNotification } from "../../../provider/NotificationProvider";
import type { ITagItem } from "../../../types/tag";

export default function TagCreateEditForm() {
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  const theme = useTheme();
  const { tagId } = useParams<{ tagId: string }>();

  const isEditMode = !!tagId;

  const [tagName, setTagName] = useState("");
  const [tagType, setTagType] = useState("");
  const [tagNames, setTagNames] = useState<string[]>([]);
  const [currentTagName, setCurrentTagName] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tags, setTags] = useState<ITagItem[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [tagTypes, setTagTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await getAllTags();
        if (response?.items) {
          setTags(response.items);
          const types = response.items.map((tag) => tag.type).filter(Boolean);
          setTagTypes(Array.from(new Set(types)));
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    if (isEditMode && tagId) {
      const fetchTagData = async () => {
        setLoading(true);
        try {
          const response = await getAllTags();
          if (response?.items) {
            const allTags = response.items;
            const tag = allTags.find((t) => t.id === Number(tagId));

            if (tag) {
              setTagName(tag.name);
              setTagType(tag.type || "");
            } else {
              showError("Tag not found");
              navigate("/dashboard/manage-tags");
            }
          }
        } catch (error) {
          console.error("Error fetching tag:", error);
          showError("Failed to load tag data. Please try again.");
          navigate("/dashboard/manage-tags");
        } finally {
          setLoading(false);
        }
      };

      fetchTagData();
    }
  }, [isEditMode, tagId]);

  const handleTagTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagType(e.target.value);
  };

  const handleCurrentTagNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCurrentTagName(e.target.value);
  };

  const handleAddTag = () => {
    if (!currentTagName.trim()) return;

    if (tagNames.includes(currentTagName.trim())) {
      setErrorMessage("This tag is already in your list");
      return;
    }

    const tagExists = tags.some(
      (tag) => tag.name.toLowerCase() === currentTagName.trim().toLowerCase()
    );
    if (tagExists) {
      setErrorMessage("This tag already exists");
      return;
    }

    setTagNames([...tagNames, currentTagName.trim()]);
    setCurrentTagName("");
    setErrorMessage("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTagNames(tagNames.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const validateForm = (): boolean => {
    if (isEditMode) {
      if (!tagName.trim()) {
        setErrorMessage("Tag name cannot be empty");
        return false;
      }

      const tagExists = tags.some(
        (tag) =>
          tag.name.toLowerCase() === tagName.toLowerCase() &&
          tag.id !== Number(tagId)
      );

      if (tagExists) {
        setErrorMessage("Tag name already exists");
        return false;
      }

      return true;
    }

    if (tagNames.length === 0) {
      setErrorMessage("Please add at least one tag");
      return false;
    }

    if (!tagType.trim()) {
      setErrorMessage("Tag type is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      if (isEditMode && tagId) {
        await updateTag(Number(tagId), tagName.trim(), tagType.trim());
        showSuccess("Tag updated successfully!");
      } else {
        await bulkCreateTag(tagType.trim(), tagNames);
        showSuccess(`${tagNames.length} tag(s) created successfully!`);
        setSuccessMessage(`${tagNames.length} tag(s) created successfully!`);
      }

      setTimeout(() => {
        navigate("/dashboard/manage-tags");
      }, 1500);
    } catch (error) {
      console.error("Error saving tag:", error);
      showError(
        `Failed to ${
          isEditMode ? "update" : "create"
        } tag(s). Please try again.`
      );
      setErrorMessage(
        `Failed to ${
          isEditMode ? "update" : "create"
        } tag(s). Please try again.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (loading) {
    return (
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
    );
  }

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
              <Link
                underline="hover"
                color="inherit"
                sx={{ display: "flex", alignItems: "center" }}
                onClick={() => navigate("/dashboard/manage-tags")}
                style={{ cursor: "pointer" }}
              >
                <LocalOffer sx={{ mr: 0.5 }} fontSize="inherit" />
                Tags
              </Link>
              <Typography
                color="text.primary"
                sx={{ display: "flex", alignItems: "center" }}
              >
                {isEditMode ? "Edit Tag" : "Create Tags"}
              </Typography>
            </Breadcrumbs>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              gutterBottom
              sx={{ textAlign: "left" }}
            >
              {isEditMode ? "Edit Tag" : "Create New Tags"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {isEditMode
                ? "Update the tag information below"
                : "Create multiple tags at once by adding them to the list"}
            </Typography>
          </Box>
        </Box>

        <Collapse in={!!errorMessage}>
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setErrorMessage("")}
              >
                <Close fontSize="inherit" />
              </IconButton>
            }
          >
            {errorMessage}
          </Alert>
        </Collapse>

        <Collapse in={!!successMessage}>
          <Alert
            severity="success"
            sx={{ mb: 2 }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setSuccessMessage("")}
              >
                <Close fontSize="inherit" />
              </IconButton>
            }
          >
            {successMessage}
          </Alert>
        </Collapse>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
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
            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  {isEditMode ? "Tag Information" : "Create Multiple Tags"}
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <FormControl fullWidth margin="normal" required={!isEditMode}>
                  <InputLabel id="tag-type-label">Tag Type</InputLabel>
                  <Select
                    labelId="tag-type-label"
                    name="type"
                    label="Tag Type"
                    value={tagType}
                    onChange={handleTagTypeChange}
                    startAdornment={
                      <InputAdornment position="start">
                        <FilterList fontSize="small" />
                      </InputAdornment>
                    }
                    sx={{
                      borderRadius: 1.5,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 0 0 2px rgba(33, 150, 243, 0.1)",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 0 0 3px rgba(33, 150, 243, 0.2)",
                      },
                    }}
                  >
                    {tagTypes.length === 0 && (
                      <MenuItem value="" disabled>
                        No tag types available
                      </MenuItem>
                    )}
                    {tagTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    Chọn loại tag (type) từ các loại đã có trong hệ thống
                  </FormHelperText>
                </FormControl>

                {isEditMode ? (
                  <TextField
                    name="name"
                    label="Tag Name"
                    value={tagName}
                    onChange={(e) => setTagName(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    required
                    autoFocus
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocalOffer fontSize="small" />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: 1.5,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow: "0 0 0 2px rgba(33, 150, 243, 0.1)",
                        },
                        "&.Mui-focused": {
                          boxShadow: "0 0 0 3px rgba(33, 150, 243, 0.2)",
                        },
                      },
                    }}
                    helperText="Enter a unique name for this tag"
                  />
                ) : (
                  <Box sx={{ mt: 3 }}>
                    <Box
                      sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}
                    >
                      <TextField
                        name="currentTagName"
                        label="Tag Name"
                        value={currentTagName}
                        onChange={handleCurrentTagNameChange}
                        onKeyPress={handleKeyPress}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        autoFocus
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocalOffer fontSize="small" />
                            </InputAdornment>
                          ),
                          sx: {
                            borderRadius: 1.5,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              boxShadow: "0 0 0 2px rgba(33, 150, 243, 0.1)",
                            },
                            "&.Mui-focused": {
                              boxShadow: "0 0 0 3px rgba(33, 150, 243, 0.2)",
                            },
                          },
                        }}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddTag}
                        sx={{
                          mt: 2,
                          height: 56,
                          minWidth: 100,
                          borderRadius: 1.5,
                          background:
                            "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                          boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                        }}
                        startIcon={<Add />}
                      >
                        Add
                      </Button>
                    </Box>
                    <FormHelperText>
                      Enter a tag name and click Add (or press Enter) to add it
                      to the list
                    </FormHelperText>

                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Tags to create ({tagNames.length}):
                      </Typography>
                      {tagNames.length === 0 ? (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontStyle: "italic", mt: 1 }}
                        >
                          No tags added yet. Add at least one tag to continue.
                        </Typography>
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            mt: 1,
                          }}
                        >
                          {tagNames.map((name, index) => (
                            <Chip
                              key={index}
                              icon={<LocalOffer fontSize="small" />}
                              label={name}
                              onDelete={() => handleRemoveTag(name)}
                              color="primary"
                              sx={{
                                borderRadius: 1.5,
                                transition: "all 0.2s",
                                animation: `fadeIn 0.3s ease-out ${
                                  index * 0.05
                                }s both`,
                                "@keyframes fadeIn": {
                                  from: {
                                    opacity: 0,
                                    transform: "translateY(10px)",
                                  },
                                  to: {
                                    opacity: 1,
                                    transform: "translateY(0)",
                                  },
                                },
                              }}
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}

                {isEditMode && tagName && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Preview:
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <Chip
                        icon={<LocalOffer fontSize="small" />}
                        label={tagName}
                        color="primary"
                        sx={{
                          borderRadius: 1.5,
                          transition: "all 0.2s",
                          "&:hover": {
                            boxShadow: `0 0 0 2px ${alpha(
                              theme.palette.primary.main,
                              0.2
                            )}`,
                          },
                        }}
                      />
                      {tagType && (
                        <Chip
                          icon={<FilterList fontSize="small" />}
                          label={tagType}
                          color="secondary"
                          variant="outlined"
                          size="small"
                          sx={{ borderRadius: 1.5 }}
                        />
                      )}
                    </Box>
                  </Box>
                )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 4,
                  pt: 2,
                  borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                }}
              >
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => navigate("/dashboard/manage-tags")}
                  startIcon={<ArrowBack />}
                  sx={{
                    borderRadius: 1.5,
                    transition: "all 0.2s",
                    "&:hover": {
                      transform: "translateX(-3px)",
                    },
                  }}
                >
                  Cancel
                </Button>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  loading={submitting}
                  startIcon={<Save />}
                  disabled={!isEditMode && tagNames.length === 0}
                  sx={{
                    borderRadius: 1.5,
                    background:
                      "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                    boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                    transition: "all 0.2s",
                    "&:not(:disabled):hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "0 6px 10px 2px rgba(33, 203, 243, .3)",
                    },
                  }}
                >
                  {isEditMode
                    ? "Update Tag"
                    : `Create ${tagNames.length} Tag${
                        tagNames.length !== 1 ? "s" : ""
                      }`}
                </LoadingButton>
              </Box>
            </form>
          </Paper>
        </motion.div>
      </motion.div>
    </Container>
  );
}
