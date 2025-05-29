import { Box, Typography, Breadcrumbs, Link } from "@mui/material";
import { Home, Dashboard, LibraryMusic, Edit } from "@mui/icons-material";

interface TrackHeaderProps {
  navigate: (path: string) => void;
}

export default function TrackHeader({ navigate }: TrackHeaderProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Breadcrumbs sx={{ mb: 1 }}>
        <Link
          underline="hover"
          color="inherit"
          sx={{ display: "flex", alignItems: "center" }}
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <Home sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </Link>
        <Link
          underline="hover"
          color="inherit"
          sx={{ display: "flex", alignItems: "center" }}
          onClick={() => navigate("/dashboard")}
          style={{ cursor: "pointer" }}
        >
          <Dashboard sx={{ mr: 0.5 }} fontSize="inherit" />
          Dashboard
        </Link>
        <Link
          underline="hover"
          color="inherit"
          sx={{ display: "flex", alignItems: "center" }}
          onClick={() => navigate(`/dashboard/manage-tracks`)}
          style={{ cursor: "pointer" }}
        >
          <LibraryMusic sx={{ mr: 0.5 }} fontSize="inherit" />
          Tracks
        </Link>
        <Typography
          color="text.primary"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Edit sx={{ mr: 0.5 }} fontSize="inherit" />
          Edit Track
        </Typography>
      </Breadcrumbs>
      <Typography
        variant="h4"
        component="h1"
        fontWeight="bold"
        gutterBottom
        sx={{ textAlign: "left" }}
      >
        Chỉnh sửa Track
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Cập nhật thông tin và nội dung của track
      </Typography>
    </Box>
  );
}
