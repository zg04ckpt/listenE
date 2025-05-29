import type React from "react";
import { Box, Fade } from "@mui/material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`track-tabpanel-${index}`}
      aria-labelledby={`track-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Fade in={value === index} timeout={500}>
          <Box sx={{ pt: 3 }}>{children}</Box>
        </Fade>
      )}
    </div>
  );
}
