import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Authentication from "./pages/Auththentication";
import GoogleCallback from "./components/GooleAuthCallBack";
import ForgotPassword from "./pages/ForgotPassword";
import HomePage from "./pages/HomePage";
import { NavBarProvider } from "./provider/NavBarProvider";
import DashboardLayout from "./layouts/DashBoardLayout";
import AppLayout from "./layouts/AppLayout";
import { NotificationProvider } from "./provider/NotificationProvider";

import { UserListView } from "./sections/dashboard-view/user/view";

import { TrackListView } from "./sections/dashboard-view/track/view";
import TrackManager from "./sections/dashboard-view/track/track-manager";
import { TrackEditView } from "./sections/dashboard-view/track/view";

import { TopicListView } from "./sections/dashboard-view/topic/view";
import TopicCreateEditForm from "./sections/dashboard-view/topic/topic-create-edit-form";

import { QuestionListView } from "./sections/dashboard-view/question/view";
import QuestionCreateEditForm from "./sections/dashboard-view/question/question-create-edit-form";

import { TagListView } from "./sections/dashboard-view/tag/view";
import TagCreateEditForm from "./sections/dashboard-view/tag/tag-create-edit-form";

import RoleManagementPage from "./sections/dashboard-view/role/role-management-page";
import UserRoleAssignment from "./sections/dashboard-view/role/user-role-assignment";

import TopicDetailsPage from "./pages/TopicDetailsPage";
import TrackPracticePage from "./pages/TrackPracticePage";
import TrackSegmentsPage from "./pages/TrackSegmentsPage";
import SegmentPracticePage from "./pages/SegmentPracticePage";
import TopicsPage from "./pages/TopicsPage";
import TagQuestionsPage from "./pages/TagQuestionsPage";
import QuestionPracticePage from "./pages/QuestionPracticePage";
import ResultsPage from "./pages/ResultsPage";
import GroupQuestionPracticePage from "./pages/GroupQuestionPracticePage";
import ForbiddenPage from "./pages/ForbiddenPage";

import { AnimatePresence } from "framer-motion";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import "./App.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
      light: "#757de8",
      dark: "#002984",
      contrastText: "#fff",
    } as any,
    secondary: {
      main: "#f50057",
      light: "#ff4081",
      dark: "#c51162",
      contrastText: "#fff",
    } as any,
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          "&:focus": {
            outline: "none",
          },
          "&:focus-visible": {
            outline: "none",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:focus": {
            outline: "none",
          },
          "&:focus-visible": {
            outline: "none",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 12px 28px rgba(0, 0, 0, 0.1)",
          },
        },
      },
    },
  },
});
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <NavBarProvider>
          <Router>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route element={<AppLayout />}>
                  <Route path="/topics" element={<TopicsPage />} />
                  <Route
                    path="/topic/:topicId"
                    element={<TopicDetailsPage />}
                  />
                  <Route
                    path="/topic/:topicId/track/:trackId"
                    element={<TrackPracticePage />}
                  />
                  <Route
                    path="/topic/:topicId/track/:trackId/segments"
                    element={<TrackSegmentsPage />}
                  />
                  <Route
                    path="/topic/:topicId/track/:trackId/segment/:segmentId"
                    element={<SegmentPracticePage />}
                  />
                  <Route
                    path="/topic/:topicId/tag/:tagId/questions"
                    element={<TagQuestionsPage />}
                  />

                  <Route
                    path="/topic/:topicId/tag/:tagId/question/:questionId/practice"
                    element={<QuestionPracticePage />}
                  />

                  <Route
                    path="/topic/:topicId/tag/:tagId/group/:groupId/practice"
                    element={<GroupQuestionPracticePage />}
                  />

                  <Route
                    path="/topic/:topicId/tag/:tagId/results"
                    element={<ResultsPage />}
                  />

                  <Route path="/403" element={<ForbiddenPage />} />

                  <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route
                      index
                      element={<Navigate to="manage-topics" replace />}
                    />
                    <Route path="manage-users" element={<UserListView />} />

                    <Route path="create-track" element={<TrackManager />} />
                    <Route path="manage-tracks" element={<TrackListView />} />
                    <Route
                      path="tracks/:trackId/edit-track"
                      element={<TrackEditView />}
                    />

                    <Route path="manage-topics" element={<TopicListView />} />
                    <Route
                      path="topics/create"
                      element={<TopicCreateEditForm />}
                    />
                    <Route
                      path="topics/:topicId/edit"
                      element={<TopicCreateEditForm />}
                    />

                    <Route
                      path="manage-questions"
                      element={<QuestionListView />}
                    />
                    <Route
                      path="questions/create"
                      element={<QuestionCreateEditForm />}
                    />

                    <Route
                      path="questions/:questionId/edit"
                      element={<QuestionCreateEditForm />}
                    />

                    <Route
                      path="groups/:groupId/edit"
                      element={<QuestionCreateEditForm />}
                    />

                    <Route path="manage-tags" element={<TagListView />} />
                    <Route path="tags/create" element={<TagCreateEditForm />} />
                    <Route
                      path="tags/:tagId/edit"
                      element={<TagCreateEditForm />}
                    />

                    <Route
                      path="manage-roles"
                      element={<RoleManagementPage />}
                    />
                    <Route
                      path="asign-roles"
                      element={<UserRoleAssignment />}
                    />
                    <Route
                      path="asign-roles/:userId"
                      element={<UserRoleAssignment />}
                    />
                  </Route>
                </Route>
                <Route path="/auth" element={<Authentication />} />
                <Route
                  path="/auth/forgot-password"
                  element={<ForgotPassword />}
                />
                <Route
                  path="/auth/google-login-callback"
                  element={<GoogleCallback />}
                />
              </Routes>
            </AnimatePresence>
          </Router>
        </NavBarProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
