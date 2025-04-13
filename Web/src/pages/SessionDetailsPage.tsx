"use client";

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
  LinearProgress,
  Chip,
  Avatar,
  ButtonGroup,
} from "@mui/material";
import {
  ArrowBack,
  Home,
  PlayArrow,
  CheckCircle,
  Headphones,
  // VolumeUp,
  FormatListBulleted,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import type { ISessionItem } from "../types/session";
import type { ITrackReponseItem } from "../types/track";
import { getDetailsTopic } from "../api/topic";
import { getListSessionTracks, getDetailsSession } from "../api/session";
import { ITopicItem } from "../types/topic";

export default function SessionDetailsPage() {
  const { topicId, sessionId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<ITopicItem | null>(null);
  const [session, setSession] = useState<ISessionItem | null>(null);
  const [tracks, setTracks] = useState<ITrackReponseItem[]>([]);
  const [loading, setLoading] = useState(true);

  const handelGetDetailsData = async (topicId: number, sessionId: number) => {
    setLoading(true);
    try {
      const [detailsRes, sessionsRes, tracksRes] = await Promise.all([
        getDetailsTopic(topicId),
        getDetailsSession(sessionId),
        getListSessionTracks(sessionId),
      ]);

      setTopic(detailsRes?.data?.data);
      setSession(sessionsRes?.data?.data);
      setTracks(tracksRes?.data?.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (topicId && sessionId)
      handelGetDetailsData(Number(topicId), Number(sessionId));
  }, [topicId, sessionId]);

  const handleTrackClick = (trackId: number) => {
    navigate(`/topic${topicId}/session/${sessionId}/track/${trackId}`);
  };

  const handlePracticeAll = (trackId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/topic/${topicId}/session/${sessionId}/track/${trackId}`);
  };

  const handlePracticeParts = (trackId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(
      `/topic/${topicId}/session/${sessionId}/track/${trackId}/segments`
    );
  };

  const calculateProgress = () => {
    if (tracks.length === 0) return 0;

    const completedTracks = tracks.filter((track) => track.completed).length;
    return Math.round((completedTracks / tracks.length) * 100);
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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ pb: 6, pt: 10 }}>
        <Skeleton variant="text" height={30} width={200} />
        <Skeleton variant="text" height={40} sx={{ mt: 2 }} />
        <Skeleton variant="text" height={24} width={120} sx={{ mt: 1 }} />

        <Box sx={{ mt: 4 }}>
          <Skeleton variant="text" height={40} width={150} />
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {Array.from(new Array(4)).map((_, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Skeleton variant="rectangular" height={100} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    );
  }

  if (!session) {
    return (
      <Container maxWidth="lg" sx={{ pb: 6, pt: 10 }}>
        <Typography variant="h4">Session not found</Typography>
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
            onClick={() => navigate(`/topic/${session.topicId}`)}
            style={{ cursor: "pointer" }}
          >
            {topic?.name}
          </Link>
          <Typography color="text.primary">{session.name}</Typography>
        </Breadcrumbs>

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(`/topic/${session.topicId}`)}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            {session.name}
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" color="text.secondary" paragraph>
            Practice your listening and listening skills with these audio
            tracks. Listen carefully and try to repeat what you hear.
          </Typography>

          <Box sx={{ mt: 3, mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Session Progress
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {calculateProgress()}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={calculateProgress()}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: "rgba(0,0,0,0.05)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                },
              }}
            />
          </Box>
        </Box>

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 600, mt: 6 }}
        >
          Tracks ({tracks.length})
        </Typography>
        <Divider sx={{ mb: 4 }} />

        <motion.div variants={container} initial="hidden" animate="show">
          <Grid container spacing={3}>
            {tracks.map((track) => (
              <Grid item xs={12} sm={6} key={track.id}>
                <motion.div variants={item}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                      },
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                    onClick={() => handleTrackClick(track.id)}
                  >
                    <CardContent
                      sx={{ flex: 1, display: "flex", flexDirection: "column" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 2,
                        }}
                      >
                        {/* <Chip
                          label={track.difficulty}
                          size="small"
                          color={
                            track.difficulty === "Easy"
                              ? "success"
                              : track.difficulty === "Medium"
                              ? "primary"
                              : "error"
                          }
                          sx={{ fontWeight: 500 }}
                        /> */}
                        {track.completed && (
                          <Chip
                            icon={<CheckCircle fontSize="small" />}
                            label="Completed"
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        )}
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "primary.main",
                            width: 48,
                            height: 48,
                            mr: 2,
                          }}
                        >
                          <Headphones />
                        </Avatar>
                        <Box>
                          <Typography
                            variant="h6"
                            component="h3"
                            sx={{ fontWeight: 600 }}
                          >
                            {track.name}
                          </Typography>
                          {/* <Typography variant="body2" color="text.secondary">
                            Duration: {track.fullAudioDuration}
                          </Typography> */}
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          mt: "auto",
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        {/* <Button
                          startIcon={<VolumeUp />}
                          size="small"
                          variant="text"
                          sx={{ alignSelf: "flex-start" }}
                        >
                          Preview
                        </Button> */}

                        <ButtonGroup
                          variant="contained"
                          fullWidth
                          sx={{
                            mt: 1,
                            "& .MuiButtonGroup-grouped:not(:last-of-type)": {
                              borderColor: "rgba(255, 255, 255, 0.3)",
                            },
                          }}
                        >
                          <Button
                            onClick={(e) => handlePracticeAll(track.id, e)}
                            startIcon={<PlayArrow />}
                            sx={{ flex: 1 }}
                          >
                            Làm Tất Cả
                          </Button>
                          <Button
                            onClick={(e) => handlePracticeParts(track.id, e)}
                            startIcon={<FormatListBulleted />}
                            sx={{ flex: 1 }}
                          >
                            Làm Từng Phần
                          </Button>
                        </ButtonGroup>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </motion.div>
    </Container>
  );
}
