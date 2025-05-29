import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const authCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("ListeneAuthCookie="));
      console.log(authCookie);
      setIsAuthenticated(!!authCookie);
    };

    checkAuth();
  }, [location]);

  const redirectToHome = () => {
    navigate("/");
  };

  return {
    isAuthenticated,
    redirectToHome,
  };
};
