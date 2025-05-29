import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  Breadcrumbs,
  Link,
  Paper,
  Divider,
  Chip,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  useTheme,
  alpha,
} from "@mui/material";
import {
  ArrowBack,
  Home,
  Tag,
  MenuBook,
  EmojiEvents,
  Refresh,
  BarChart,
  TrendingUp,
  School,
  Lightbulb,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { getDetailsTopic } from "../api/topic";
import { getAllTags } from "../api/tag";
import type { ITopicItem } from "../types/topic";
import type { ITagItem } from "../types/tag";
import { getAllQuestions } from "../api/question";
import type { IQuestionResponseItem } from "../types/question";

export default function ResultsPage() {
  const { topicId, tagId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const [topic, setTopic] = useState<ITopicItem | null>(null);
  const [tag, setTag] = useState<ITagItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [allQuestions, setAllQuestions] = useState<IQuestionResponseItem[]>([]);

  const results = location.state?.results || { correct: 0, total: 0 };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (topicId) {
          const topicRes = await getDetailsTopic(Number(topicId));
          if (topicRes?.data?.data) {
            setTopic(topicRes.data.data);
          }
        }

        if (tagId) {
          const tagsRes = await getAllTags();
          const foundTag = tagsRes.items.find(
            (t: ITagItem) => t.id === Number(tagId)
          );
          if (foundTag) {
            setTag(foundTag);
          }
        }

        if (tagId) {
          const questionsRes = await getAllQuestions({ tagId: Number(tagId) });
          if (questionsRes?.items) {
            setAllQuestions(questionsRes.items);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [topicId, tagId]);

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return "Xuất sắc! Bạn đã nắm vững kiến thức này.";
    if (percentage >= 70) return "Rất tốt! Bạn đã hiểu phần lớn nội dung.";
    if (percentage >= 50)
      return "Khá tốt! Hãy tiếp tục luyện tập để cải thiện.";
    return "Hãy xem lại và luyện tập thêm để nâng cao kết quả.";
  };

  const percentage =
    results.total > 0 ? Math.round((results.correct / results.total) * 100) : 0;

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ pb: 6, pt: 10 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            my: 8,
          }}
        >
          <CircularProgress size={60} thickness={4} color="primary" />
          <Typography variant="h6" sx={{ mt: 3, fontWeight: 500 }}>
            Đang tải kết quả...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ pb: 6, pt: 10 }}>
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
            Trang chủ
          </Link>
          <Link
            underline="hover"
            color="inherit"
            sx={{ display: "flex", alignItems: "center" }}
            onClick={() => navigate("/topic")}
            style={{ cursor: "pointer" }}
          >
            <MenuBook sx={{ mr: 0.5 }} fontSize="inherit" />
            Chủ đề
          </Link>
          {topic && (
            <Link
              underline="hover"
              color="inherit"
              sx={{ display: "flex", alignItems: "center" }}
              onClick={() => navigate(`/topic/${topicId}`)}
              style={{ cursor: "pointer" }}
            >
              <Tag sx={{ mr: 0.5 }} fontSize="inherit" />
              {topic.name}
            </Link>
          )}
          {tag && (
            <Link
              underline="hover"
              color="inherit"
              sx={{ display: "flex", alignItems: "center" }}
              onClick={() =>
                navigate(`/topic/${topicId}/tag/${tagId}/questions`)
              }
              style={{ cursor: "pointer" }}
            >
              <Tag sx={{ mr: 0.5 }} fontSize="inherit" />
              {tag.name}
            </Link>
          )}
          <Typography
            color="text.primary"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <EmojiEvents sx={{ mr: 0.5 }} fontSize="inherit" />
            Kết quả
          </Typography>
        </Breadcrumbs>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(`/topic/${topicId}/tag/${tagId}/questions`)}
            sx={{ mr: 2 }}
            variant="outlined"
          >
            Quay lại danh sách
          </Button>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 700, mr: 2 }}
          >
            Kết quả luyện tập
          </Typography>
          {tag && (
            <Chip
              label={tag.name}
              sx={{
                bgcolor: alpha(theme.palette.info.main, 0.1),
                color: theme.palette.info.main,
                fontWeight: 500,
                borderRadius: "4px",
                border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
              }}
            />
          )}
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            mb: 4,
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.background.paper,
              0.9
            )}, ${alpha(theme.palette.background.paper, 0.95)})`,
            backdropFilter: "blur(10px)",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            >
              <EmojiEvents
                sx={{ fontSize: 64, color: "warning.main", mb: 1 }}
              />
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                Hoàn thành!
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                Bạn đã hoàn thành tất cả các câu hỏi trong tag này
              </Typography>
            </motion.div>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: { xs: 2, sm: 4 },
                flexWrap: "wrap",
                mb: 4,
              }}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    textAlign: "center",
                    minWidth: 120,
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    border: `1px solid ${alpha(
                      theme.palette.success.main,
                      0.3
                    )}`,
                  }}
                >
                  <Typography
                    variant="h4"
                    color="success.main"
                    fontWeight="bold"
                  >
                    {results.correct}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Đúng
                  </Typography>
                </Paper>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    textAlign: "center",
                    minWidth: 120,
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                    border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                  }}
                >
                  <Typography variant="h4" color="error.main" fontWeight="bold">
                    {results.total - results.correct}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Sai
                  </Typography>
                </Paper>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    textAlign: "center",
                    minWidth: 120,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    border: `1px solid ${alpha(
                      theme.palette.primary.main,
                      0.3
                    )}`,
                  }}
                >
                  <Typography
                    variant="h4"
                    color="primary.main"
                    fontWeight="bold"
                  >
                    {results.total}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Tổng số
                  </Typography>
                </Paper>
              </motion.div>
            </Box>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              style={{ transformOrigin: "left" }}
            >
              <Box sx={{ px: { xs: 0, sm: 4, md: 8 }, mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">0%</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {percentage}%
                  </Typography>
                  <Typography variant="body2">100%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    bgcolor: alpha(theme.palette.grey[300], 0.5),
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 6,
                      background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.success.main} 100%)`,
                    },
                  }}
                />
              </Box>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <Typography variant="h6" gutterBottom>
                {getPerformanceMessage(percentage)}
              </Typography>
            </motion.div>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.0 }}
              >
                <Card
                  sx={{
                    height: "100%",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <BarChart sx={{ color: "primary.main", mr: 1 }} />
                      <Typography variant="h6" fontWeight="bold">
                        Phân tích kết quả
                      </Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      Tỷ lệ đúng của bạn là <strong>{percentage}%</strong>.{" "}
                      {percentage >= 70
                        ? "Đây là một kết quả tốt!"
                        : "Hãy tiếp tục cố gắng!"}
                    </Typography>
                    <Typography variant="body2">
                      Bạn đã trả lời đúng <strong>{results.correct}</strong> câu
                      hỏi trong tổng số <strong>{results.total}</strong> câu
                      hỏi.
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                <Card
                  sx={{
                    height: "100%",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Lightbulb sx={{ color: "warning.main", mr: 1 }} />
                      <Typography variant="h6" fontWeight="bold">
                        Gợi ý cải thiện
                      </Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      {percentage < 70 ? (
                        <>
                          Hãy xem lại các câu hỏi bạn đã làm sai và đọc kỹ phần
                          giải thích để hiểu rõ hơn.
                        </>
                      ) : (
                        <>
                          Bạn đã làm rất tốt! Hãy tiếp tục luyện tập với các tag
                          khác để nâng cao kỹ năng.
                        </>
                      )}
                    </Typography>
                    <Typography variant="body2">
                      Luyện tập thường xuyên sẽ giúp bạn cải thiện kỹ năng nghe
                      tiếng Anh một cách hiệu quả.
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>

          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ArrowBack />}
              onClick={() =>
                navigate(`/topic/${topicId}/tag/${tagId}/questions`)
              }
            >
              Quay lại danh sách câu hỏi
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Refresh />}
              onClick={() => {
                if (allQuestions && allQuestions.length > 0) {
                  navigate(
                    `/topic/${topicId}/tag/${tagId}/question/${allQuestions[0].id}/practice`
                  );
                } else {
                  navigate(`/topic/${topicId}/tag/${tagId}/questions`);
                }
              }}
              sx={{
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
              }}
            >
              Luyện tập lại
            </Button>
          </Box>
        </Paper>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            <School sx={{ mr: 1, verticalAlign: "middle" }} />
            Các bước tiếp theo
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <Card
                  sx={{
                    height: "100%",
                    cursor: "pointer",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                    },
                  }}
                  onClick={() => navigate(`/topic/${topicId}`)}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Tag sx={{ color: "info.main", fontSize: 40, mr: 1 }} />
                      <Typography variant="h6" fontWeight="bold">
                        Khám phá các tag khác
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      Luyện tập với các tag khác trong cùng chủ đề để mở rộng
                      kiến thức của bạn.
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                <Card
                  sx={{
                    height: "100%",
                    cursor: "pointer",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                    },
                  }}
                  onClick={() => navigate("/topics")}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <MenuBook
                        sx={{ color: "success.main", fontSize: 40, mr: 1 }}
                      />
                      <Typography variant="h6" fontWeight="bold">
                        Khám phá chủ đề mới
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      Tìm hiểu các chủ đề khác để phát triển kỹ năng nghe tiếng
                      Anh toàn diện.
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                <Card
                  sx={{
                    height: "100%",
                    cursor: "pointer",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                    },
                  }}
                  onClick={() =>
                    navigate(`/topic/${topicId}/tag/${tagId}/questions`)
                  }
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <TrendingUp
                        sx={{ color: "secondary.main", fontSize: 40, mr: 1 }}
                      />
                      <Typography variant="h6" fontWeight="bold">
                        Luyện tập lại
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      Luyện tập lại các câu hỏi để củng cố kiến thức và cải
                      thiện kết quả.
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      </motion.div>
    </Container>
  );
}
