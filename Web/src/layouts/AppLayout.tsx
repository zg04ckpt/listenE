import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import ResponsiveAppBar from "../components/AppBar";

const AppLayout: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        backgroundColor: "#f1f1f3",
      }}
    >
      <ResponsiveAppBar />
      <Box sx={{ flexGrow: 1, paddingTop: "20px" }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;
