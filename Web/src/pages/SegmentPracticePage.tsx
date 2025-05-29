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
  Tooltip,
  CircularProgress,
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
  NavigateNext,
  NavigateBefore,
  CheckCircle,
  Cancel,
  QuestionMark,
  GradingOutlined,
  Lightbulb,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import type { ITrackItem } from "../types/track";
import type { ISegmentItem } from "../types/segment";
import { getDetailsTrack } from "../api/track";
import { checkingSegment } from "../api/segment";

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

export default function SegmentPracticePage() {
  const { topicId, trackId, segmentId } = useParams();
  const navigate = useNavigate();

  const [track, setTrack] = useState<ITrackItem | null>(null);
  const [segment, setSegment] = useState<ISegmentItem | null>(null);
  const [segments, setSegments] = useState<ISegmentItem[]>([]);
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

  const handelGetDetailsData = async (trackId: number, segmentId: number) => {
    setLoading(true);
    try {
      const [trackRes] = await Promise.all([getDetailsTrack(trackId)]);

      setTrack(trackRes?.data?.data);
      setSegments(trackRes?.data?.data?.segments);
      const foundSegment =
        trackRes?.data?.data?.segments.find(
          (segment: ISegmentItem) => segment.id === Number(segmentId)
        ) || null;
      setSegment(foundSegment);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (topicId && trackId && segmentId)
      handelGetDetailsData(Number(trackId), Number(segmentId));
  }, [trackId, segmentId]);

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

  useEffect(() => {
    setUserInput("");
    setSubmitted(false);
    setScore(null);
    setShowTranscript(false);
    setScoreResult(null);
    setHasScored(false);
    setCurrentTime(0);
    setIsPlaying(false);

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
    }
  }, [segmentId]);

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
    if (!segment || !segmentId || !userInput.trim()) return;

    setIsScoring(true);
    try {
      const response = await checkingSegment(Number(segmentId), userInput);

      const result = response.data.data as ScoreResponse;
      console.log(result);
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

  const handleNextSegment = () => {
    if (segments.length > 0 && segment) {
      const currentIndex = segments.findIndex((s) => s.id === segment.id);
      if (currentIndex < segments.length - 1) {
        navigate(
          `/topic/${topicId}/track/${trackId}/segment/${
            segments[currentIndex + 1].id
          }`
        );
      }
    }
  };

  const handlePrevSegment = () => {
    if (segments.length > 0 && segment) {
      const currentIndex = segments.findIndex((s) => s.id === segment.id);
      if (currentIndex > 0) {
        navigate(
          `/topic/${topicId}/track/${trackId}/segment/${
            segments[currentIndex - 1].id
          }`
        );
      }
    }
  };

  const canGoNext = () => {
    if (segments.length > 0 && segment) {
      const currentIndex = segments.findIndex((s) => s.id === segment.id);
      return currentIndex < segments.length - 1;
    }
    return false;
  };

  const canGoPrev = () => {
    if (segments.length > 0 && segment) {
      const currentIndex = segments.findIndex((s) => s.id === segment.id);
      return currentIndex > 0;
    }
    return false;
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

  if (!track || !segment) {
    return (
      <Container maxWidth="md" sx={{ pb: 6, pt: 10 }}>
        <Typography variant="h4">Segment not found</Typography>
        <Button
          startIcon={<ArrowBack />}
          onClick={() =>
            navigate(`/topic/${topicId}/track/${trackId}/segments`)
          }
          sx={{ mt: 2 }}
        >
          Back to Segments
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
            onClick={() => navigate(`/topic/${topicId}`)}
            style={{ cursor: "pointer" }}
          >
            Back to Topic
          </Link>
          <Link
            underline="hover"
            color="inherit"
            onClick={() =>
              navigate(`/topic/${topicId}/track/${trackId}/segments`)
            }
            style={{ cursor: "pointer" }}
          >
            {track.name} Segments
          </Link>
          <Typography color="text.primary">{segment.name}</Typography>
        </Breadcrumbs>

        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() =>
              navigate(`/topic/${topicId}/track/${trackId}/segments`)
            }
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              {segment.name}
            </Typography>
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

              <audio
                ref={audioRef}
                src={segment.audioUrl}
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
                      {scoreResult?.correctTranscript || segment.transcript}
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

                    {scoreResult.redundancy !== 0 && (
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          mb: 3,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "60%",
                          marginLeft: "auto",
                          marginRight: "auto",
                          bgcolor: "error.light",
                          color: "error.contrastText",
                          borderRadius: 2,
                        }}
                      >
                        <Lightbulb sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          Bạn đã bị -{100 - scoreResult.score} điểm do viết thừa{" "}
                          {scoreResult.redundancy} từ
                        </Typography>
                      </Paper>
                    )}

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
                      {canGoNext() ? (
                        <Button
                          variant="contained"
                          onClick={handleNextSegment}
                          endIcon={<NavigateNext />}
                        >
                          Next Segment
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          onClick={() =>
                            navigate(
                              `/topic/${topicId}/track/${trackId}/segments`
                            )
                          }
                        >
                          Back to Segments
                        </Button>
                      )}
                    </Box>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Tooltip
            title={
              canGoPrev()
                ? "Go to previous segment"
                : "This is the first segment"
            }
          >
            <span>
              <Button
                variant="outlined"
                startIcon={<NavigateBefore />}
                onClick={handlePrevSegment}
                disabled={!canGoPrev()}
                sx={{
                  transition: "all 0.2s ease",
                  "&:hover": { transform: "translateY(-2px)" },
                }}
              >
                Previous
              </Button>
            </span>
          </Tooltip>

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

          <Tooltip
            title={
              canGoNext() ? "Go to next segment" : "This is the last segment"
            }
          >
            <span>
              <Button
                variant="outlined"
                endIcon={<NavigateNext />}
                onClick={handleNextSegment}
                disabled={!canGoNext()}
                sx={{
                  transition: "all 0.2s ease",
                  "&:hover": { transform: "translateY(-2px)" },
                }}
              >
                Next
              </Button>
            </span>
          </Tooltip>
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
            You've successfully completed this segment with a great score!
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
          {canGoNext() ? (
            <Button
              variant="contained"
              onClick={() => {
                setShowSuccessDialog(false);
                handleNextSegment();
              }}
              endIcon={<NavigateNext />}
              fullWidth
            >
              Next Segment
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => {
                setShowSuccessDialog(false);
                navigate(`/topic/${topicId}/track/${trackId}/segments`);
              }}
              fullWidth
            >
              Complete
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
}
