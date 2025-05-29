import type React from "react";
import { useState, useEffect } from "react";
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
  IconButton,
  Pagination,
} from "@mui/material";
import {
  ArrowBack,
  Home,
  QuestionAnswer,
  PlayArrow,
  Image as ImageIcon,
  VolumeUp,
  Groups,
  Headphones,
  MenuBook,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { getAllQuestions, getAllGroups } from "../api/question";
import { getAllTags } from "../api/tag";
import type {
  IQuestionResponseItem,
  IGroupResponseItem,
} from "../types/question";
import type { ITagItem } from "../types/tag";
import type { PaginatedResult } from "../types/page";

export default function TagQuestionsPage() {
  const { topicId, tagId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<IQuestionResponseItem[]>([]);
  const [groups, setGroups] = useState<IGroupResponseItem[]>([]);
  const [tag, setTag] = useState<ITagItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [isPart34, setIsPart34] = useState(false);

  const fetchTagAndItems = async (tagId: number, page = 1) => {
    setLoading(true);
    try {
      const tagsRes = await getAllTags();
      console.log(">>>>", tagsRes);
      const foundTag = tagsRes.items.find((t) => t.id === Number(tagId));

      if (foundTag) {
        setTag(foundTag);

        const isPart34Tag =
          foundTag.type === "Part3" || foundTag.type === "Part4";
        setIsPart34(isPart34Tag);

        if (isPart34Tag) {
          const groupsRes: PaginatedResult<IGroupResponseItem> =
            await getAllGroups({
              tagId,
              page,
              size: 10,
              type: foundTag.type,
            });

          setGroups(groupsRes.items || []);
          setPagination({
            page: groupsRes.page || 1,
            totalPages: groupsRes.totalPages || 1,
            totalItems: groupsRes.totalItems || 0,
          });
        } else {
          const questionsRes: PaginatedResult<IQuestionResponseItem> =
            await getAllQuestions({
              tagId,
              page,
              size: 100,
              type: foundTag.type,
            });
          console.log(questionsRes);

          setQuestions(questionsRes.items || []);
          setPagination({
            page: questionsRes.page || 1,
            totalPages: questionsRes.totalPages || 1,
            totalItems: questionsRes.totalItems || 0,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tagId) fetchTagAndItems(Number(tagId));
  }, [tagId]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    if (tagId) fetchTagAndItems(Number(tagId), page);
  };

  const handleItemClick = (itemId: number) => {
    if (isPart34) {
      navigate(`/topic/${topicId}/tag/${tagId}/group/${itemId}/practice`);
    } else {
      navigate(`/topic/${topicId}/tag/${tagId}/question/${itemId}/practice`);
    }
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case "part1":
      case "Part1":
        return <ImageIcon />;
      case "part2":
      case "Part2":
        return <VolumeUp />;
      case "part3":
      case "Part3":
        return <Groups />;
      case "part4":
      case "Part4":
        return <Headphones />;
      default:
        return <QuestionAnswer />;
    }
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case "part1":
      case "Part1":
        return "success";
      case "part2":
      case "Part2":
        return "primary";
      case "part3":
      case "Part3":
        return "secondary";
      case "part4":
      case "Part4":
        return "warning";
      default:
        return "default";
    }
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

  if (loading && !questions.length && !groups.length) {
    return (
      <Container maxWidth="lg" sx={{ pb: 6, pt: 10 }}>
        <Skeleton variant="text" height={30} width={200} />
        <Skeleton variant="rectangular" height={80} sx={{ my: 3 }} />

        <Grid container spacing={3} sx={{ mt: 1 }}>
          {Array.from(new Array(6)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton variant="rectangular" height={120} />
            </Grid>
          ))}
        </Grid>
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
            onClick={() => window.history.back()}
            style={{ cursor: "pointer" }}
          >
            Topic
          </Link>
          <Typography color="text.primary">
            {tag?.name || "Practice Items"}
          </Typography>
        </Breadcrumbs>

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(`/topic/${topicId}`)}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            {tag?.name || "Practice Items"}
          </Typography>
          {tag && (
            <Chip
              label={tag.type}
              size="small"
              color={getQuestionTypeColor(tag.type) as any}
              sx={{ ml: 2, fontWeight: 500 }}
            />
          )}
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" color="text.secondary" paragraph>
            {isPart34
              ? "Browse all question groups in this tag. Each group contains multiple related questions. Click on a group to start practicing."
              : "Browse all questions in this tag. Click on a question to start practicing."}
          </Typography>
        </Box>

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 600, mt: 4, display: "flex", alignItems: "center" }}
        >
          {isPart34 ? (
            <>
              <MenuBook sx={{ mr: 1 }} />
              Question Groups ({pagination.totalItems})
            </>
          ) : (
            <>
              <QuestionAnswer sx={{ mr: 1 }} />
              Questions ({pagination.totalItems})
            </>
          )}
        </Typography>
        <Divider sx={{ mb: 4 }} />

        {isPart34 ? (
          groups.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No question groups available for this tag
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Question groups with this tag will appear here
              </Typography>
            </Box>
          ) : (
            <motion.div variants={container} initial="hidden" animate="show">
              <Grid container spacing={3}>
                {groups.map((group) => (
                  <Grid item xs={12} sm={6} md={4} key={group.groupId}>
                    <motion.div variants={item}>
                      <Card
                        sx={{
                          cursor: "pointer",
                          transition:
                            "transform 0.2s ease, box-shadow 0.2s ease",
                          height: "100%",
                          "&:hover": {
                            transform: "translateY(-3px)",
                            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                          },
                        }}
                        onClick={() => handleItemClick(group.groupId)}
                      >
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <Avatar
                              sx={{
                                bgcolor: `${getQuestionTypeColor(
                                  group.type
                                )}.main`,
                                width: 40,
                                height: 40,
                                mr: 2,
                              }}
                            >
                              {getQuestionTypeIcon(group.type)}
                            </Avatar>
                            <Box>
                              <Typography
                                variant="h6"
                                component="h3"
                                sx={{ fontWeight: 600 }}
                              >
                                {group.groupName || `Group #${group.groupId}`}
                              </Typography>
                              <Chip
                                label={group.type.toUpperCase()}
                                size="small"
                                color={getQuestionTypeColor(group.type) as any}
                                variant="outlined"
                                sx={{ mt: 0.5 }}
                              />
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mt: 2,
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Tag: {group.tagName}
                            </Typography>
                            <IconButton
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleItemClick(group.groupId);
                              }}
                            >
                              <PlayArrow />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          )
        ) : questions.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No questions available for this tag
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Questions with this tag will appear here
            </Typography>
          </Box>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show">
            <Grid container spacing={3}>
              {questions.map((question) => (
                <Grid item xs={12} sm={6} md={4} key={question.id}>
                  <motion.div variants={item}>
                    <Card
                      sx={{
                        cursor: "pointer",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        height: "100%",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                        },
                      }}
                      onClick={() => handleItemClick(question.id)}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 2,
                          }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: `${getQuestionTypeColor(
                                question.type
                              )}.main`,
                              width: 40,
                              height: 40,
                              mr: 2,
                            }}
                          >
                            {getQuestionTypeIcon(question.type)}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="h6"
                              component="h3"
                              sx={{ fontWeight: 600 }}
                            >
                              {question.name || `Question #${question.id}`}
                            </Typography>
                            <Chip
                              label={question.type.toUpperCase()}
                              size="small"
                              color={getQuestionTypeColor(question.type) as any}
                              variant="outlined"
                              sx={{ mt: 0.5 }}
                            />
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mt: 2,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Tag: {question.tagName}
                          </Typography>
                          <IconButton
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleItemClick(question.id);
                            }}
                          >
                            <PlayArrow />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}

        {pagination.totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={pagination.totalPages}
              page={pagination.page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </motion.div>
    </Container>
  );
}
