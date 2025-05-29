import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute = ({
  children,
  requireAuth = false,
}: ProtectedRouteProps) => {
  const { isAuthenticated, redirectToHome } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      navigate("/auth");
    } else if (!requireAuth && isAuthenticated) {
      redirectToHome();
    }
  }, [isAuthenticated, requireAuth, navigate, redirectToHome]);

  return <>{children}</>;
};

export default ProtectedRoute;
