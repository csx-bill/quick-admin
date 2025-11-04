import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import UserService from "@/store/userService";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();

  // 检查登录状态
  if (!UserService.isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
