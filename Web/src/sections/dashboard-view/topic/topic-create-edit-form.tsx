import type React from "react";

import { useState, useEffect, useRef } from "react";
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
  IconButton,
} from "@mui/material";
import {
  Save,
  ArrowBack,
  Home,
  Dashboard,
  Topic as TopicIcon,
  CloudUpload,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNotification } from "../../../provider/NotificationProvider";
import { getDetailsTopic, createTopic, updateTopic } from "../../../api/topic";
import { ITopicCreateEditItem } from "../../../types/topic";

export default function TopicCreateEditForm() {
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  const theme = useTheme();
  const { topicId } = useParams<{ topicId: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditMode = !!topicId;

  const [formData, setFormData] = useState<ITopicCreateEditItem>({
    name: "",
    description: "",
    thumbnail: null,
    thumbnailPreview: null,
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (isEditMode && topicId) {
      const fetchTopicData = async () => {
        setLoading(true);
        try {
          const response = await getDetailsTopic(Number.parseInt(topicId));
          setFormData({
            name: response?.data?.data?.name,
            description: response?.data?.data?.description || "",
            thumbnail: null,
            thumbnailPreview: response?.data?.data?.thumbnailUrl || null,
          });
        } catch (error) {
          console.error("Error fetching topic:", error);
          showError("Failed to load topic data. Please try again.");
          navigate("/dashboard/manage-topics");
        } finally {
          setLoading(false);
        }
      };

      fetchTopicData();
    }
  }, [isEditMode, topicId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log(file);
      const reader = new FileReader();

      reader.onload = (event) => {
        setFormData({
          ...formData,
          thumbnail: file,
          thumbnailPreview: event.target?.result as string,
        });
      };

      reader.readAsDataURL(file);
    }
  };

  const handleRemoveThumbnail = () => {
    setFormData({
      ...formData,
      thumbnail: null,
      thumbnailPreview: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      name: "",
      description: "",
    };

    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Topic name is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);

      if (formData.description) {
        data.append("description", formData.description);
      }

      if (formData.thumbnail) {
        data.append("thumbnail", formData.thumbnail);
      }

      console.log(formData.thumbnailPreview);

      if (isEditMode && topicId) {
        await updateTopic(Number.parseInt(topicId), data);
        showSuccess("Topic updated successfully!");
      } else {
        await createTopic(data);
        showSuccess("Topic created successfully!");
      }

      navigate("/dashboard/manage-topics");
    } catch (error) {
      console.error("Error saving topic:", error);
      showError(
        `Failed to ${isEditMode ? "update" : "create"} topic. Please try again.`
      );
    } finally {
      setSubmitting(false);
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
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
                onClick={() => navigate("/dashboard/topics")}
                style={{ cursor: "pointer" }}
              >
                <TopicIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                Topics
              </Link>
              <Typography
                color="text.primary"
                sx={{ display: "flex", alignItems: "center" }}
              >
                {isEditMode ? "Edit Topic" : "Create Topic"}
              </Typography>
            </Breadcrumbs>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              gutterBottom
              sx={{ textAlign: "left" }}
            >
              {isEditMode ? "Edit Topic" : "Create New Topic"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {isEditMode
                ? "Update the topic information below"
                : "Fill in the details to create a new learning topic"}
            </Typography>
          </Box>
        </Box>

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
              <motion.div variants={itemVariants}>
                <TextField
                  name="name"
                  label="Topic Name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={!!errors.name}
                  helperText={errors.name}
                  InputProps={{
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
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <TextField
                  name="description"
                  label="Description"
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={4}
                  InputProps={{
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
              </motion.div>

              <motion.div variants={itemVariants}>
                <Box sx={{ mt: 2, mb: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Topic Thumbnail
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 100,
                        height: 100,
                        borderRadius: 2,
                        backgroundImage: formData.thumbnailPreview
                          ? `url(${formData.thumbnailPreview})`
                          : 'url( "/placeholder.svg?height=100&width=100")',
                        backgroundPosition: "center center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "contain",
                      }}
                    />
                    <Box>
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="thumbnail-upload"
                        type="file"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                      />
                      <label htmlFor="thumbnail-upload">
                        <Button
                          variant="outlined"
                          component="span"
                          startIcon={<CloudUpload />}
                          sx={{ mb: 1, mr: 1 }}
                        >
                          {formData.thumbnailPreview
                            ? "Change Image"
                            : "Upload Image"}
                        </Button>
                      </label>
                      {formData.thumbnailPreview && (
                        <IconButton
                          color="error"
                          onClick={handleRemoveThumbnail}
                          size="small"
                          sx={{
                            mb: 1,
                            bgcolor: alpha(theme.palette.error.main, 0.1),
                            "&:hover": {
                              bgcolor: alpha(theme.palette.error.main, 0.2),
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                      <Typography
                        variant="caption"
                        display="block"
                        color="text.secondary"
                      >
                        Recommended size: 800x600 pixels. Max file size: 2MB.
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </motion.div>

              <motion.div variants={itemVariants} style={{ marginTop: "24px" }}>
                <Box
                  sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}
                >
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => navigate("/dashboard/topics")}
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
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<Save />}
                    disabled={submitting}
                    sx={{
                      borderRadius: 1.5,
                      background:
                        "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                      boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                      transition: "all 0.2s",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 6px 10px 2px rgba(33, 203, 243, .3)",
                      },
                    }}
                  >
                    {submitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : isEditMode ? (
                      "Update Topic"
                    ) : (
                      "Create Topic"
                    )}
                  </Button>
                </Box>
              </motion.div>
            </form>
          </Paper>
        </motion.div>
      </motion.div>
    </Container>
  );
}
