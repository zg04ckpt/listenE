import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  IconButton,
  Breadcrumbs,
  Link,
  Skeleton,
  Divider,
  Paper,
  Slider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Tooltip,
  Zoom,
} from "@mui/material";
import {
  ArrowBack,
  Home,
  PlayArrow,
  Pause,
  Replay,
  VolumeUp,
  VolumeMute,
  Send,
  EmojiEvents,
  CheckCircle,
  Cancel,
  QuestionMark,
  GradingOutlined,
  Lightbulb,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import type { ITrackReponseItem } from "../types/track";
import { getDetailsTopic } from "../api/topic";
import { getDetailsTrack } from "../api/track";
import type { ITopicItem } from "../types/topic";

interface CheckedWord {
  word: string;
  resultType: "Correct" | "MissingOrWrong" | "Wrong";
  order: number;
}

interface ScoreResponse {
  segmentId: number;
  checkedWords: CheckedWord[];
  redundancy: number;
  redundancyRate: number;
  correctRate: number;
  score: number;
  maxScore: number;
  correctTranscript: string;
}

const checkUserInput = async (
  segmentId: number,
  content: string,
  correctTranscript: string
): Promise<ScoreResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userWords = content.toLowerCase().split(/\s+/);
      const correctWords = correctTranscript.toLowerCase().split(/\s+/);

      const checkedWords: CheckedWord[] = [];
      let correctCount = 0;

      userWords.forEach((word, index) => {
        if (index < correctWords.length && word === correctWords[index]) {
          checkedWords.push({
            word,
            resultType: "Correct",
            order: index + 1,
          });
          correctCount++;
        } else {
          checkedWords.push({
            word,
            resultType: "MissingOrWrong",
            order: index + 1,
          });
        }
      });

      const correctRate =
        correctWords.length > 0
          ? (correctCount / correctWords.length) * 100
          : 0;

      resolve({
        segmentId,
        checkedWords,
        redundancy: 0,
        redundancyRate: 0,
        correctRate,
        score: Math.round(correctRate),
        maxScore: 100,
        correctTranscript: correctTranscript,
      });
    }, 1500);
  });
};

