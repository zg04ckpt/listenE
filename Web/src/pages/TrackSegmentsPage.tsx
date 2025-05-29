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
import { getDetailsTopic } from "../api/topic";
import { ITopicItem } from "../types/topic";
import { formatTime } from "../utils/formats";

export default function TrackSegmentsPage() {
  const { topicId, trackId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<ITopicItem | null>(null);
  const [track, setTrack] = useState<ITrackReponseItem | null>(null);
  const [segments, setSegments] = useState<ISegmentResponseItem[]>([]);
  const [loading, setLoading] = useState(true);

  const handelGetDetailsData = async (topicId: number, trackId: number) => {
    setLoading(true);
    try {
      const [topicRes, trackRes] = await Promise.all([
        getDetailsTopic(topicId),
        getDetailsTrack(trackId),
      ]);

      setTopic(topicRes?.data?.data);
      setTrack(trackRes?.data?.data);
      setSegments(trackRes?.data?.data?.segments);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (topicId && trackId)
      handelGetDetailsData(Number(topicId), Number(trackId));
  }, [topicId, trackId]);

  const handleSegmentClick = (segmentId: number) => {
    navigate(`/topic/${topicId}/track/${trackId}/segment/${segmentId}`);
  };

  const handlePracticeAll = () => {
    navigate(`/topic/${topicId}/track/${trackId}`);
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
            onClick={() => navigate(`/topic/${topic?.id}`)}
            style={{ cursor: "pointer" }}
          >
            {topic?.name}
          </Link>
          <Typography color="text.primary">{track.name} Segments</Typography>
        </Breadcrumbs>

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
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
            borderRadius: 2,
            bgcolor: "rgba(0,0,0,0.02)",
            mb: 4,
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <Typography variant="body1" paragraph>
            This track is divided into {segments.length} segments for more
            focused practice. You can practice each segment individually or
            practice the full track.
          </Typography>
          <Button
            variant="contained"
            startIcon={<PlayArrow />}
            onClick={handlePracticeAll}
            sx={{
              borderRadius: "20px",
              px: 3,
              py: 1,
              fontWeight: 600,
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.1)",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
              },
            }}
          >
            Practice Full Track
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
        <Divider sx={{ mb: 3 }} />

        <motion.div variants={container} initial="hidden" animate="show">
          <List>
            {segments.map((segment, index) => (
              <motion.div key={segment.id} variants={item}>
                <ListItem
                  disablePadding
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    overflow: "hidden",
                    bgcolor: "white",
                    border: "1px solid rgba(0,0,0,0.08)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                    },
                  }}
                >
                  <ListItemButton
                    onClick={() => handleSegmentClick(segment.id)}
                    sx={{ py: 2 }}
                  >
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          bgcolor: segment.completed
                            ? "success.main"
                            : "primary.main",
                          width: 36,
                          height: 36,
                        }}
                      >
                        {segment.completed ? <CheckCircle /> : index + 1}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                        >
                          Segment {index + 1}
                        </Typography>
                      }
                      secondary={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 1,
                            mt: 0.5,
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            Duration: {formatTime(segment.segmentDuration)}
                          </Typography>
                          {segment.completed && (
                            <Chip
                              label="Completed"
                              size="small"
                              color="success"
                              sx={{ height: 24 }}
                            />
                          )}
                        </Box>
                      }
                    />
                    <PlayArrow color="primary" />
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
