import { Container, Typography, Box, Breadcrumbs, Link } from "@mui/material";
import { Home } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import TopicList from "../components/TopicList";

export default function TopicsPage() {
  const navigate = useNavigate();

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
          <Typography color="text.primary">Topics</Typography>
        </Breadcrumbs>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: 700, mb: 2 }}
          >
            Explore Topics
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Choose from a variety of topics designed to improve your English
            listening skills. Each topic contains multiple sessions with
            interactive exercises to help you practice and perfect your
            pronunciation.
          </Typography>
        </Box>

        <TopicList title="Available Topics" showDivider={true} />
      </motion.div>
    </Container>
  );
}
