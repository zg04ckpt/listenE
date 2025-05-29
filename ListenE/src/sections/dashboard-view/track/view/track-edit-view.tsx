import type React from "react";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Alert,
  Backdrop,
  CircularProgress,
  alpha,
  Tab,
  Tabs,
  Container,
  Zoom,
  useTheme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Save, TextFields, AudioFile } from "@mui/icons-material";
import { motion } from "framer-motion";
import type { IPostSegmentItem } from "../../../../types/segment";
import { useNotification } from "../../../../provider/NotificationProvider";
import { getDetailsTrack, updateTrack } from "../../../../api/track";
import TrackAudioSplitter from "../track-audio-splitter";
import TrackHeader from "./track-header";
import TrackInfoForm from "./track-info-form";
import TabPanel from "./track-tab-panel";
import ConfirmationDialog from "./track-confirm-dialog";
import LoadingOverlay from "./track-loading-overlay";

export default function TrackEditView() {
  const theme = useTheme();
  const { showSuccess, showError } = useNotification();
  const { trackId } = useParams<{
    trackId: string;
  }>();
  const navigate = useNavigate();

  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackData, setTrackData] = useState<any>(null);

  // Track information
  const [trackName, setTrackName] = useState("");
  const [trackNameError, setTrackNameError] = useState("");
  const [fullTranscript, setFullTranscript] = useState("");
  const [segments, setSegments] = useState<IPostSegmentItem[]>([]);
  const [originalSegments, setOriginalSegments] = useState<IPostSegmentItem[]>(
    []
  );

  console.log(originalSegments);

  // Dialog state
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [segmentToClean, setSegmentToClean] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [segmentToDelete, setSegmentToDelete] = useState<number | null>(null);

  // Fetch track data
  useEffect(() => {
    const fetchTrackData = async () => {
      if (!trackId) return;

      setLoading(true);
      try {
        const response = await getDetailsTrack(Number.parseInt(trackId));
        const data = response?.data?.data || response; // Adjust based on your API response structure

        setTrackData(data);
        setTrackName(data.name);
        setFullTranscript(data.fullAudioTranscript || data.fullTranscript);
        setSegments(data.segments);
        setOriginalSegments(JSON.parse(JSON.stringify(data.segments)));
      } catch (err) {
        console.error("Error fetching track:", err);
        showError("Không thể tải thông tin track. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrackData();
  }, [trackId, showError]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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

  const handleFullTranscriptChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFullTranscript(e.target.value);
  };

  const handleClearConfirm = () => {
    if (segmentToClean !== null) {
      setSegments((prev) =>
        prev.map((s) => {
          if (s.id === segmentToClean) {
            return {
              ...s,
              startSec: undefined,
              endSec: undefined,
            };
          }
          return s;
        })
      );
    }

    setClearDialogOpen(false);
    setSegmentToClean(null);
  };

  const handleClearCancel = () => {
    setClearDialogOpen(false);
    setSegmentToClean(null);
  };

  const handleDeleteConfirm = () => {
    if (segmentToDelete !== null) {
      setSegments((prev) => prev.filter((s) => s.id !== segmentToDelete));
    }

    setDeleteDialogOpen(false);
    setSegmentToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSegmentToDelete(null);
  };

  const handleSaveChanges = async () => {
    if (!trackName) {
      setTrackNameError("Vui lòng nhập tên cho track");
      return;
    }

    setApiLoading(true);
    setError(null);

    try {
      const updateData = {
        id: Number.parseInt(trackId as string),
        name: trackName,
        fullTranscript: fullTranscript,
        segments: segments.map((segment) => {
          return {
            id: segment.isCreate ? null : segment.id,
            transcript: segment.transcript,
            orderInTrack: segment.order ?? 0,
            startSec: segment.startSec,
            endSec: segment.endSec,
          };
        }),
      };

      console.log("Track update data:", JSON.stringify(updateData, null, 2));

      if (trackId) {
        await updateTrack(Number.parseInt(trackId), updateData);
        showSuccess("Cập nhật track thành công!");
        setOriginalSegments(JSON.parse(JSON.stringify(segments)));

        navigate(`/dashboard/manage-tracks`);
      }
    } catch (err) {
      console.error("API error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Không thể cập nhật track. Vui lòng thử lại sau.");
      }
    } finally {
      setApiLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  // Save button component to be reused in both tabs
  const SaveButton = () => (
    <LoadingButton
      loading={apiLoading}
      variant="contained"
      color="primary"
      startIcon={<Save />}
      onClick={handleSaveChanges}
      disabled={!trackName || !!trackNameError}
      sx={{
        minWidth: 180,
        borderRadius: 2,
        py: 1.2,
        background: `linear-gradient(45deg, ${theme.palette.success.main}, ${theme.palette.success.light})`,
        boxShadow: `0 4px 10px ${alpha(theme.palette.success.main, 0.4)}`,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: `0 6px 15px ${alpha(theme.palette.success.main, 0.5)}`,
        },
        "&:focus": {
          outline: "none",
        },
      }}
    >
      {apiLoading ? "Đang xử lý..." : "Lưu thay đổi"}
    </LoadingButton>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <TrackHeader navigate={navigate} />

        {error && (
          <Zoom in={!!error}>
            <Alert
              severity="error"
              onClose={() => setError(null)}
              sx={{ mb: 3 }}
            >
              {error}
            </Alert>
          </Zoom>
        )}

        <Box
          component="div"
          sx={{
            mb: 4,
            borderRadius: 3,
            overflow: "hidden",
            background: `linear-gradient(to right, ${alpha(
              theme.palette.primary.main,
              0.05
            )}, ${alpha(theme.palette.primary.main, 0.02)})`,
            boxShadow: 4,
          }}
        >
          <Box sx={{ padding: "20px" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="track edit tabs"
              variant="fullWidth"
              sx={{
                "& .MuiTabs-indicator": {
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                  background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                },
                "& .Mui-selected": {
                  color: `${theme.palette.primary.main} !important`,
                  fontWeight: "bold",
                },
                "& .MuiTab-root": {
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  },
                },
              }}
            >
              <Tab
                sx={{
                  "&:focus": {
                    outline: "none",
                  },
                  py: 2,
                }}
                icon={<TextFields />}
                label="Chỉnh sửa nội dung"
                id="track-tab-0"
                aria-controls="track-tabpanel-0"
              />
              <Tab
                sx={{
                  "&:focus": {
                    outline: "none",
                  },
                  py: 2,
                }}
                icon={<AudioFile />}
                label="Chỉnh sửa các segment"
                id="track-tab-1"
                aria-controls="track-tabpanel-1"
              />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <TrackInfoForm
                  trackName={trackName}
                  trackNameError={trackNameError}
                  fullTranscript={fullTranscript}
                  trackData={trackData}
                  handleTrackNameChange={handleTrackNameChange}
                  handleFullTranscriptChange={handleFullTranscriptChange}
                  theme={theme}
                  itemVariants={itemVariants}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 3,
                  }}
                  component={motion.div}
                  variants={itemVariants}
                >
                  <SaveButton />
                </Box>
              </motion.div>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <TrackAudioSplitter
                isShowContent={false}
                sentences={segments}
                setSentences={setSegments}
                fullAudioURL={trackData?.fullAudioUrl}
                isEditMode={true} // Set to true for edit mode
                hideCreateButton={true} // Hide the create button in edit mode
              />

              {/* Add Save button at the bottom of the audio tab */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 3,
                }}
              >
                <SaveButton />
              </Box>
            </TabPanel>
          </Box>
        </Box>

        {/* Clear Confirmation Dialog */}
        <ConfirmationDialog
          open={clearDialogOpen}
          onClose={handleClearCancel}
          onConfirm={handleClearConfirm}
          title="Xác nhận xóa thông tin"
          content="Bạn có chắc chắn muốn xóa thông tin thời gian đã gán cho segment này không? Sau khi xóa, bạn có thể gán thông tin mới cho segment này."
          confirmButtonText="Xóa"
          confirmButtonColor="error"
          theme={theme}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmationDialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Xác nhận xóa segment"
          content="Bạn có chắc chắn muốn xóa segment này không? Hành động này không thể hoàn tác."
          confirmButtonText="Xóa"
          confirmButtonColor="error"
          theme={theme}
        />

        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backdropFilter: "blur(3px)",
          }}
          open={loading || apiLoading}
        >
          <LoadingOverlay
            loading={loading}
            message={loading ? "Đang tải dữ liệu..." : "Đang cập nhật track..."}
          />
        </Backdrop>
      </motion.div>
    </Container>
  );
}