const TrackPracticePage = () => {
  const { topicId, trackId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<ITopicItem | null>(null);
  const [track, setTrack] = useState<ITrackReponseItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [showTranscript, setShowTranscript] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [scoreResult, setScoreResult] = useState<ScoreResponse | null>(null);
  const [isScoring, setIsScoring] = useState(false);
  const [hasScored, setHasScored] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleGetDetailsTrack = async (topicId: number, trackId: number) => {
    setLoading(true);
    try {
      const [topicRes, trackRes] = await Promise.all([
        getDetailsTopic(topicId),
        getDetailsTrack(trackId),
      ]);

      setTopic(topicRes?.data?.data);
      setTrack(trackRes?.data?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (topicId && trackId)
      handleGetDetailsTrack(Number(topicId), Number(trackId));
  }, [topicId, trackId]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Audio playback failed:", error);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isMuted]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && !isDragging) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressChange = (_event: Event, newValue: number | number[]) => {
    if (audioRef.current) {
      const newTime = newValue as number;
      setCurrentTime(newTime);
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleReplay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      audioRef.current.play().catch((error) => {
        console.error("Audio replay failed:", error);
      });
      setIsPlaying(true);
    }
  };

  const handleSubmit = () => {
    if (!userInput.trim()) return;
    setSubmitted(true);
  };

  const handleScoreSubmission = async () => {
    if (!track || !userInput.trim()) return;

    setIsScoring(true);
    try {
      const result = await checkUserInput(
        track.id,
        userInput,
        track.fullAudioTranscript
      );
      setScoreResult(result);
      setScore(result.score);
      setHasScored(true);

      if (result.score >= 80) {
        setShowSuccessDialog(true);
      }

      setShowTranscript(true);
    } catch (error) {
      console.error("Error scoring submission:", error);
    } finally {
      setIsScoring(false);
    }
  };

  const handleTryAgain = () => {
    setUserInput("");
    setSubmitted(false);
    setScore(null);
    setShowTranscript(false);
    setScoreResult(null);
    setHasScored(false);

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const getResultColor = (resultType: string) => {
    switch (resultType) {
      case "Correct":
        return "success.main";
      case "MissingOrWrong":
        return "error.main";
      case "Wrong":
        return "error.main";
      default:
        return "text.primary";
    }
  };

  const getResultIcon = (resultType: string) => {
    switch (resultType) {
      case "Correct":
        return <CheckCircle fontSize="small" color="success" />;
      case "MissingOrWrong":
        return <Cancel fontSize="small" color="error" />;
      case "Wrong":
        return <Cancel fontSize="small" color="error" />;
      default:
        return <QuestionMark fontSize="small" />;
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const wordAnimation = {
    hidden: { opacity: 0, y: 10 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3 },
    }),
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ pb: 6, pt: 10 }}>
        <Skeleton variant="text" height={30} width={200} />
        <Skeleton variant="text" height={40} sx={{ mt: 2 }} />

        <Box sx={{ mt: 4 }}>
          <Skeleton
            variant="rectangular"
            height={200}
            sx={{ borderRadius: 2 }}
          />
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Skeleton
              variant="circular"
              width={48}
              height={48}
              sx={{ mx: 1 }}
            />
            <Skeleton
              variant="circular"
              width={48}
              height={48}
              sx={{ mx: 1 }}
            />
            <Skeleton
              variant="circular"
              width={48}
              height={48}
              sx={{ mx: 1 }}
            />
          </Box>

          <Skeleton
            variant="rectangular"
            height={100}
            sx={{ mt: 4, borderRadius: 2 }}
          />
          <Skeleton
            variant="rectangular"
            height={56}
            sx={{ mt: 2, borderRadius: 2 }}
          />
        </Box>
      </Container>
    );
  }

  if (!track) {
    return (
      <Container maxWidth="md" sx={{ pb: 6, pt: 10 }}>
        <Typography variant="h4">Track not found</Typography>
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
            Home
          </Link>
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate(`/topic/${topic?.id}`)}
            style={{ cursor: "pointer" }}
          >
            {topic?.name}
          </Link>
          <Typography color="text.primary">{track.name}</Typography>
        </Breadcrumbs>

        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(`/topic/${topic?.id}`)}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              {track.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <Chip
                label={track.difficulty}
                size="small"
                color={
                  track.difficulty === "Easy"
                    ? "success"
                    : track.difficulty === "Medium"
                    ? "primary"
                    : "error"
                }
                sx={{ fontWeight: 500, mr: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                Listen carefully and type what you hear
              </Typography>
            </Box>
          </Box>
        </Box>

        <Card sx={{ mb: 4, borderRadius: 3, overflow: "hidden" }}>
          <CardContent>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Listen to the audio
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Play the audio and listen carefully to the pronunciation
              </Typography>
            </Box>

            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                background: "linear-gradient(135deg, #4568dc 0%, #b06ab3 100%)",
                color: "white",
                mb: 3,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  opacity: 0.1,
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fillOpacity='1' fillRule='evenodd'/%3E%3C/svg%3E\")",
                }}
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                  <IconButton
                    onClick={handleReplay}
                    sx={{
                      width: "56px",
                      height: "56px",
                      color: "white",
                      bgcolor: "rgba(255,255,255,0.2)",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.3)",
                        transform: "scale(1.1)",
                      },
                      mx: 1,
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Replay />
                  </IconButton>
                  <IconButton
                    onClick={togglePlayPause}
                    sx={{
                      color: "white",
                      bgcolor: "rgba(255,255,255,0.2)",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.3)",
                        transform: "scale(1.1)",
                      },
                      mx: 1,
                      width: 72,
                      height: 72,
                      transition: "all 0.2s ease",
                    }}
                  >
                    {isPlaying ? (
                      <Pause fontSize="large" />
                    ) : (
                      <PlayArrow fontSize="large" />
                    )}
                  </IconButton>
                  <IconButton
                    onClick={toggleMute}
                    sx={{
                      width: "56px",
                      height: "56px",
                      color: "white",
                      bgcolor: "rgba(255,255,255,0.2)",
                      mx: 1,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        transform: "scale(1.1)",
                        bgcolor: "rgba(255,255,255,0.3)",
                      },
                    }}
                  >
                    {isMuted ? <VolumeMute /> : <VolumeUp />}
                  </IconButton>
                </Box>
              </motion.div>

              <Box sx={{ px: 2, mb: 2, mt: 2 }}>
                <Slider
                  value={currentTime}
                  min={0}
                  max={duration || 100}
                  onChange={handleProgressChange}
                  onMouseDown={() => setIsDragging(true)}
                  onMouseUp={() => setIsDragging(false)}
                  aria-labelledby="audio-progress-slider"
                  sx={{
                    color: "white",
                    "& .MuiSlider-thumb": {
                      width: 12,
                      height: 12,
                      "&:hover, &.Mui-focusVisible": {
                        boxShadow: "0px 0px 0px 8px rgba(255, 255, 255, 0.16)",
                      },
                    },
                    "& .MuiSlider-rail": {
                      opacity: 0.3,
                    },
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "white",
                    fontSize: "0.75rem",
                    mt: 0.5,
                  }}
                >
                  <Typography variant="caption" color="white">
                    {formatTime(currentTime)}
                  </Typography>
                  <Typography variant="caption" color="white">
                    {formatTime(duration)}
                  </Typography>
                </Box>
              </Box>

              {/* Hidden audio element */}
              <audio
                ref={audioRef}
                src={track.fullAudioUrl}
                onEnded={() => setIsPlaying(false)}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
              />
            </Paper>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Type what you hear
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Type the sentence you heard..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                disabled={submitted && hasScored}
                inputRef={inputRef}
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  variant="outlined"
                  onClick={() => setShowTranscript(!showTranscript)}
                  disabled={!hasScored}
                  sx={{ visibility: hasScored ? "visible" : "hidden" }}
                >
                  {showTranscript ? "Hide Transcript" : "Show Transcript"}
                </Button>

                {!submitted ? (
                  <Button
                    variant="contained"
                    endIcon={<Send />}
                    onClick={handleSubmit}
                    disabled={!userInput.trim()}
                  >
                    Submit
                  </Button>
                ) : !hasScored ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleScoreSubmission}
                    disabled={isScoring}
                    startIcon={
                      isScoring ? (
                        <CircularProgress size={20} />
                      ) : (
                        <GradingOutlined />
                      )
                    }
                  >
                    {isScoring ? "Scoring..." : "Chấm Điểm"}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleTryAgain}
                  >
                    Try Again
                  </Button>
                )}
              </Box>
            </Box>

            <AnimatePresence>
              {showTranscript && hasScored && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: "rgba(0,0,0,0.03)",
                      borderRadius: 2,
                      mb: 3,
                    }}
                  >
                    <Typography variant="body2" fontWeight={500} gutterBottom>
                      Correct Transcript:
                    </Typography>
                    <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                      {scoreResult?.correctTranscript ||
                        track.fullAudioTranscript}
                    </Typography>
                  </Paper>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {hasScored && scoreResult && (
                <motion.div
                  variants={fadeIn}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                >
                  <Divider sx={{ my: 3 }} />
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h6" gutterBottom>
                      Your Score
                    </Typography>

                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 150,
                          height: 150,
                          borderRadius: "50%",
                          border: "8px solid",
                          borderColor:
                            score! >= 80
                              ? "success.main"
                              : score! >= 50
                              ? "warning.main"
                              : "error.main",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mx: "auto",
                          mb: 2,
                          position: "relative",
                        }}
                      >
                        <Typography variant="h4" fontWeight="bold">
                          {score}/100
                        </Typography>
                      </Box>
                    </motion.div>

                    <Typography
                      variant="body1"
                      color={
                        score! >= 80
                          ? "success.main"
                          : score! >= 50
                          ? "warning.main"
                          : "error.main"
                      }
                      fontWeight={500}
                      gutterBottom
                    >
                      {score! >= 80
                        ? "Excellent!"
                        : score! >= 50
                        ? "Good effort!"
                        : "Keep practicing!"}
                    </Typography>

                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        mb: 3,
                        display: "flex",
                        alignItems: "center",
                        bgcolor: "info.light",
                        color: "info.contrastText",
                        borderRadius: 2,
                      }}
                    >
                      <Lightbulb sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        Mẹo: Nhập văn bản hoặc tải lên file, sau đó tách thành
                        các câu và điền vào bảng để tiếp tục.
                      </Typography>
                    </Paper>

                    {/* Word-by-word comparison */}
                    <Paper
                      elevation={2}
                      sx={{
                        p: 3,
                        mt: 3,
                        borderRadius: 2,
                        bgcolor: "background.paper",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        fontWeight={500}
                      >
                        Grading Assistant
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          justifyContent: "center",
                        }}
                      >
                        {scoreResult.checkedWords.map((word, index) => (
                          <motion.div
                            key={`${word.word}-${index}`}
                            custom={index}
                            variants={wordAnimation}
                            initial="hidden"
                            animate="show"
                          >
                            <Tooltip
                              title={word.resultType}
                              arrow
                              TransitionComponent={Zoom}
                            >
                              <Chip
                                label={word.word}
                                icon={getResultIcon(word.resultType)}
                                sx={{
                                  bgcolor:
                                    word.resultType === "Correct"
                                      ? "rgba(46, 125, 50, 0.1)"
                                      : "rgba(211, 47, 47, 0.1)",
                                  color: getResultColor(word.resultType),
                                  fontWeight: 500,
                                  border: 1,
                                  borderColor:
                                    word.resultType === "Correct"
                                      ? "success.light"
                                      : "error.light",
                                }}
                              />
                            </Tooltip>
                          </motion.div>
                        ))}
                      </Box>
                    </Paper>

                    <Box
                      sx={{
                        mt: 4,
                        display: "flex",
                        justifyContent: "center",
                        gap: 2,
                      }}
                    >
                      <Button
                        variant="outlined"
                        onClick={handleTryAgain}
                        startIcon={<Replay />}
                      >
                        Try Again
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => navigate(`/topic/${topic?.id}`)}
                      >
                        Next Exercise
                      </Button>
                    </Box>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* <Button
            variant="outlined"
            startIcon={<Mic />}
            sx={{
              transition: "all 0.2s ease",
              "&:hover": { transform: "translateY(-2px)" },
            }}
          >
            Practice Listening
          </Button> */}
          <Button
            variant="outlined"
            onClick={() => navigate(`/topic/${topic?.id}`)}
            sx={{
              transition: "all 0.2s ease",
              "&:hover": { transform: "translateY(-2px)" },
            }}
          >
            Back to Topic
          </Button>
        </Box>
      </motion.div>

      {/* Success Dialog */}
      <Dialog
        open={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <EmojiEvents sx={{ fontSize: 60, color: "gold", mb: 1 }} />
          </motion.div>
          <Typography variant="h5" fontWeight="bold">
            Congratulations!
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", py: 2 }}>
          <Typography variant="body1" paragraph>
            You've successfully completed this exercise with a great score!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Keep up the good work and continue practicing to improve your
            English listening skills.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
            pb: 3,
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Button
            variant="outlined"
            onClick={() => {
              setShowSuccessDialog(false);
            }}
            startIcon={<GradingOutlined />}
            fullWidth
          >
            Xem Kết Quả
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setShowSuccessDialog(false);
              navigate(`/topic/${topic?.id}`);
            }}
            fullWidth
          >
            Continue Learning
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TrackPracticePage;
