import type React from "react";

import { useState } from "react";
import { Box, Container, Paper, Tab, Tabs, Typography } from "@mui/material";
import { TextFields, AudioFile } from "@mui/icons-material";
import TrackContentSplitter from "./track-content-splitter";
import TrackAudioSplitter from "./track-audio-splitter";
import { IPostSegmentItem } from "../../../types/segment";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`track-tabpanel-${index}`}
      aria-labelledby={`track-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `track-tab-${index}`,
    "aria-controls": `track-tabpanel-${index}`,
  };
}

export default function TrackManager() {
  const [tabValue, setTabValue] = useState(0);
  const [sentences, setSentences] = useState<IPostSegmentItem[]>([]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSentencesCreated = (newSentences: IPostSegmentItem[]) => {
    setSentences(newSentences);
    setTabValue(1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        sx={{ marginTop: "10px" }}
        variant="h4"
        component="h1"
        gutterBottom
      >
        Track Manager
      </Typography>

      <Paper elevation={3} sx={{ mb: 4 }}>
        <Box sx={{ padding: "20px" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="track management tabs"
            variant="fullWidth"
          >
            <Tab
              sx={{
                "&:focus": {
                  outline: "none",
                },
              }}
              icon={<TextFields />}
              label="Tách nội dung"
              {...a11yProps(0)}
            />
            <Tab
              sx={{
                "&:focus": {
                  outline: "none",
                },
              }}
              icon={<AudioFile />}
              label="Xử lý audio"
              {...a11yProps(1)}
              disabled={sentences.length === 0}
            />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <TrackContentSplitter onSentencesCreated={handleSentencesCreated} />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <TrackAudioSplitter
              isShowContent={true}
              sentences={sentences}
              setSentences={setSentences}
            />
          </TabPanel>
        </Box>
      </Paper>
    </Container>
  );
}
