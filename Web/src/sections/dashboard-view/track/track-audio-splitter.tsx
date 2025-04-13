import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack,
  Alert,
  Backdrop,
  CircularProgress,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Divider,
  Chip,
  Tooltip,
  Card,
  CardContent,
  InputAdornment,
  alpha,
} from "@mui/material";
import {
  CloudUpload,
  ContentCut,
  PlayArrow,
  Stop,
  PlayCircleOutline,
  PauseCircleOutline,
  Clear,
  MusicNote,
  Save,
  Title,
  Description,
  AudioFile,
} from "@mui/icons-material";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";
import type { IPostSegmentItem } from "../../../types/segment";
import { createSessionTrack } from "../../../api/session";
import { useNotification } from "../../../provider/NotificationProvider";

interface RegionOptions {
  start: number;
  end: number;
  color?: string;
  drag?: boolean;
  resize?: boolean;
}

export default function TrackAudioSplitter({
  sentences = [],
  setSentences,
}: {
  sentences: IPostSegmentItem[];
  setSentences: React.Dispatch<React.SetStateAction<IPostSegmentItem[]>>;
}) {
  const { showSuccess } = useNotification();
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [isPlaying, setIsPlaying] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const [selectedSentenceId, setSelectedSentenceId] = useState<number | null>(
    null
  );
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [regionsPlugin, setRegionsPlugin] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastAssignedSentenceId, setLastAssignedSentenceId] = useState<
    number | null
  >(null);
  const [playingSentenceId, setPlayingSentenceId] = useState<number | null>(
    null
  );
  const [apiLoading, setApiLoading] = useState(false);

  // State for track name
  const [trackName, setTrackName] = useState("");
  const [trackNameError, setTrackNameError] = useState("");

  // State for clear confirmation dialog
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [sentenceToClean, setSentenceToClean] = useState<number | null>(null);

  const waveformRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const handleCreateNewSessionTrack = async (
    sessionId: number,
    params: FormData
  ) => {
    try {
      const response = await createSessionTrack(sessionId, params);
      return response.data;
    } catch (error) {
      console.error("Error creating track:", error);
      throw error;
    }
  };

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  useEffect(() => {
    if (waveformRef.current && !wavesurfer) {
      try {
        const regions = RegionsPlugin.create();

        if (regions) {
          // @ts-ignore - These properties exist at runtime
          regions.regionsMinLength = 0.1;
          // @ts-ignore - These properties exist at runtime
          regions.dragSelection = true;
        }

        const ws = WaveSurfer.create({
          container: waveformRef.current,
          waveColor: "#4a83ff",
          progressColor: "#1e50ff",
          cursorColor: "#333",
          barWidth: 2,
          barGap: 1,
          height: 200,
          normalize: true,
          plugins: [regions],
        });

        ws.on("ready", () => {
          setupInitialRegion(ws, regions);
        });

        ws.on("finish", () => setIsPlaying(false));

        regions.on("region-updated", (region: any) => {
          setSelectedRegion({ start: region.start, end: region.end });
        });

        setWavesurfer(ws);
        setRegionsPlugin(regions);

        return () => ws.destroy();
      } catch (err) {
        console.error("Error initializing WaveSurfer:", err);
        setError("Không thể khởi tạo trình phát âm thanh. Vui lòng thử lại.");
      }
    }
  }, [waveformRef]);

  const setupInitialRegion = (ws: WaveSurfer, regions: any) => {
    try {
      const duration = ws.getDuration();
      if (duration > 0) {
        regions.clearRegions();

        const regionLength = Math.min(3, duration * 0.1);
        const regionOptions: RegionOptions = {
          start: 0,
          end: regionLength,
          color: "rgba(74, 131, 255, 0.2)",
          drag: true,
          resize: true,
        };
        const region = regions.addRegion(regionOptions);

        if (region) setSelectedRegion({ start: region.start, end: region.end });
      }
    } catch (err) {
      console.error("Error setting up initial region:", err);
      setError("Không thể thiết lập vùng phát âm thanh. Vui lòng thử lại.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const url = URL.createObjectURL(file);
      setAudioFile(file);
      setAudioUrl(url);

      if (wavesurfer) {
        wavesurfer.load(url);
      } else {
        throw new Error("WaveSurfer is not initialized");
      }

      setLoading(false);
    } catch (err) {
      console.error("Error loading file:", err);
      setError("Không thể tải file âm thanh. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  const togglePlayback = () => {
    if (!wavesurfer) return;

    if (isPlaying) {
      wavesurfer.pause();
      setIsPlaying(false);
    } else if (selectedRegion) {
      const playbackDuration = selectedRegion.end - selectedRegion.start;

      wavesurfer.play(selectedRegion.start, selectedRegion.end);
      setIsPlaying(true);

      setTimeout(() => {
        setIsPlaying(false);
      }, playbackDuration * 1000 + 50);
    } else {
      wavesurfer.play();
      setIsPlaying(true);
    }
  };

  const assignRegionToSentence = () => {
    if (!selectedRegion || !selectedSentenceId) {
      setError("Vui lòng chọn vùng và câu trước khi gán.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { start, end } = selectedRegion;

      setSentences((prev) =>
        prev.map((s) => {
          if (s.id === selectedSentenceId) {
            return {
              ...s,
              startSec: start,
              endSec: end,
            };
          }
          return s;
        })
      );

      if (regionsPlugin) {
        regionsPlugin.clearRegions();
        const region = regionsPlugin.addRegion({
          start: end,
          end: Math.min(end + (end - start), wavesurfer?.getDuration() || 0),
          color: "rgba(74, 131, 255, 0.2)",
          drag: true,
          resize: true,
        });

        if (region) setSelectedRegion({ start: region.start, end: region.end });
      }

      setLastAssignedSentenceId(selectedSentenceId);
      setLoading(false);
    } catch (err) {
      console.error("Assignment error:", err);
      setError("Không thể gán thời gian cho câu. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  const playSentenceAudio = (sentenceId: number) => {
    if (!audioUrl) return;

    const sentence = sentences.find((s) => s.id === sentenceId);
    if (
      !sentence ||
      sentence.startSec === undefined ||
      sentence.endSec === undefined
    ) {
      setError("Câu này chưa được gán thời gian.");
      return;
    }

    // If we're already playing this sentence, pause it
    if (playingSentenceId === sentenceId) {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
      setPlayingSentenceId(null);
      return;
    }

    // Create or get audio element
    if (!audioElementRef.current) {
      audioElementRef.current = new Audio(audioUrl);
    } else {
      audioElementRef.current.src = audioUrl;
    }

    // Set up event listeners
    audioElementRef.current.onended = () => {
      setPlayingSentenceId(null);
    };

    // Set the current time to the start time of the sentence
    audioElementRef.current.currentTime = sentence.startSec;

    // Play the audio
    audioElementRef.current.play();

    // Set the playing sentence ID
    setPlayingSentenceId(sentenceId);

    // Set a timeout to pause the audio when it reaches the end time
    const duration = sentence.endSec - sentence.startSec;
    setTimeout(() => {
      if (audioElementRef.current && playingSentenceId === sentenceId) {
        audioElementRef.current.pause();
        setPlayingSentenceId(null);
      }
    }, duration * 1000 + 50);
  };

  // Handle opening the clear confirmation dialog
  const handleClearClick = (sentenceId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row selection
    setSentenceToClean(sentenceId);
    setClearDialogOpen(true);
  };

  // Handle confirming the clear action
  const handleClearConfirm = () => {
    if (sentenceToClean !== null) {
      setSentences((prev) =>
        prev.map((s) => {
          if (s.id === sentenceToClean) {
            // Remove timing information
            const { startSec, endSec, ...rest } = s;
            return rest as IPostSegmentItem;
          }
          return s;
        })
      );

      // If this was the last assigned sentence, reset that state
      if (lastAssignedSentenceId === sentenceToClean) {
        setLastAssignedSentenceId(null);
      }

      // If this sentence was playing, stop it
      if (playingSentenceId === sentenceToClean) {
        if (audioElementRef.current) {
          audioElementRef.current.pause();
        }
        setPlayingSentenceId(null);
      }
    }

    // Close the dialog and reset state
    setClearDialogOpen(false);
    setSentenceToClean(null);
  };

  // Handle canceling the clear action
  const handleClearCancel = () => {
    setClearDialogOpen(false);
    setSentenceToClean(null);
  };

  const formatTime = (time: number): string => {
    const m = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    const ms = Math.floor((time % 1) * 1000)
      .toString()
      .padStart(3, "0");
    return `${m}:${s}.${ms}`;
  };

  const handleTrackNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTrackName(value);

    if (!value) {
      setTrackNameError("Tên track không được để trống");
    } else if (value.length > 255) {
      setTrackNameError("Tên track không được vượt quá 255 ký tự");
    } else {
      setTrackNameError("");
    }
  };

  const getFullTranscript = (): string => {
    return sentences.map((s) => s.transcript).join(" ");
  };

  const handleCreateNew = async () => {
    // Validate track name
    if (!trackName) {
      setTrackNameError("Vui lòng nhập tên cho track");
      return;
    }

    // Check if audio file is uploaded
    if (!audioFile) {
      setError("Vui lòng tải lên file audio");
      return;
    }

    // Check if all sentences have been assigned times
    const unassignedSentences = sentences.filter(
      (s) => s.startSec === undefined || s.endSec === undefined
    );

    if (unassignedSentences.length > 0) {
      setError(
        `Còn ${unassignedSentences.length} câu chưa được gán thời gian.`
      );
      return;
    }

    setApiLoading(true);
    setError(null);

    try {
      // Create FormData to send to API
      const formData = new FormData();
      formData.append("name", trackName);
      formData.append("fullTranscript", getFullTranscript());
      formData.append("fullAudio", audioFile);
      formData.append("segments", JSON.stringify(sentences));

      // Call API to create new track
      if (sessionId) {
        const response = await handleCreateNewSessionTrack(
          Number(sessionId),
          formData
        );
        console.log("Track created successfully:", response);
        showSuccess("Tạo mới track thành công!");

        // Reset form after successful creation
        setTrackName("");
        setAudioFile(null);
        setAudioUrl(null);
        if (wavesurfer) {
          wavesurfer.empty();
        }
        setSentences([]);
        navigate(`/dashboard/manage-sessions`);
      } else {
        throw new Error("Session ID is missing");
      }
    } catch (err) {
      console.error("API error:", err);
      setError("Không thể tạo mới track. Vui lòng thử lại sau.");
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Tạo Track Mới
      </Typography>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Track Information Card */}
      <Card
        elevation={3}
        sx={{
          mb: 4,
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <Box
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            py: 1.5,
            px: 3,
            display: "flex",
            alignItems: "center",
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
              mb: 2,
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "primary.light",
                },
              },
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Description sx={{ mr: 1, color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              Transcript:{" "}
              {sentences.length > 0
                ? `${getFullTranscript().substring(0, 100)}${
                    getFullTranscript().length > 100 ? "..." : ""
                  }`
                : "Chưa có nội dung"}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AudioFile sx={{ mr: 1, color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              Audio: {audioFile ? audioFile.name : "Chưa tải lên file audio"}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{ mb: 2, display: "flex", alignItems: "center" }}
        >
          <AudioFile sx={{ mr: 1 }} /> Xử lý audio cho từng câu
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Stack direction="row" spacing={2} mb={2}>
          <Button
            variant="contained"
            startIcon={<CloudUpload />}
            onClick={() => fileInputRef.current?.click()}
            sx={{
              "&:focus": {
                outline: "none",
              },
              borderRadius: 2,
            }}
          >
            Tải lên audio
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            accept="audio/*"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />

          <Button
            variant="contained"
            startIcon={isPlaying ? <Stop /> : <PlayArrow />}
            onClick={togglePlayback}
            disabled={!audioFile}
            sx={{
              "&:focus": {
                outline: "none",
              },
              borderRadius: 2,
            }}
          >
            {isPlaying ? "Dừng" : "Phát"}
          </Button>

          <Button
            variant="contained"
            color="secondary"
            startIcon={<ContentCut />}
            onClick={assignRegionToSentence}
            disabled={
              !audioFile ||
              !selectedRegion ||
              !selectedSentenceId ||
              selectedSentenceId === lastAssignedSentenceId
            }
            sx={{
              "&:focus": {
                outline: "none",
              },
              borderRadius: 2,
            }}
          >
            Gán thời gian
          </Button>
        </Stack>

        <Box sx={{ backgroundColor: "#f5f5f5", borderRadius: 2, p: 2 }}>
          <div ref={waveformRef} />
          {selectedRegion && (
            <Box display="flex" justifyContent="space-between" mt={1}>
              <Typography>
                Bắt đầu: {formatTime(selectedRegion.start)}
              </Typography>
              <Typography>
                Kết thúc: {formatTime(selectedRegion.end)}
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      {sentences.length > 0 && (
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            mb: 4,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <Table>
            <TableHead sx={{ bgcolor: alpha("#1976d2", 0.1) }}>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Nội dung câu</TableCell>
                <TableCell>Thời gian bắt đầu</TableCell>
                <TableCell>Thời gian kết thúc</TableCell>
                <TableCell align="center">Phát</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sentences.map((sentence) => (
                <TableRow
                  key={sentence.id}
                  hover
                  selected={selectedSentenceId === sentence.id}
                  onClick={() => setSelectedSentenceId(sentence.id)}
                  sx={{
                    cursor: "pointer",
                    "&:nth-of-type(odd)": { bgcolor: alpha("#f5f5f5", 0.5) },
                  }}
                >
                  <TableCell>{sentence.id}</TableCell>
                  <TableCell>{sentence.transcript}</TableCell>
                  <TableCell>
                    {sentence.startSec !== undefined ? (
                      <Chip
                        label={formatTime(sentence.startSec)}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {sentence.endSec !== undefined ? (
                      <Chip
                        label={formatTime(sentence.endSec)}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {sentence.startSec !== undefined &&
                    sentence.endSec !== undefined ? (
                      <IconButton
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          playSentenceAudio(sentence.id);
                        }}
                      >
                        {playingSentenceId === sentence.id ? (
                          <PauseCircleOutline />
                        ) : (
                          <PlayCircleOutline />
                        )}
                      </IconButton>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {sentence.startSec !== undefined &&
                    sentence.endSec !== undefined ? (
                      <Tooltip title="Xóa thông tin thời gian">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={(e) => handleClearClick(sentence.id, e)}
                          sx={{
                            "&:hover": {
                              backgroundColor: "rgba(211, 47, 47, 0.04)",
                            },
                          }}
                        >
                          <Clear />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {sentences.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<Save />}
            onClick={handleCreateNew}
            disabled={apiLoading || !trackName || !!trackNameError}
            sx={{
              minWidth: 150,
              borderRadius: 2,
              py: 1.2,
              "&:focus": {
                outline: "none",
              },
            }}
          >
            {apiLoading ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                Đang xử lý...
              </Box>
            ) : (
              "Tạo Track"
            )}
          </Button>
        </Box>
      )}

      {/* Clear Confirmation Dialog */}
      <Dialog
        open={clearDialogOpen}
        onClose={handleClearCancel}
        aria-labelledby="clear-dialog-title"
        aria-describedby="clear-dialog-description"
      >
        <DialogTitle id="clear-dialog-title">
          Xác nhận xóa thông tin
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="clear-dialog-description">
            Bạn có chắc chắn muốn xóa thông tin thời gian đã gán cho segment này
            không? Sau khi xóa, bạn có thể gán thông tin mới cho segment này.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClearCancel} color="primary">
            Hủy
          </Button>
          <Button
            onClick={handleClearConfirm}
            color="error"
            variant="contained"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading || apiLoading}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <CircularProgress color="inherit" />
          <Typography>
            {loading ? "Đang xử lý audio..." : "Đang tạo track..."}
          </Typography>
        </Box>
      </Backdrop>
    </Box>
  );
}
