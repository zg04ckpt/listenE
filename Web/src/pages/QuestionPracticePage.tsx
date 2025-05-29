import type React from "react";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  Breadcrumbs,
  Link,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Snackbar,
  Alert,
  useTheme,
  alpha,
  Divider,
  Chip,
  Tooltip,
  Avatar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  ArrowBack,
  Home,
  Check,
  Close,
  VolumeUp,
  PlayArrow,
  PauseCircle,
  Visibility,
  VisibilityOff,
  NavigateNext,
  NavigateBefore,
  Tag,
  QuestionAnswer,
  Image as ImageIcon,
  AudioFile,
  MenuBook,
  CheckCircle,
  Cancel,
  LightbulbOutlined,
  Flag,
  EmojiEvents,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import {
  getDetailPartOneQuestion,
  getDetailPartTwoQuestion,
  checkAnswerQuestion,
  getAllQuestions,
} from "../api/question";
import { getDetailsTopic } from "../api/topic";
import type {
  IQuestionPartOneResponseItem,
  IQuestionResponseItem,
} from "../types/question";
import type { ITopicItem } from "../types/topic";

export default function QuestionPracticePage() {
  const { topicId, tagId, questionId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [question, setQuestion] = useState<any>(null);
  const [topic, setTopic] = useState<ITopicItem | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [explanation, setExplanation] = useState<string>("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  const [allQuestions, setAllQuestions] = useState<IQuestionResponseItem[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [results, setResults] = useState<{ correct: number; total: number }>({
    correct: 0,
    total: 0,
  });
  const [showResultsDialog, setShowResultsDialog] = useState(false);

  const [questionStates, setQuestionStates] = useState<{
    [id: number]: {
      selectedAnswer: number | null;
      isAnswerSubmitted: boolean;
      isCorrect: boolean;
      correctAnswer: number | null;
      explanation: string;
      showExplanation: boolean;
    };
  }>({});

  const [transcript, setTranscript] = useState<string>("");

  useEffect(() => {
    const fetchAllQuestionsInTag = async () => {
      if (!tagId) return;

      try {
        const questionsResponse = await getAllQuestions({
          tagId: Number(tagId),
          size: 100,
        });

        if (questionsResponse?.items) {
          setAllQuestions(questionsResponse.items);

          const index = questionsResponse.items.findIndex(
            (q) => q.id === Number(questionId)
          );
          setCurrentQuestionIndex(index);

          setIsLastQuestion(index === questionsResponse.items.length - 1);
        }
      } catch (error) {
        console.error("Error fetching all questions in tag:", error);
      }
    };

    fetchAllQuestionsInTag();
  }, [tagId, questionId]);

  useEffect(() => {
    const fetchTopicDetails = async () => {
      if (!topicId) return;

      try {
        const topicResponse = await getDetailsTopic(Number(topicId));
        if (topicResponse?.data?.data) {
          setTopic(topicResponse.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin topic:", error);
      }
    };

    fetchTopicDetails();
  }, [topicId]);

  useEffect(() => {
    const fetchQuestionDetails = async () => {
      if (!questionId) return;

      setLoading(true);
      try {
        try {
          const part1Res = await getDetailPartOneQuestion(Number(questionId));
          const questionData = part1Res?.data?.data;
          if (questionData) {
            setQuestion(questionData);

            if (questionData.audioUrl) {
              const newAudio = new Audio(questionData.audioUrl);
              newAudio.addEventListener("ended", () => setIsPlaying(false));
              setAudio(newAudio);
            }

            setLoading(false);
            return;
          }
        } catch (error) {
          console.log("Không phải câu hỏi Part One, đang thử Part Two...");
        }

        try {
          const part2Res = await getDetailPartTwoQuestion(Number(questionId));
          const questionData = part2Res?.data?.data;
          if (questionData) {
            setQuestion(questionData);

            if (questionData.audioUrl) {
              const newAudio = new Audio(questionData.audioUrl);
              newAudio.addEventListener("ended", () => setIsPlaying(false));
              setAudio(newAudio);
            }

            setLoading(false);
            return;
          }
        } catch (error) {
          console.error("Cũng không phải câu hỏi Part Two:", error);
        }

        setSnackbarMessage("Không thể xác định loại câu hỏi");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin câu hỏi:", error);
        setSnackbarMessage("Lỗi khi tải câu hỏi");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionDetails();

    const state = questionStates[Number(questionId)];
    if (state) {
      setSelectedAnswer(state.selectedAnswer);
      setIsAnswerSubmitted(state.isAnswerSubmitted);
      setIsCorrect(state.isCorrect);
      setCorrectAnswer(state.correctAnswer);
      setExplanation(state.explanation);
      setShowExplanation(state.showExplanation);
    } else {
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setIsCorrect(false);
      setCorrectAnswer(null);
      setExplanation("");
      setShowExplanation(false);
    }

    return () => {
      if (audio) {
        audio.pause();
        audio.removeEventListener("ended", () => setIsPlaying(false));
      }
    };
  }, [questionId]);

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAnswer(Number(event.target.value));
  };

  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null) {
      setSnackbarMessage("Vui lòng chọn một đáp án");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    setSubmitting(true);
    try {
      const response = await checkAnswerQuestion(Number(questionId));
      const responseData = response?.data?.data;

      let correctAnswerId = null;
      let explanationText = "";
      let transcriptText = "";

      if (
        typeof responseData === "object" &&
        responseData.correctKey !== undefined
      ) {
        correctAnswerId = responseData.correctKey;
        explanationText = responseData.explanation || "";
        transcriptText = responseData.transcript || "";
      } else {
        correctAnswerId = responseData;
      }

      const isAnswerCorrect = selectedAnswer === correctAnswerId;

      setCorrectAnswer(correctAnswerId);
      setExplanation(explanationText);
      setTranscript(transcriptText);
      setIsCorrect(isAnswerCorrect);
      setIsAnswerSubmitted(true);
      setShowExplanation(true);

      setQuestionStates((prev) => ({
        ...prev,
        [question.id]: {
          selectedAnswer,
          isAnswerSubmitted: true,
          isCorrect: isAnswerCorrect,
          correctAnswer: correctAnswerId,
          explanation: explanationText,
          showExplanation: true,
        },
      }));

      setResults((prev) => ({
        correct: prev.correct + (isAnswerCorrect ? 1 : 0),
        total: prev.total + 1,
      }));

      if (isAnswerCorrect) {
        setSnackbarMessage("Đáp án đúng! Làm tốt lắm!");
        setSnackbarSeverity("success");
      } else {
        setSnackbarMessage("Đáp án sai. Hãy xem giải thích để hiểu rõ hơn!");
        setSnackbarSeverity("error");
      }
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Lỗi khi kiểm tra đáp án:", error);
      setSnackbarMessage("Lỗi khi kiểm tra đáp án");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePlayAudio = () => {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setShowResultsDialog(true);
    } else if (
      currentQuestionIndex >= 0 &&
      currentQuestionIndex < allQuestions.length - 1
    ) {
      const nextQuestion = allQuestions[currentQuestionIndex + 1];
      navigate(
        `/topic/${topicId}/tag/${tagId}/question/${nextQuestion.id}/practice`
      );
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevQuestion = allQuestions[currentQuestionIndex - 1];
      navigate(
        `/topic/${topicId}/tag/${tagId}/question/${prevQuestion.id}/practice`
      );
    }
  };

  const handleFinishPractice = () => {
    navigate(`/topic/${topicId}/tag/${tagId}/results`, {
      state: { results: results },
    });
  };

  const getQuestionType = () => {
    if (!question) return "";

    if ((question as IQuestionPartOneResponseItem).imageUrl) {
      return "part1";
    }

    if (question.audioUrl) {
      return "part2";
    }

    if (topic?.type) {
      return topic.type.toLowerCase();
    }

    return "unknown";
  };

  const questionType = getQuestionType();

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case "part1":
        return "Part 1 (Hình ảnh & Âm thanh)";
      case "part2":
        return "Part 2 (Chỉ Âm thanh)";
      case "part3":
        return "Part 3 (Hội thoại)";
      case "part4":
        return "Part 4 (Bài nói ngắn)";
      default:
        return type.toUpperCase();
    }
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case "part1":
        return theme.palette.success.main;
      case "part2":
        return theme.palette.primary.main;
      case "part3":
        return theme.palette.secondary.main;
      case "part4":
        return theme.palette.warning.main;
      default:
        return theme.palette.info.main;
    }
  };

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
            Đang tải câu hỏi...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!question) {
    return (
      <Container maxWidth="md" sx={{ pb: 6, pt: 10 }}>
        <Box sx={{ textAlign: "center", py: 8 }}>
          <QuestionAnswer
            sx={{
              fontSize: 80,
              color: alpha(theme.palette.error.main, 0.2),
              mb: 2,
            }}
          />
          <Typography variant="h4" gutterBottom>
            Không tìm thấy câu hỏi
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Câu hỏi bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </Typography>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => window.history.back()}
            variant="contained"
            sx={{ mt: 2 }}
          >
            Quay lại
          </Button>
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
            onClick={() => navigate("/topics")}
            style={{ cursor: "pointer" }}
          >
            <MenuBook sx={{ mr: 0.5 }} fontSize="inherit" />
            Topic
          </Link>
          {topic && (
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
              {topic.name}
            </Link>
          )}
          <Typography
            color="text.primary"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <QuestionAnswer sx={{ mr: 0.5 }} fontSize="inherit" />
            Luyện tập
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
            onClick={() =>
              tagId
                ? navigate(`/topic/${topicId}/tag/${tagId}/questions`)
                : window.history.back()
            }
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
            Luyện tập câu hỏi
          </Typography>
          <Chip
            label={getQuestionTypeLabel(questionType)}
            sx={{
              bgcolor: alpha(getQuestionTypeColor(questionType), 0.1),
              color: getQuestionTypeColor(questionType),
              fontWeight: 500,
              borderRadius: "4px",
              border: `1px solid ${alpha(
                getQuestionTypeColor(questionType),
                0.3
              )}`,
            }}
          />

          {allQuestions.length > 0 && currentQuestionIndex >= 0 && (
            <Chip
              label={`Câu hỏi ${currentQuestionIndex + 1}/${
                allQuestions.length
              }`}
              sx={{
                ml: "auto",
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                fontWeight: 600,
                borderRadius: "4px",
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
          {isAnswerSubmitted && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                p: 2,
                bgcolor: isCorrect ? "success.main" : "error.main",
                color: "white",
                borderBottomLeftRadius: 8,
                zIndex: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                animation: "pulse 1.5s infinite",
                "@keyframes pulse": {
                  "0%": {
                    boxShadow: "0 0 0 0 rgba(0,0,0,0.1)",
                  },
                  "70%": {
                    boxShadow: isCorrect
                      ? "0 0 0 10px rgba(76, 175, 80, 0)"
                      : "0 0 0 10px rgba(244, 67, 54, 0)",
                  },
                  "100%": {
                    boxShadow: "0 0 0 0 rgba(0,0,0,0)",
                  },
                },
              }}
            >
              {isCorrect ? <CheckCircle /> : <Cancel />}
              <Typography variant="body1" fontWeight="bold">
                {isCorrect ? "Đáp án đúng!" : "Đáp án sai!"}
              </Typography>
            </Box>
          )}

          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                {question.name || `Câu hỏi #${question.id}`}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                {topic && (
                  <Chip
                    icon={<Tag fontSize="small" />}
                    label={topic.name}
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                      color: theme.palette.info.main,
                      borderRadius: "4px",
                    }}
                  />
                )}
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  {questionType === "part1" && (
                    <Tooltip title="Có hình ảnh">
                      <Chip
                        icon={<ImageIcon fontSize="small" />}
                        label="Hình ảnh"
                        size="small"
                        sx={{
                          bgcolor: alpha(theme.palette.success.main, 0.1),
                          color: theme.palette.success.main,
                          borderRadius: "4px",
                        }}
                      />
                    </Tooltip>
                  )}
                  <Tooltip title="Có âm thanh">
                    <Chip
                      icon={<AudioFile fontSize="small" />}
                      label="Âm thanh"
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        borderRadius: "4px",
                      }}
                    />
                  </Tooltip>
                </Box>
              </Box>
            </Box>
            <Typography
              variant="body2"
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                fontWeight: "bold",
                px: 1.5,
                py: 0.75,
                borderRadius: 1.5,
                fontSize: "0.75rem",
              }}
            >
              ID: {question.id}
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {questionType === "part1" && (
            <Box>
              {/* Hình ảnh cho Part 1 */}
              <Box
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  position: "relative",
                  width: "100%",
                  p: 0,
                  "&:hover": {
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(0,0,0,0.02)",
                      zIndex: 1,
                    },
                  },
                }}
              >
                <motion.img
                  src={(question as IQuestionPartOneResponseItem).imageUrl}
                  alt="Hình ảnh câu hỏi"
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                    display: "block",
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </Box>

              {audio && (
                <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={isPlaying ? <PauseCircle /> : <PlayArrow />}
                    onClick={handlePlayAudio}
                    size="large"
                    sx={{
                      borderRadius: 1.5,
                      px: 3,
                      py: 1,
                      boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
                      position: "relative",
                      overflow: "hidden",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(255,255,255,0.1)",
                        transform: "translateX(-100%)",
                        transition: "transform 0.3s ease",
                      },
                      "&:hover::after": {
                        transform: "translateX(0)",
                      },
                    }}
                  >
                    {isPlaying ? "Tạm dừng" : "Phát âm thanh"}
                  </Button>
                </Box>
              )}
            </Box>
          )}

          {questionType === "part2" && (
            <Box>
              {audio && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mb: 4,
                    p: 3,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    borderRadius: 2,
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `radial-gradient(circle at center, ${alpha(
                        theme.palette.primary.main,
                        0.15
                      )}, ${alpha(theme.palette.primary.main, 0.05)})`,
                      zIndex: 0,
                    },
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={isPlaying ? <PauseCircle /> : <VolumeUp />}
                    onClick={handlePlayAudio}
                    sx={{
                      borderRadius: 1.5,
                      px: 3,
                      py: 1,
                      boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
                      zIndex: 1,
                      position: "relative",
                    }}
                  >
                    {isPlaying ? "Tạm dừng" : "Phát âm thanh"}
                  </Button>
                </Box>
              )}
            </Box>
          )}

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
            Chọn đáp án đúng:
          </Typography>

          <FormControl component="fieldset" sx={{ width: "100%" }}>
            <RadioGroup
              aria-label="answers"
              name="answers"
              value={selectedAnswer}
              onChange={handleAnswerChange}
            >
              <AnimatePresence>
                {question.answers &&
                  question.answers.map((answer: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Paper
                        elevation={
                          selectedAnswer === answer.key && !isAnswerSubmitted
                            ? 3
                            : 1
                        }
                        sx={{
                          mb: 2,
                          p: 2,
                          borderRadius: 2,
                          border: "2px solid",
                          borderColor:
                            isAnswerSubmitted && correctAnswer === answer.key
                              ? "success.main"
                              : isAnswerSubmitted &&
                                selectedAnswer === answer.key &&
                                selectedAnswer !== correctAnswer
                              ? "error.main"
                              : selectedAnswer === answer.key &&
                                !isAnswerSubmitted
                              ? theme.palette.primary.main
                              : alpha(theme.palette.divider, 0.5),
                          bgcolor:
                            isAnswerSubmitted && correctAnswer === answer.key
                              ? alpha(theme.palette.success.main, 0.1)
                              : isAnswerSubmitted &&
                                selectedAnswer === answer.key &&
                                selectedAnswer !== correctAnswer
                              ? alpha(theme.palette.error.main, 0.1)
                              : selectedAnswer === answer.key &&
                                !isAnswerSubmitted
                              ? alpha(theme.palette.primary.main, 0.05)
                              : "background.paper",
                          transition: "all 0.3s ease",
                          transform:
                            selectedAnswer === answer.key && !isAnswerSubmitted
                              ? "translateX(8px)"
                              : "none",
                          position: "relative",
                          "&:hover": {
                            borderColor: !isAnswerSubmitted
                              ? theme.palette.primary.main
                              : isAnswerSubmitted &&
                                correctAnswer === answer.key
                              ? "success.main"
                              : isAnswerSubmitted &&
                                selectedAnswer === answer.key &&
                                selectedAnswer !== correctAnswer
                              ? "error.main"
                              : alpha(theme.palette.divider, 0.5),
                            transform: !isAnswerSubmitted
                              ? "translateX(8px)"
                              : "none",
                            boxShadow: !isAnswerSubmitted
                              ? "0 4px 8px rgba(0,0,0,0.1)"
                              : "none",
                          },
                        }}
                      >
                        {isAnswerSubmitted && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: -10,
                              right: -10,
                              zIndex: 2,
                            }}
                          >
                            {correctAnswer === answer.key ? (
                              <Avatar
                                sx={{
                                  bgcolor: "success.main",
                                  width: 28,
                                  height: 28,
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                                }}
                              >
                                <Check sx={{ fontSize: 18 }} />
                              </Avatar>
                            ) : selectedAnswer === answer.key &&
                              selectedAnswer !== correctAnswer ? (
                              <Avatar
                                sx={{
                                  bgcolor: "error.main",
                                  width: 28,
                                  height: 28,
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                                }}
                              >
                                <Close sx={{ fontSize: 18 }} />
                              </Avatar>
                            ) : null}
                          </Box>
                        )}

                        <FormControlLabel
                          value={answer.key}
                          control={
                            <Radio
                              sx={{
                                color:
                                  isAnswerSubmitted &&
                                  correctAnswer === answer.key
                                    ? theme.palette.success.main
                                    : isAnswerSubmitted &&
                                      selectedAnswer === answer.key &&
                                      selectedAnswer !== correctAnswer
                                    ? theme.palette.error.main
                                    : selectedAnswer === answer.key &&
                                      !isAnswerSubmitted
                                    ? theme.palette.primary.main
                                    : undefined,
                                "&.Mui-checked": {
                                  color:
                                    isAnswerSubmitted &&
                                    correctAnswer === answer.key
                                      ? theme.palette.success.main
                                      : isAnswerSubmitted &&
                                        selectedAnswer === answer.key &&
                                        selectedAnswer !== correctAnswer
                                      ? theme.palette.error.main
                                      : theme.palette.primary.main,
                                },
                              }}
                            />
                          }
                          label={
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Typography
                                variant="body1"
                                sx={{
                                  fontWeight:
                                    selectedAnswer === answer.key ||
                                    (isAnswerSubmitted &&
                                      correctAnswer === answer.key)
                                      ? 600
                                      : 400,
                                }}
                              >
                                {String.fromCharCode(65 + index)}
                                {answer.content}
                              </Typography>
                              {isAnswerSubmitted &&
                                correctAnswer === answer.key && (
                                  <CheckCircle color="success" sx={{ ml: 1 }} />
                                )}
                            </Box>
                          }
                          disabled={isAnswerSubmitted}
                          sx={{ width: "100%" }}
                        />
                      </Paper>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </RadioGroup>
          </FormControl>

          {isAnswerSubmitted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="outlined"
                  color="info"
                  startIcon={
                    showExplanation ? <VisibilityOff /> : <Visibility />
                  }
                  onClick={() => setShowExplanation(!showExplanation)}
                  sx={{
                    mb: 2,
                    borderRadius: 1.5,
                    boxShadow: showExplanation
                      ? "0 2px 8px rgba(0,0,0,0.1)"
                      : "none",
                    bgcolor: showExplanation
                      ? alpha(theme.palette.info.main, 0.1)
                      : "transparent",
                  }}
                >
                  {showExplanation ? "Ẩn giải thích" : "Xem giải thích"}
                </Button>

                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Paper
                        sx={{
                          p: 3,
                          bgcolor: alpha(theme.palette.info.main, 0.05),
                          borderRadius: 2,
                          border: `1px solid ${alpha(
                            theme.palette.info.main,
                            0.3
                          )}`,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                          position: "relative",
                          overflow: "hidden",
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "4px",
                            height: "100%",
                            backgroundColor: theme.palette.info.main,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 2,
                          }}
                        >
                          <LightbulbOutlined
                            sx={{
                              color: theme.palette.info.main,
                              fontSize: 28,
                              mt: 0.5,
                            }}
                          />
                          <Box>
                            {/* Transcript hiển thị cùng logic với explanation, cùng style */}
                            {transcript && (
                              <Box sx={{ mb: 3 }}>
                                <Typography
                                  variant="h6"
                                  gutterBottom
                                  sx={{
                                    color: theme.palette.info.main,
                                    fontWeight: 600,
                                  }}
                                >
                                  Bản ghi âm:
                                </Typography>
                                <Typography
                                  variant="body1"
                                  sx={{
                                    whiteSpace: "pre-line",
                                    lineHeight: 1.7,
                                    bgcolor: alpha(
                                      theme.palette.background.paper,
                                      0.5
                                    ),
                                    p: 2,
                                    borderRadius: 1,
                                    border: `1px solid ${alpha(
                                      theme.palette.divider,
                                      0.3
                                    )}`,
                                    fontStyle: "italic",
                                  }}
                                >
                                  {transcript}
                                </Typography>
                              </Box>
                            )}
                            <Typography
                              variant="h6"
                              gutterBottom
                              sx={{
                                color: theme.palette.info.main,
                                fontWeight: 600,
                              }}
                            >
                              Giải thích:
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                color: theme.palette.text.primary,
                                lineHeight: 1.7,
                              }}
                            >
                              {explanation ||
                                question.explanation ||
                                "Không có giải thích cho câu hỏi này."}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            </motion.div>
          )}
        </Paper>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex <= 0}
            startIcon={<NavigateBefore />}
            sx={{ minWidth: 150, borderRadius: 1.5 }}
          >
            Câu hỏi trước
          </Button>
          {!isAnswerSubmitted ? (
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null || submitting}
              startIcon={
                submitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
              sx={{
                minWidth: 150,
                borderRadius: 1.5,
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s ease",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                },
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 10px 2px rgba(33, 203, 243, .4)",
                  "&::after": {
                    opacity: 1,
                  },
                },
                "&:active": {
                  transform: "translateY(1px)",
                  boxShadow: "0 2px 5px 1px rgba(33, 203, 243, .3)",
                },
                "&:disabled": {
                  background:
                    "linear-gradient(45deg, #9e9e9e 30%, #bdbdbd 90%)",
                  boxShadow: "none",
                },
              }}
            >
              {submitting ? "Đang kiểm tra..." : "Nộp đáp án"}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              size="large"
              endIcon={isLastQuestion ? <Flag /> : <NavigateNext />}
              onClick={
                isLastQuestion ? handleFinishPractice : handleNextQuestion
              }
              sx={{
                minWidth: 150,
                borderRadius: 1.5,
                background: isLastQuestion
                  ? "linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)"
                  : "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                boxShadow: isLastQuestion
                  ? "0 3px 5px 2px rgba(76, 175, 80, .3)"
                  : "0 3px 5px 2px rgba(33, 203, 243, .3)",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s ease",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                },
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: isLastQuestion
                    ? "0 6px 10px 2px rgba(76, 175, 80, .4)"
                    : "0 6px 10px 2px rgba(33, 203, 243, .4)",
                  "&::after": {
                    opacity: 1,
                  },
                },
                "&:active": {
                  transform: "translateY(1px)",
                  boxShadow: isLastQuestion
                    ? "0 2px 5px 1px rgba(76, 175, 80, .3)"
                    : "0 2px 5px 1px rgba(33, 203, 243, .3)",
                },
              }}
            >
              {isLastQuestion ? "Kết thúc" : "Câu hỏi tiếp theo"}
            </Button>
          )}
        </Box>
      </motion.div>

      <Dialog
        open={showResultsDialog}
        onClose={() => setShowResultsDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
          <EmojiEvents sx={{ fontSize: 48, color: "warning.main", mb: 1 }} />
          <Typography variant="h4" fontWeight="bold">
            Hoàn thành!
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Typography variant="h5" gutterBottom>
              Kết quả của bạn
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 3,
                my: 3,
              }}
            >
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h3" color="success.main" fontWeight="bold">
                  {results.correct}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Đúng
                </Typography>
              </Box>
              <Typography variant="h4" color="text.disabled">
                /
              </Typography>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h3" fontWeight="bold">
                  {results.total}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Tổng số
                </Typography>
              </Box>
            </Box>

            <Typography variant="body1" sx={{ mt: 2 }}>
              Tỷ lệ chính xác:{" "}
              {Math.round((results.correct / results.total) * 100)}%
            </Typography>

            <Box
              sx={{
                mt: 3,
                p: 2,
                bgcolor: alpha(theme.palette.info.main, 0.1),
                borderRadius: 2,
              }}
            >
              <Typography variant="body1">
                Bạn đã hoàn thành tất cả các câu hỏi trong tag này. Bạn có thể
                xem lại kết quả chi tiết hoặc quay lại danh sách tag.
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0, justifyContent: "center", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => {
              setShowResultsDialog(false);
              navigate(`/topic/${topicId}/tag/${tagId}/questions`);
            }}
          >
            Quay lại danh sách
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleFinishPractice}
            startIcon={<EmojiEvents />}
          >
            Xem kết quả chi tiết
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{
            width: "100%",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            "& .MuiAlert-icon": {
              fontSize: "1.5rem",
            },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
