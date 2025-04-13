"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  Breadcrumbs,
  Link,
  Skeleton,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  Paper,
} from "@mui/material";
import { ArrowBack, Home, PlayArrow, CheckCircle } from "@mui/icons-material";
import { motion } from "framer-motion";
import { ISegmentResponseItem } from "../types/segment";
import { getDetailsTrack } from "../api/track";
import { ITrackReponseItem } from "../types/track";
import { ISessionItem } from "../types/session";
import { getDetailsSession } from "../api/session";
import { getDetailsTopic } from "../api/topic";
import { ITopicItem } from "../types/topic";
import { formatTime } from "../utils/formats";

export default function TrackSegmentsPage() {
  const { topicId, sessionId, trackId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<ITopicItem | null>(null);
  const [session, setSession] = useState<ISessionItem | null>(null);
  const [track, setTrack] = useState<ITrackReponseItem | null>(null);
  const [segments, setSegments] = useState<ISegmentResponseItem[]>([]);
  const [loading, setLoading] = useState(true);

  const handelGetDetailsData = async (
    topicId: number,
    sessionId: number,
    trackId: number
  ) => {
    setLoading(true);
    try {
      const [topicRes, sessionsRes, trackRes] = await Promise.all([
        getDetailsTopic(topicId),
        getDetailsSession(sessionId),
        getDetailsTrack(trackId),
      ]);

      setTopic(topicRes?.data?.data);
      setSession(sessionsRes?.data?.data);
      setTrack(trackRes?.data?.data);
      setSegments(trackRes?.data?.data?.segments);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (topicId && sessionId && trackId)
      handelGetDetailsData(Number(topicId), Number(sessionId), Number(trackId));
  }, [topicId, sessionId, trackId]);

  const handleSegmentClick = (segmentId: number) => {
    navigate(
      `/topic/${topicId}/session/${sessionId}/track/${trackId}/segment/${segmentId}`
    );
  };

  const handlePracticeAll = () => {
    navigate(`/topic/${topicId}/session/${sessionId}/track/${trackId}`);
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
      <Container maxWidth="md" sx={{ pb: 6, pt: 10 }}>
        <Skeleton variant="text" height={30} width={200} />
        <Skeleton variant="text" height={40} sx={{ mt: 2 }} />
        <Skeleton variant="text" height={24} width={120} sx={{ mt: 1 }} />

        <Box sx={{ mt: 4 }}>
          <Skeleton variant="text" height={40} width={150} />
          <List sx={{ mt: 1 }}>
            {Array.from(new Array(3)).map((_, index) => (
              <ListItem key={index} disablePadding>
                <Skeleton variant="rectangular" height={72} width="100%" />
              </ListItem>
            ))}
          </List>
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
            onClick={() =>
              navigate(`topic/${topic?.id}/session/${session?.id}`)
            }
            style={{ cursor: "pointer" }}
          >
            Back to Session
          </Link>
          <Typography color="text.primary">{track.name} Segments</Typography>
        </Breadcrumbs>

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() =>
              navigate(`/topic/${topic?.id}/session/${session?.id}`)
            }
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              {track.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
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
                sx={{ fontWeight: 500, mr: 2 }}
              /> */}
              <Typography variant="body2" color="text.secondary">
                Duration: {formatTime(track.fullAudioDuration)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            bgcolor: "primary.light",
            color: "white",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h6" gutterBottom>
              Practice All Segments Together
            </Typography>
            <Typography variant="body2">
              Practice the entire track in one session
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<PlayArrow />}
            onClick={handlePracticeAll}
            sx={{
              px: 3,
              py: 1,
              bgcolor: "white",
              color: "primary.main",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.9)",
              },
            }}
          >
            Làm Tất Cả
          </Button>
        </Paper>

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 600, mt: 6 }}
        >
          Segments ({segments.length})
        </Typography>
        <Divider sx={{ mb: 4 }} />

        <motion.div variants={container} initial="hidden" animate="show">
          <List sx={{ bgcolor: "background.paper", borderRadius: 2 }}>
            {segments.map((segment, index) => (
              <motion.div key={segment.id} variants={item}>
                <ListItem
                  disablePadding
                  sx={{
                    mb: 2,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    overflow: "hidden",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <ListItemButton
                    onClick={() => handleSegmentClick(segment.id)}
                  >
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          bgcolor: segment.completed
                            ? "success.main"
                            : "primary.main",
                          color: "white",
                        }}
                      >
                        {segment.completed ? <CheckCircle /> : index + 1}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {segment.name
                              ? segment.name
                              : `Segment ${segment.id}`}
                          </Typography>
                          {segment.completed && (
                            <Chip
                              size="small"
                              label="Completed"
                              color="success"
                              variant="outlined"
                              sx={{ ml: 2 }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          Duration: {formatTime(segment.segmentDuration)}
                        </Typography>
                      }
                    />
                    <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<PlayArrow />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSegmentClick(segment.id);
                        }}
                      >
                        Practice
                      </Button>
                    </Box>
                  </ListItemButton>
                </ListItem>
              </motion.div>
            ))}
          </List>
        </motion.div>
      </motion.div>
    </Container>
  );
}
