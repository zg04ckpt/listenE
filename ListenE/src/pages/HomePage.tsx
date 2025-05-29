import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
  Avatar,
  Rating,
} from "@mui/material";
import {
  ArrowForward,
  Headphones,
  RecordVoiceOver,
  School,
  SpatialAudio,
  Speed,
  Translate,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import HomeNavbar from "../components/HomeNavbar";

const HomePage = () => {
  const navigate = useNavigate();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Marketing Professional",
      avatar: "https://source.unsplash.com/random/100x100/?woman",
      content:
        "ListenE has transformed my English listening skills! The interactive exercises and real-time feedback helped me gain confidence in business meetings.",
      rating: 5,
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Software Engineer",
      avatar: "https://source.unsplash.com/random/100x100/?man",
      content:
        "I've tried many language website, but this one stands out. The listening exercises are particularly helpful for improving my pronunciation.",
      rating: 4.5,
    },
    {
      id: 3,
      name: "Elena Rodriguez",
      role: "University Student",
      avatar: "https://source.unsplash.com/random/100x100/?student",
      content:
        "As an international student, I needed to improve my English quickly. This website made learning fun and effective!",
      rating: 5,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const features = [
    {
      icon: <Headphones sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Interactive Listening",
      description:
        "Train your ear with native speakers in various scenarios and contexts",
    },
    {
      icon: <RecordVoiceOver sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Speech Recognition",
      description:
        "Get instant feedback on your pronunciation and listening clarity",
    },
    {
      icon: <Translate sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Practical Vocabulary",
      description:
        "Learn useful phrases and expressions for real-life situations",
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Progress Tracking",
      description:
        "Monitor your improvement with detailed performance analytics",
    },
    {
      icon: <SpatialAudio sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Accent Training",
      description:
        "Practice with different English accents from around the world",
    },
    {
      icon: <School sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Structured Learning",
      description: "Follow a proven curriculum designed by language experts",
    },
  ];

  // Animation variants
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
    <>
      <Box
        sx={{
          width: "100vw",
          background: "linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)",
          color: "white",
          pt: { xs: 10, md: 15 },
          pb: { xs: 12, md: 18 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <HomeNavbar />
        {/* Background decoration */}
        <Box
          sx={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -150,
            left: -150,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
          }}
        />

        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    mb: 2,
                    fontSize: { xs: "2.5rem", md: "3.5rem" },
                    textShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  }}
                >
                  Master English Listening with Confidence
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ mb: 4, fontWeight: 400, opacity: 0.9 }}
                >
                  Interactive lessons, real-time feedback, and personalized
                  practice to improve your pronunciation and fluency
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate("/topics")}
                  sx={{
                    bgcolor: "white",
                    color: "primary.main",
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    py: 1.5,
                    px: 4,
                    borderRadius: 3,
                    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                    "&:hover": {
                      bgcolor: "white",
                      transform: "translateY(-3px)",
                      boxShadow: "0 12px 25px rgba(0,0,0,0.3)",
                    },
                  }}
                >
                  Start Learning
                </Button>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  component="img"
                  src="https://res.cloudinary.com/dvk5yt0oi/image/upload/v1744554468/avatar_tmmlz2.png"
                  alt="Language Learning"
                  sx={{
                    width: "100%",
                    height: "auto",
                    borderRadius: 4,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                    transform: "perspective(1000px) rotateY(-5deg)",
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ transform: "translateY(-50px)" }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={10}
              sx={{
                borderRadius: 4,
                py: 4,
                px: { xs: 2, md: 6 },
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              }}
            >
              <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} sm={4} sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h3"
                    component="div"
                    color="primary"
                    sx={{ fontWeight: 700 }}
                  >
                    10M+
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Active Learners
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h3"
                    component="div"
                    color="primary"
                    sx={{ fontWeight: 700 }}
                  >
                    50+
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Interactive Topics
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h3"
                    component="div"
                    color="primary"
                    sx={{ fontWeight: 700 }}
                  >
                    95%
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Success Rate
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{ fontWeight: 700, mb: 2 }}
          >
            Why Choose ListenE
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 700, mx: "auto" }}
          >
            Our comprehensive approach to language learning focuses on practical
            skills and real-world applications
          </Typography>
        </Box>

        <motion.div variants={container} initial="hidden" animate="show">
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div variants={item}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 4,
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-10px)",
                        boxShadow: "0 12px 30px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4, textAlign: "center" }}>
                      <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                      <Typography
                        variant="h5"
                        component="h3"
                        sx={{ fontWeight: 600, mb: 1 }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: "rgba(63, 81, 181, 0.05)", py: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{ fontWeight: 700, mb: 2 }}
            >
              What Our Users Say
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 700, mx: "auto" }}
            >
              Join thousands of satisfied learners who have improved their
              English listening skills with ListenE
            </Typography>
          </Box>

          <Box
            sx={{ position: "relative", height: { xs: 300, md: 250 }, mb: 4 }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: index === activeTestimonial ? 1 : 0,
                  x:
                    index === activeTestimonial
                      ? 0
                      : index < activeTestimonial
                      ? -100
                      : 100,
                }}
                transition={{ duration: 0.5 }}
                style={{
                  position: "absolute",
                  width: "100%",
                  display: index === activeTestimonial ? "block" : "none",
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    maxWidth: 800,
                    mx: "auto",
                    position: "relative",
                  }}
                >
                  <Typography
                    variant="body1"
                    paragraph
                    sx={{ fontStyle: "italic", mb: 3 }}
                  >
                    "{testimonial.content}"
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      src={testimonial.avatar}
                      sx={{ width: 60, height: 60, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                      <Rating
                        value={testimonial.rating}
                        precision={0.5}
                        readOnly
                        size="small"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Box>
                </Paper>
              </motion.div>
            ))}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
            {testimonials.map((_, index) => (
              <Box
                key={index}
                onClick={() => setActiveTestimonial(index)}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor:
                    index === activeTestimonial
                      ? "primary.main"
                      : "rgba(0,0,0,0.2)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            sx={{
              p: { xs: 4, md: 8 },
              borderRadius: 4,
              background: "linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)",
              color: "white",
              textAlign: "center",
              boxShadow: "0 15px 50px rgba(63, 81, 181, 0.3)",
            }}
          >
            <Typography
              variant="h3"
              component="h2"
              sx={{ fontWeight: 700, mb: 2 }}
            >
              Ready to Improve Your English?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                fontWeight: 400,
                opacity: 0.9,
                maxWidth: 800,
                mx: "auto",
              }}
            >
              Start your journey to fluent English listening today with our
              interactive lessons and personalized feedback
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate("/topics")}
              sx={{
                bgcolor: "white",
                color: "primary.main",
                fontWeight: 600,
                fontSize: "1.1rem",
                py: 1.5,
                px: 4,
                borderRadius: 3,
                "&:hover": {
                  bgcolor: "white",
                  transform: "translateY(-3px)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
                },
              }}
            >
              Get Started Now
            </Button>
          </Paper>
        </motion.div>
      </Container>
    </>
  );
};

export default HomePage;
