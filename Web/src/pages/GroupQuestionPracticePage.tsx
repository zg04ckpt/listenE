import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControl,
  Divider,
  CircularProgress,
  Breadcrumbs,
  Link,
  Chip,
  useTheme,
  alpha,
  Tooltip,
  Zoom,
  LinearProgress,
  IconButton,
} from "@mui/material";
import {
  ArrowBack,
  Home,
  NavigateNext,
  NavigateBefore,
  CheckCircle,
  Cancel,
  Help,
  QuestionAnswer,
  Refresh,
  MenuBook,
  VolumeUp,
  Flag,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import {
  getDetailsGroup,
  checkGroupAnswer,
  getAllGroups,
} from "../api/question";
import { useNotification } from "../provider/NotificationProvider";
import type {
  IQuestionPart34ResponseItem,
  IGroupResponseItem,
} from "../types/question";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
};

export default function GroupQuestionPracticePage() {
  const { topicId, tagId, groupId } = useParams<{
    topicId: string;
    tagId: string;
    groupId: string;
  }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const theme = useTheme();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [questionData, setQuestionData] =
    useState<IQuestionPart34ResponseItem | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [results, setResults] = useState<boolean[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [activeQuestionTab, setActiveQuestionTab] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [groups, setGroups] = useState<IGroupResponseItem[]>([]);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(-1);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [groupResults, setGroupResults] = useState<{
    [groupId: number]: {
      selectedAnswers: number[];
      results: boolean[];
      correctAnswers: number[];
      showResults: boolean;
      activeQuestionTab: number;
    };
  }>({});
  const [groupTranscript, setGroupTranscript] = useState("");
  const [explanations, setExplanations] = useState<string[]>([]);
  const [showTranscript, setShowTranscript] = useState(false);

  console.log(isPlaying, audioProgress);

  useEffect(() => {
    const fetchData = async () => {
      if (!groupId || !tagId) return;

      setLoading(true);
      const saved = groupResults[Number(groupId)];
      if (saved) {
        setSelectedAnswers(saved.selectedAnswers);
        setResults(saved.results);
        setCorrectAnswers(saved.correctAnswers);
        setShowResults(saved.showResults);
        setActiveQuestionTab(saved.activeQuestionTab || 0);
      } else {
        setSelectedAnswers([]);
        setResults([]);
        setCorrectAnswers([]);
        setShowResults(false);
        setActiveQuestionTab(0);
      }
      try {
        const response = await getDetailsGroup(Number.parseInt(groupId));
        const data = response?.data?.data;

        if (data) {
          setQuestionData(data);
          if (!saved) {
            setSelectedAnswers(new Array(data.questions.length).fill(-1));
          }
        }

        const groupsRes = await getAllGroups({ tagId: Number(tagId) });
        if (groupsRes?.items) {
          setGroups(groupsRes.items);
          const index = groupsRes.items.findIndex(
            (g) => g.groupId === Number(groupId)
          );
          setCurrentGroupIndex(index);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showError("Failed to load question group data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId, tagId]);

  const handleAnswerChange = (questionIndex: number, value: number) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[questionIndex] = value;
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleCheckAnswers = async () => {
    if (!groupId) return;

    if (selectedAnswers.includes(-1)) {
      showError("Please answer all questions before submitting");
      return;
    }

    setSubmitting(true);
    try {
      const response = await checkGroupAnswer(Number.parseInt(groupId));
      const responseData = response?.data?.data || {};
      if (
        responseData.questionKeys &&
        Array.isArray(responseData.questionKeys)
      ) {
        const corrAnswers = responseData.questionKeys.map(
          (item: { correctKey: number }) => item.correctKey
        );
        setCorrectAnswers(corrAnswers);
        const resultsData = selectedAnswers.map((selected, index) => {
          return selected === corrAnswers[index];
        });
        setResults(resultsData);
        setShowResults(true);
        setGroupResults((prev) => ({
          ...prev,
          [Number(groupId)]: {
            selectedAnswers: [...selectedAnswers],
            results: resultsData,
            correctAnswers: corrAnswers,
            showResults: true,
            activeQuestionTab,
          },
        }));
        const correctCount = resultsData.filter((result) => result).length;
        setTotalCorrect((prev) => prev + correctCount);
        setTotalQuestions((prev) => prev + resultsData.length);

        setGroupTranscript(responseData.transcript || "");
        setExplanations(
          Array.isArray(responseData.questionKeys)
            ? responseData.questionKeys.map((q: any) => q.explanation || "")
            : []
        );

        const percentage = Math.round(
          (correctCount / resultsData.length) * 100
        );
        showSuccess(
          `Your score: ${correctCount}/${resultsData.length} (${percentage}%)`
        );
      } else {
        showError("Invalid response format from server");
      }
    } catch (error) {
      console.error("Error checking answers:", error);
      showError("Failed to check answers");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedAnswers(new Array(questionData?.questions.length || 0).fill(-1));
    setResults([]);
    setCorrectAnswers([]);
    setShowResults(false);
    setActiveQuestionTab(0);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setAudioProgress(0);
    }
  };

  const handleNextGroup = () => {
    if (currentGroupIndex < groups.length - 1) {
      const nextGroup = groups[currentGroupIndex + 1];
      navigate(
        `/topic/${topicId}/tag/${tagId}/group/${nextGroup.groupId}/practice`
      );
    }
  };

  const handlePrevGroup = () => {
    if (currentGroupIndex > 0) {
      const prevGroup = groups[currentGroupIndex - 1];
      navigate(
        `/topic/${topicId}/tag/${tagId}/group/${prevGroup.groupId}/practice`
      );
    }
  };

  const handleFinish = () => {
    navigate(`/topic/${topicId}/tag/${tagId}/results`, {
      state: { results: { correct: totalCorrect, total: totalQuestions } },
    });
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

  if (!questionData) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h5" color="error" align="center">
          Question group not found
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(-1)}
            startIcon={<ArrowBack />}
          >
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="group-practice-container"
    >
      <Container
        maxWidth="md"
        sx={{
          mt: 8,
          mb: 4,
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -30,
            left: -30,
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: alpha(theme.palette.primary.main, 0.1),
            zIndex: -1,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: alpha(theme.palette.secondary.main, 0.1),
            zIndex: -1,
          }}
        />
        <Breadcrumbs
          aria-label="breadcrumb"
          separator={<NavigateNext fontSize="small" />}
          sx={{ mb: 3 }}
        >
          <Link
            underline="hover"
            color="inherit"
            href="/"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Home sx={{ mr: 0.5, width: 20, height: 20 }} />
            Home
          </Link>
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate(-1)}
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <MenuBook sx={{ mr: 0.5, width: 20, height: 20 }} />
            Question Groups
          </Link>
          <Typography color="text.primary">Practice</Typography>
        </Breadcrumbs>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            {questionData.groupName || "Question Group Practice"}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </Box>

        {/* Group Navigation */}
        <Box
          sx={{
            mb: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={2}
            sx={{
              p: 1,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              bgcolor: alpha(theme.palette.background.paper, 0.8),
            }}
          >
            <IconButton
              color="primary"
              disabled={currentGroupIndex <= 0}
              onClick={handlePrevGroup}
              sx={{
                bgcolor:
                  currentGroupIndex > 0
                    ? alpha(theme.palette.primary.main, 0.1)
                    : "transparent",
              }}
            >
              <NavigateBefore />
            </IconButton>
            <Typography variant="body1" fontWeight="medium">
              Group {currentGroupIndex + 1} of {groups.length}
            </Typography>
            <IconButton
              color="primary"
              disabled={currentGroupIndex >= groups.length - 1}
              onClick={handleNextGroup}
              sx={{
                bgcolor:
                  currentGroupIndex < groups.length - 1
                    ? alpha(theme.palette.primary.main, 0.1)
                    : "transparent",
              }}
            >
              <NavigateNext />
            </IconButton>
          </Paper>
        </Box>

        <motion.div variants={itemVariants}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              mb: 4,
              background: `linear-gradient(to right, ${alpha(
                theme.palette.primary.main,
                0.05
              )}, ${alpha(theme.palette.background.paper, 0.7)})`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 3,
                mb: 3,
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {questionData.imageUrl && (
                  <Box
                    sx={{
                      width: "100%",
                      height: 200,
                      borderRadius: 2,
                      overflow: "hidden",
                      position: "relative",
                      mb: 2,
                    }}
                  >
                    <Box
                      component="img"
                      src={questionData.imageUrl}
                      alt="Question Image"
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        borderRadius: 2,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    />
                  </Box>
                )}

                {questionData.audioUrl && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <VolumeUp
                        sx={{ mr: 1 }}
                        fontSize="small"
                        color="primary"
                      />
                      Audio Recording
                    </Typography>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        background: `linear-gradient(to right, ${alpha(
                          theme.palette.primary.main,
                          0.05
                        )}, ${alpha(theme.palette.background.paper, 0.9)})`,
                      }}
                    >
                      <audio
                        ref={audioRef}
                        src={questionData.audioUrl}
                        controls
                        style={{ width: "100%" }}
                        onTimeUpdate={() => {
                          if (audioRef.current?.duration) {
                            setAudioProgress(
                              (audioRef.current.currentTime /
                                audioRef.current.duration) *
                                100
                            );
                          }
                        }}
                      />
                    </Paper>
                  </Box>
                )}
              </Box>
            </Box>

            <Box sx={{ mb: 4, mt: 2 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2" color="text.secondary">
                  Progress
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {showResults
                    ? selectedAnswers.length
                    : selectedAnswers.filter((ans) => ans !== -1).length}
                  /{selectedAnswers.length} Questions Answered
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={
                  showResults
                    ? 100
                    : (selectedAnswers.filter((ans) => ans !== -1).length /
                        selectedAnswers.length) *
                      100
                }
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <QuestionAnswer sx={{ mr: 1 }} />
                Questions
                <Tooltip
                  title="Listen to the audio and answer all questions"
                  TransitionComponent={Zoom}
                  arrow
                >
                  <Help
                    fontSize="small"
                    sx={{
                      ml: 1,
                      verticalAlign: "middle",
                      color: "text.secondary",
                    }}
                  />
                </Tooltip>
              </Typography>

              <Box sx={{ position: "relative", mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                    py: 1,
                  }}
                >
                  {questionData.questions.map((_, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Button
                        variant={
                          activeQuestionTab === index ? "contained" : "outlined"
                        }
                        color={
                          showResults
                            ? results[index]
                              ? "success"
                              : "error"
                            : selectedAnswers[index] !== -1
                            ? "primary"
                            : "inherit"
                        }
                        onClick={() => setActiveQuestionTab(index)}
                        sx={{
                          minWidth: "auto",
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          p: 0,
                          position: "relative",
                        }}
                      >
                        {index + 1}
                        {showResults && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: -5,
                              right: -5,
                              width: 16,
                              height: 16,
                              borderRadius: "50%",
                              bgcolor: results[index]
                                ? "success.main"
                                : "error.main",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border: `2px solid ${theme.palette.background.paper}`,
                            }}
                          >
                            {results[index] ? (
                              <CheckCircle
                                sx={{ fontSize: 10, color: "white" }}
                              />
                            ) : (
                              <Cancel sx={{ fontSize: 10, color: "white" }} />
                            )}
                          </Box>
                        )}
                      </Button>
                    </motion.div>
                  ))}
                </Box>
              </Box>

              {questionData.questions.map((question, questionIndex) => (
                <Box
                  key={questionIndex}
                  sx={{
                    display:
                      activeQuestionTab === questionIndex ? "block" : "none",
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={questionIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card
                        elevation={3}
                        sx={{
                          mb: 3,
                          borderRadius: 2,
                          background: `linear-gradient(to right, ${alpha(
                            theme.palette.background.paper,
                            0.9
                          )}, ${alpha(theme.palette.primary.light, 0.05)})`,
                          position: "relative",
                          overflow: "visible",
                        }}
                      >
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              mb: 3,
                            }}
                          >
                            <Chip
                              label={`Q${questionIndex + 1}`}
                              color="primary"
                              size="small"
                              sx={{ mr: 2, mt: 0.5 }}
                            />
                            <Typography
                              variant="h6"
                              component="div"
                              sx={{ flex: 1 }}
                            >
                              {question.stringQuestion}
                            </Typography>
                          </Box>

                          <FormControl
                            component="fieldset"
                            sx={{ width: "100%" }}
                          >
                            <RadioGroup
                              value={selectedAnswers[questionIndex]}
                              onChange={(e) =>
                                handleAnswerChange(
                                  questionIndex,
                                  Number(e.target.value)
                                )
                              }
                            >
                              {question.answers.map((answer, answerIndex) => {
                                console.log(
                                  `Correct answer for question ${questionIndex}: ${correctAnswers[questionIndex]}`
                                );
                                console.log("------------------------");
                                console.log(
                                  `Selected answer for question ${questionIndex}: ${selectedAnswers[questionIndex]}`
                                );
                                return (
                                  <motion.div
                                    key={answerIndex}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: answerIndex * 0.1 }}
                                  >
                                    <Card
                                      variant="outlined"
                                      onClick={() =>
                                        !showResults &&
                                        handleAnswerChange(
                                          questionIndex,
                                          answerIndex + 1
                                        )
                                      }
                                      sx={{
                                        mb: 2,
                                        borderRadius: 2,
                                        borderWidth: 2,
                                        cursor: !showResults
                                          ? "pointer"
                                          : "default",
                                        borderColor: showResults
                                          ? answerIndex + 1 ===
                                            correctAnswers[questionIndex]
                                            ? theme.palette.success.main
                                            : selectedAnswers[questionIndex] ===
                                              answerIndex + 1
                                            ? theme.palette.error.main
                                            : theme.palette.divider
                                          : selectedAnswers[questionIndex] ===
                                            answerIndex + 1
                                          ? theme.palette.primary.main
                                          : theme.palette.divider,
                                        boxShadow:
                                          selectedAnswers[questionIndex] ===
                                            answerIndex + 1 ||
                                          (showResults &&
                                            answerIndex + 1 ===
                                              correctAnswers[questionIndex])
                                            ? `0 0 0 2px ${alpha(
                                                showResults
                                                  ? results[questionIndex]
                                                    ? theme.palette.success.main
                                                    : theme.palette.error.main
                                                  : theme.palette.primary.main,
                                                0.2
                                              )}`
                                            : showResults &&
                                              answerIndex + 1 ===
                                                correctAnswers[questionIndex]
                                            ? `0 0 0 2px ${alpha(
                                                theme.palette.success.main,
                                                0.2
                                              )}` // Add shadow to correct answer
                                            : "none",
                                        transition: "all 0.2s ease",
                                        position: "relative",
                                        overflow: "visible",
                                        transform:
                                          selectedAnswers[questionIndex] ===
                                            answerIndex + 1 ||
                                          (showResults &&
                                            answerIndex + 1 ===
                                              correctAnswers[questionIndex])
                                            ? "translateY(-2px)"
                                            : "none",
                                        "&:hover": {
                                          borderColor: showResults
                                            ? answerIndex + 1 ===
                                              correctAnswers[questionIndex]
                                              ? theme.palette.success.main
                                              : selectedAnswers[
                                                  questionIndex
                                                ] ===
                                                answerIndex + 1
                                              ? theme.palette.error.main
                                              : theme.palette.primary.main
                                            : theme.palette.primary.main,
                                          transform: "translateY(-2px)",
                                          boxShadow: `0 4px 8px ${alpha(
                                            theme.palette.primary.main,
                                            0.2
                                          )}`,
                                        },
                                      }}
                                    >
                                      {showResults &&
                                        answerIndex + 1 ===
                                          correctAnswers[questionIndex] && (
                                          <Box
                                            sx={{
                                              position: "absolute",
                                              top: -10,
                                              right: -10,
                                              zIndex: 1,
                                            }}
                                          >
                                            <CheckCircle color="success" />
                                          </Box>
                                        )}
                                      {showResults &&
                                        selectedAnswers[questionIndex] ===
                                          answerIndex + 1 &&
                                        answerIndex + 1 !==
                                          correctAnswers[questionIndex] && (
                                          <Box
                                            sx={{
                                              position: "absolute",
                                              top: -10,
                                              right: -10,
                                              zIndex: 1,
                                            }}
                                          >
                                            <Cancel color="error" />
                                          </Box>
                                        )}
                                      <CardContent sx={{ p: 2 }}>
                                        <Box
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            width: "100%",
                                          }}
                                        >
                                          <Radio
                                            color={
                                              showResults
                                                ? answerIndex + 1 ===
                                                  correctAnswers[questionIndex]
                                                  ? "success"
                                                  : selectedAnswers[
                                                      questionIndex
                                                    ] ===
                                                    answerIndex + 1
                                                  ? "error"
                                                  : "primary"
                                                : "primary"
                                            }
                                            disabled={showResults}
                                            value={answerIndex + 1}
                                          />
                                          <Typography
                                            variant="body1"
                                            sx={{
                                              flex: 1,
                                              ml: 1,
                                              fontWeight:
                                                showResults &&
                                                answerIndex + 1 ===
                                                  correctAnswers[questionIndex]
                                                  ? "bold"
                                                  : "normal",
                                            }}
                                          >
                                            {String.fromCharCode(
                                              65 + answerIndex
                                            ) + ". "}
                                            {answer.content}
                                          </Typography>
                                        </Box>
                                      </CardContent>
                                    </Card>
                                  </motion.div>
                                );
                              })}
                            </RadioGroup>
                          </FormControl>
                        </CardContent>
                      </Card>

                      {showResults && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Paper
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              bgcolor: alpha(theme.palette.info.light, 0.1),
                              border: `1px solid ${alpha(
                                theme.palette.info.main,
                                0.3
                              )}`,
                            }}
                          >
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => setShowTranscript((prev) => !prev)}
                              sx={{ mb: 2 }}
                            >
                              {showTranscript
                                ? "Ẩn transcript"
                                : "Hiện transcript"}
                            </Button>
                            {showTranscript && groupTranscript && (
                              <Box sx={{ mb: 2 }}>
                                <Typography
                                  variant="subtitle2"
                                  color="info.main"
                                  gutterBottom
                                >
                                  Transcript
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    whiteSpace: "pre-line",
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
                                  {groupTranscript}
                                </Typography>
                              </Box>
                            )}
                            <Typography
                              variant="subtitle2"
                              color="info.dark"
                              gutterBottom
                            >
                              Explanation:
                            </Typography>
                            <Typography variant="body2">
                              {explanations[questionIndex] ||
                                "No explanation provided for this question."}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mt: 3,
                                gap: 2,
                              }}
                            >
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<NavigateBefore />}
                                onClick={handlePrevGroup}
                                disabled={currentGroupIndex <= 0}
                              >
                                Previous Group
                              </Button>
                              {currentGroupIndex < groups.length - 1 ? (
                                <Button
                                  variant="contained"
                                  color="primary"
                                  endIcon={<NavigateNext />}
                                  onClick={handleNextGroup}
                                >
                                  Next Group
                                </Button>
                              ) : (
                                <Button
                                  variant="contained"
                                  color="success"
                                  endIcon={<Flag />}
                                  onClick={handleFinish}
                                  sx={{
                                    background:
                                      "linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)",
                                    boxShadow:
                                      "0 3px 5px 2px rgba(76, 175, 80, .3)",
                                  }}
                                >
                                  Finish Practice
                                </Button>
                              )}
                            </Box>
                          </Paper>
                        </motion.div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </Box>
              ))}

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() =>
                    activeQuestionTab > 0 &&
                    setActiveQuestionTab(activeQuestionTab - 1)
                  }
                  disabled={activeQuestionTab === 0}
                  startIcon={<NavigateBefore />}
                >
                  Previous Question
                </Button>
                <Box>
                  {showResults ? (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleReset}
                      startIcon={<Refresh />}
                      disabled={submitting}
                    >
                      Try Again
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleCheckAnswers}
                      disabled={submitting || selectedAnswers.includes(-1)}
                    >
                      {submitting ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Check Answers"
                      )}
                    </Button>
                  )}
                </Box>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() =>
                    activeQuestionTab < questionData.questions.length - 1 &&
                    setActiveQuestionTab(activeQuestionTab + 1)
                  }
                  disabled={
                    activeQuestionTab === questionData.questions.length - 1
                  }
                  endIcon={<NavigateNext />}
                >
                  Next Question
                </Button>
              </Box>
            </Box>
          </Paper>
        </motion.div>

        <Box sx={{ mt: 4, mb: 2, display: "flex", justifyContent: "center" }}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              mb: 4,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
              minWidth: 320,
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              startIcon={<NavigateBefore />}
              onClick={handlePrevGroup}
              disabled={currentGroupIndex <= 0}
            >
              Previous Group
            </Button>
            {currentGroupIndex < groups.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                endIcon={<NavigateNext />}
                onClick={handleNextGroup}
              >
                Next Group
              </Button>
            ) : (
              <Button
                variant="contained"
                color="success"
                endIcon={<Flag />}
                onClick={handleFinish}
                sx={{
                  background:
                    "linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)",
                  boxShadow: "0 3px 5px 2px rgba(76, 175, 80, .3)",
                }}
              >
                Finish Practice
              </Button>
            )}
          </Paper>
        </Box>
      </Container>
    </motion.div>
  );
}
