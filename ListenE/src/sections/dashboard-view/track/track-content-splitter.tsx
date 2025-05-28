import type React from "react";

import { useState, useRef, type ChangeEvent } from "react";
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
  TextField,
  Typography,
  Stack,
  InputAdornment,
  IconButton,
  Fade,
  useTheme,
  Tooltip,
} from "@mui/material";
import {
  AttachFile,
  SplitscreenOutlined,
  TableRows,
  Lightbulb,
} from "@mui/icons-material";
import { IPostSegmentItem } from "../../../types/segment";

interface TrackContentSplitterProps {
  onSentencesCreated: (sentences: IPostSegmentItem[]) => void;
}

export default function TrackContentSplitter({
  onSentencesCreated,
}: TrackContentSplitterProps) {
  const theme = useTheme();
  const [text, setText] = useState<string>("");
  const [sentences, setSentences] = useState<IPostSegmentItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setText(content);
    };
    reader.readAsText(file);
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const splitIntoSentences = () => {
    // Split text by sentence-ending punctuation followed by a space or newline
    // This regex looks for .!? followed by a space or end of string
    const sentenceRegex = /[^.!?]+[.!?]+(\s|$)/g;
    const matches = text.match(sentenceRegex) || [];

    // Clean up sentences and put each on a new line
    const formattedSentences = matches
      .map((sentence) => sentence.trim())
      .join("\n");
    setText(formattedSentences);
  };

  const fillTable = () => {
    const sentenceLines = text.split("\n").filter((line) => line.trim() !== "");
    const sentenceItems = sentenceLines.map((content, index) => ({
      id: index + 1,
      order: index + 1,
      transcript: content.trim(),
    }));
    setSentences(sentenceItems);

    // Pass sentences to parent component
    onSentencesCreated(sentenceItems);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <TextField
          label="Nhập nội dung văn bản"
          multiline
          rows={10}
          value={text}
          onChange={handleTextChange}
          fullWidth
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: theme.palette.primary.light,
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main,
              },
            },
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            borderRadius: 1,
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Tải lên file văn bản">
                  <IconButton
                    onClick={handleClickUpload}
                    edge="end"
                    sx={{
                      mr: 1,
                      "&:focus": {
                        outline: "none",
                      },
                    }}
                  >
                    <AttachFile />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
        <input
          type="file"
          accept=".txt"
          ref={fileInputRef}
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />
      </Box>

      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 3,
          display: "flex",
          alignItems: "center",
          bgcolor: "info.light",
          color: "info.contrastText",
          borderRadius: 2,
        }}
      >
        <Lightbulb sx={{ mr: 1 }} />
        <Typography variant="body2">
          Mẹo: Nhập văn bản hoặc tải lên file, sau đó tách thành các câu và điền
          vào bảng để tiếp tục.
        </Typography>
      </Paper>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mb: 3 }}
        justifyContent="center"
      >
        <Button
          variant="contained"
          startIcon={<SplitscreenOutlined />}
          onClick={splitIntoSentences}
          disabled={!text}
          sx={{
            py: 1.5,
            px: 3,
            borderRadius: 2,
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
            },
            "&:focus": {
              outline: "none",
            },
          }}
        >
          Tách thành các câu
        </Button>

        <Button
          variant="contained"
          color="secondary"
          startIcon={<TableRows />}
          onClick={fillTable}
          disabled={!text}
          sx={{
            py: 1.5,
            px: 3,
            borderRadius: 2,
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
            },
            "&:focus": {
              outline: "none",
            },
          }}
        >
          Điền vào bảng
        </Button>
      </Stack>

      <Fade in={sentences.length > 0}>
        <Box>
          {sentences.length > 0 && (
            <TableContainer
              component={Paper}
              elevation={3}
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Table>
                <TableHead sx={{ bgcolor: theme.palette.primary.light }}>
                  <TableRow>
                    <TableCell
                      width="10%"
                      sx={{ color: "white", fontWeight: "bold" }}
                    >
                      STT
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Nội dung câu
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sentences.map((sentence) => (
                    <TableRow
                      key={sentence.id}
                      sx={{
                        "&:nth-of-type(odd)": {
                          backgroundColor: "action.hover",
                        },
                      }}
                    >
                      <TableCell>{sentence.id}</TableCell>
                      <TableCell>{sentence.transcript}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Fade>
    </Box>
  );
}
