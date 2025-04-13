import * as React from "react";
import { useEffect } from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PlayLessonIcon from "@mui/icons-material/PlayLesson";
import TopicIcon from "@mui/icons-material/Topic";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import { useNavigate } from "react-router-dom";
import { useNavBar } from "../provider/NavBarProvider";

export default function NavBar() {
  const { value, setValue } = useNavBar();

  useEffect(() => {
    const navItem = localStorage.getItem("navItem");
    if (navItem) setValue(navItem);
  }, []);

  const navigate = useNavigate();

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <BottomNavigation
      showLabels
      sx={{
        width: "200px",
        boxShadow: "0 2px 4px 0 rgba(0,0,0,.2)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        minHeight: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        alignItems: "center",
        justifyContent: "center",
        padding: "20px 20px 0 0",
        backgroundColor: "#fff",
        overflow: "hidden",
      }}
      value={value}
      onChange={handleChange}
    >
      <BottomNavigationAction
        sx={{
          outline: "none !important",
          border: "none",
          width: "calc(100% + 40px)",
        }}
        label="Dashboard"
        value="dashboard"
        icon={<DashboardIcon />}
        onClick={() => {
          navigate("/dashboard");
          setValue("dashboard");
          localStorage.setItem("navItem", "dashboard");
        }}
      />
      <BottomNavigationAction
        sx={{
          outline: "none !important",
          border: "none",
          width: "calc(100% + 40px)",
        }}
        label="Quản lý các topic"
        value="topics"
        icon={<TopicIcon />}
        onClick={() => {
          navigate("/dashboard/manage-topic");
          setValue("topics");
          localStorage.setItem("navItem", "topics");
        }}
      />
      <BottomNavigationAction
        sx={{
          outline: "none !important",
          border: "none",
          width: "calc(100% + 40px)",
        }}
        label="Quản lý các session"
        value="sessions"
        icon={<PlayLessonIcon />}
        onClick={() => {
          navigate("/dashboard/manage-session");
          setValue("sessions");
          localStorage.setItem("navItem", "sessions");
        }}
      />
      <BottomNavigationAction
        sx={{
          outline: "none !important",
          border: "none",
          width: "calc(100% + 40px)",
        }}
        label="Quản lý các track"
        value="tracks"
        icon={<GraphicEqIcon />}
        onClick={() => {
          navigate("/dashboard/manage-track");
          setValue("tracks");
          localStorage.setItem("navItem", "tracks");
        }}
      />
    </BottomNavigation>
  );
}
