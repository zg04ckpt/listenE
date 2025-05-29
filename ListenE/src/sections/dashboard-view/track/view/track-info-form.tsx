import type React from "react";

import { motion } from "framer-motion";
import {
  Card,
  Box,
  Typography,
  CardContent,
  TextField,
  InputAdornment,
  type Theme,
} from "@mui/material";
import { MusicNote, Title, Description, AudioFile } from "@mui/icons-material";

interface TrackInfoFormProps {
  trackName: string;
  trackNameError: string;
  fullTranscript: string;
  trackData: any;
  handleTrackNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFullTranscriptChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  theme: Theme;
  itemVariants: any;
}

export default function TrackInfoForm({
  trackName,
  trackNameError,
  fullTranscript,
  trackData,
  handleTrackNameChange,
  handleFullTranscriptChange,
  theme,
  itemVariants,
}: TrackInfoFormProps) {
  return (
    <Card
      elevation={3}
      sx={{
        mb: 4,
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        },
      }}
      component={motion.div}
      variants={itemVariants}
    >
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          py: 1.5,
          px: 3,
          display: "flex",
          alignItems: "center",
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
        }}
      >
        <MusicNote sx={{ mr: 1 }} />
        <Typography variant="h6">Thông tin Track</Typography>
      </Box>
      <CardContent sx={{ p: 3 }}>
        <TextField
          label="Tên Track"
          value={trackName}
          onChange={handleTrackNameChange}
          error={!!trackNameError}
          helperText={trackNameError}
          fullWidth
          required
          margin="normal"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Title />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              transition: "all 0.3s ease",
              "&:hover fieldset": {
                borderColor: theme.palette.primary.main,
              },
              "&.Mui-focused fieldset": {
                borderWidth: "2px",
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: theme.palette.primary.main,
            },
          }}
        />

        <TextField
          label="Nội dung đầy đủ"
          value={fullTranscript}
          onChange={handleFullTranscriptChange}
          fullWidth
          multiline
          rows={6}
          margin="normal"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment
                position="start"
                sx={{ alignSelf: "flex-start", mt: 1.5, mr: 1 }}
              >
                <Description />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              transition: "all 0.3s ease",
              "&:hover fieldset": {
                borderColor: theme.palette.primary.main,
              },
              "&.Mui-focused fieldset": {
                borderWidth: "2px",
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: theme.palette.primary.main,
            },
          }}
        />

        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <AudioFile sx={{ mr: 1, color: "text.secondary" }} />
          <Typography variant="body2" color="text.secondary">
            Audio: {trackData?.fullAudioDuration || "Không có thông tin"}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
