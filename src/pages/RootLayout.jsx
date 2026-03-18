import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../hooks/useAuth";

const RootLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const publicRoutes = ["/login", "/register"];
    const protectedRoutes = ["/products", "/product"];
    const currentPath = location.pathname;

    if (isAuthenticated && publicRoutes.some(route => currentPath.includes(route))) {
      navigate({ to: "/products", replace: true });
    }

    if (!isAuthenticated && protectedRoutes.some(route => currentPath.includes(route))) {
      navigate({ to: "/login", replace: true });
    }
  }, [location.pathname, isAuthenticated, navigate]);

  return <Outlet />;
};

export default RootLayout;