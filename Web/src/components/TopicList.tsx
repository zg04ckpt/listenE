import { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  Skeleton,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ArrowForward } from "@mui/icons-material";
import { motion } from "framer-motion";
import type { ITopicItem } from "../types/topic";
import { getAllTopics } from "../api/topic";

export type Props = {
  title?: string;
  showDivider?: boolean;
};

export default function TopicList({
  title = "Topics",
  showDivider = true,
}: Props) {
  const [topics, setTopics] = useState<ITopicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleGetAllTopics = async () => {
    setLoading(true);
    try {
      const response = await getAllTopics();
      setTopics(response?.data?.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetAllTopics();
  }, []);

  const handleTopicClick = (topicId: number) => {
    navigate(`/topic/${topicId}`);
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

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{ fontWeight: 600 }}
      >
        {title}
      </Typography>
      {showDivider && <Divider sx={{ mb: 4 }} />}

      <motion.div variants={container} initial="hidden" animate="show">
        <Grid container spacing={3}>
          {loading
            ? Array.from(new Array(6)).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ height: "100%" }}>
                    <Skeleton variant="rectangular" height={200} />
                    <CardContent>
                      <Skeleton variant="text" height={40} />
                      <Skeleton variant="text" height={20} width="60%" />
                      <Skeleton variant="text" height={80} />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            : topics.map((topic) => (
                <Grid item xs={12} sm={6} md={4} key={topic.id}>
                  <motion.div variants={item}>
                    <Card
                      sx={{
                        height: "100%",
                        cursor: "pointer",
                        position: "relative",
                        overflow: "visible",
                        display: "flex",
                        flexDirection: "column",
                      }}
                      onClick={() => handleTopicClick(topic.id)}
                    >
                      <Box sx={{ position: "relative" }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={topic.thumbnailUrl}
                          alt={topic.name}
                        />
                      </Box>
                      <CardContent
                        sx={{
                          pt: 3,
                          display: "flex",
                          flexDirection: "column",
                          flexGrow: 1,
                        }}
                      >
                        <Typography
                          variant="h5"
                          component="h3"
                          gutterBottom
                          sx={{
                            fontWeight: 600,
                            height: "2.6em",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {topic.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
                            height: "4.5em",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {topic.description}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mt: "auto",
                          }}
                        >
                          <Button
                            size="small"
                            endIcon={<ArrowForward />}
                            sx={{
                              fontWeight: 600,
                              "&:focus": { outline: "none" },
                            }}
                          >
                            Explore
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
        </Grid>
      </motion.div>
    </Box>
  );
}
