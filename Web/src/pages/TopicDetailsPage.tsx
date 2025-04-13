"use client";

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
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  Home,
  PlayArrow,
  CheckCircle,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { ITopicItem } from "../types/topic";
import { ISessionItem } from "../types/session";
import { getAllTopicSessions, getDetailsTopic } from "../api/topic";

export default function TopicDetailsPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<ITopicItem | null>(null);
  const [sessions, setSessions] = useState<ISessionItem[]>([]);
  const [loading, setLoading] = useState(true);

  const handleGetDetailsTopic = async (topicId: number) => {
    setLoading(true);
    try {
      const [detailsRes, sessionsRes] = await Promise.all([
        getDetailsTopic(topicId),
        getAllTopicSessions(topicId),
      ]);

      setTopic(detailsRes?.data?.data);
      setSessions(sessionsRes?.data?.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (topicId) handleGetDetailsTopic(Number(topicId));
  }, [topicId]);

  const handleSessionClick = (sessionId: number) => {
    navigate(`/topic/${topicId}/session/${sessionId}`);
  };

  const calculateOverallProgress = () => {
    if (sessions.length === 0) return 0;

    const totalProgress = sessions.reduce(
      (sum, session) => sum + (session.progress || 0),
      0
    );
    return Math.round(totalProgress / sessions.length);
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
        <Skeleton variant="rectangular" height={200} sx={{ my: 3 }} />
        <Skeleton variant="text" height={40} />
        <Skeleton variant="text" height={100} />

        <Box sx={{ mt: 4 }}>
          <Skeleton variant="text" height={40} width={150} />
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {Array.from(new Array(4)).map((_, index) => (
              <Grid item xs={12} key={index}>
                <Skeleton variant="rectangular" height={100} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    );
  }

  if (!topic) {
    return (
      <Container maxWidth="lg" sx={{ pb: 6, pt: 10 }}>
        <Typography variant="h4">Topic not found</Typography>
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
          <Typography color="text.primary">{topic.name}</Typography>
        </Breadcrumbs>

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => window.history.back()}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            {topic.name}
          </Typography>
          <Chip
            label={topic.level}
            size="small"
            color={
              topic.level === "Beginner"
                ? "success"
                : topic.level === "Intermediate"
                ? "primary"
                : "secondary"
            }
            sx={{ ml: 2, fontWeight: 500 }}
          />
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" color="text.secondary" paragraph>
            {topic.description}
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
                Overall Progress
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {calculateOverallProgress()}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={calculateOverallProgress()}
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
          Sessions ({sessions.length})
        </Typography>
        <Divider sx={{ mb: 4 }} />

        <motion.div variants={container} initial="hidden" animate="show">
          <Grid container spacing={3}>
            {sessions.map((session) => (
              <Grid item xs={12} key={session.id}>
                <motion.div variants={item}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                      },
                    }}
                    onClick={() => handleSessionClick(session.id)}
                  >
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={8}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                bgcolor: session.completed
                                  ? "success.main"
                                  : "primary.main",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mr: 2,
                                fontWeight: "bold",
                              }}
                            >
                              {session.completed ? (
                                <CheckCircle />
                              ) : (
                                session.orderInTopic
                              )}
                            </Box>
                            <Box>
                              <Typography
                                variant="h6"
                                component="h3"
                                sx={{ fontWeight: 600 }}
                              >
                                {session.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ textAlign: "left" }}
                              >
                                {session.trackCount} tracks
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Box sx={{ width: "70%" }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  mb: 0.5,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Progress
                                </Typography>
                                <Typography variant="body2" fontWeight={500}>
                                  {session.progress}%
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={session.progress || 0}
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  bgcolor: "rgba(0,0,0,0.05)",
                                  "& .MuiLinearProgress-bar": {
                                    borderRadius: 3,
                                  },
                                }}
                              />
                            </Box>
                            <Button
                              variant={
                                session.progress && session.progress > 0
                                  ? "outlined"
                                  : "contained"
                              }
                              size="small"
                              endIcon={
                                session.progress && session.progress > 0 ? (
                                  <ArrowForward />
                                ) : (
                                  <PlayArrow />
                                )
                              }
                              sx={{ ml: 2 }}
                            >
                              {session.progress && session.progress > 0
                                ? "Continue"
                                : "Start"}
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
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
