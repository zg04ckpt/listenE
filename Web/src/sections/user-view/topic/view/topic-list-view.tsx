"use client";

import { Box, Grid, Button, Typography } from "@mui/material";

import {
  ITopicItem,
  ITopicsFilterValue,
  ITopicsFilters,
} from "../../../../types/topic";

import ClientExamTableToolbar from "../client-exam-table-toolbar";

type Props = {
  tableData: ITopicItem[];

  filters: ITopicsFilters;
  onFilters: (name: string, value: ITopicsFilterValue) => void;
};

export default function ExamListDocument({
  tableData,
  filters,
  onFilters,
}: Props) {
  return (
    <>
      <ClientExamTableToolbar filters={filters} onFilters={onFilters} />
      <Grid sx={{ marginTop: 2 }} container spacing={2}>
        {tableData &&
          tableData.length > 0 &&
          tableData.map((exam, index) => (
            <Grid item xs={12} sm={6} md={2.4} key={index}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "1rem",
                  paddingBottom: "3.2rem",
                  borderRadius: "0.65rem",
                  boxShadow: "0 4px 0 0 rgba(143, 156, 173, .2)",
                  backgroundColor: "#fff",
                  border: "1px solid #e0e0e0",
                  justifyContent: "center",
                  "&:hover": {
                    boxShadow:
                      "0 1px 2px 0 rgba(60, 64, 67, .2), 0 2px 6px 2px rgba(60, 64, 67, .15)",
                    cursor: "pointer",
                    transform: "translateY(-2px)",
                    transition: "all 0.4s",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: "16px",
                    marginBottom: "0.25rem",
                    overflow: "hidden",
                    display: "-webkit-box",
                    "-webkit-line-clamp": "3",
                    "-webkit-box-orient": "vertical",
                    fontWeight: 700,
                    lineHeight: "20px",
                    height: "60px",
                    color: "#1a1a1a",
                  }}
                >
                  {exam.name}
                </Typography>
                {/* <Typography
                  sx={{
                    display: "flex",
                    fontSize: "0.9rem",
                    color: "#677788",
                    alignItems: "center",
                    fontWeight: 500,
                    lineHeight: 1.4,
                    height: "20.15px",
                  }}
                >
                  {exam && exam.skillTopics && exam.skillTopics.length > 0
                    ? `${exam.skillTopics.length} phần thi | ${exam.totalQuestion} câu hỏi`
                    : ""}
                </Typography> */}
                {/* <Box sx={{ height: "32px" }}>
                  {exam.allSkill && exam.allSkill.length > 0 && (
                    <Box
                      sx={{
                        marginTop: "0.5rem",
                        fontSize: "12px",
                        color: "#35509a",
                        backgroundColor: "#f0f8ff",
                        textAlign: "left",
                        borderRadius: "15px",
                        padding: "3px 10px",
                        width: "fit-content",
                      }}
                    >
                      {`#${exam.allSkill[0]}`}
                    </Box>
                  )}
                </Box> */}
                <Button sx={{ marginTop: 2 }} variant="contained" disabled>
                  Làm full
                </Button>
              </Box>
            </Grid>
          ))}
      </Grid>
    </>
  );
}
