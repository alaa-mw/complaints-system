import { Navigate, Outlet, useLocation } from "react-router-dom";
import TokenService from "../services/tokenService";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const userToken = TokenService.getAccessToken();
  const userRole = TokenService.getUserRole() || "";
  const location = useLocation();

  console.log("userToken",userToken);
  
  console.log("userRole",userRole);
  // تحقق من وجود توكن
  if (!userToken) {
    console.log("no token");
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // تحقق من الصلاحيات إذا كانت محددة
  if (allowedRoles && !allowedRoles.includes(userRole || "")) {
    return <Navigate to="/not-authorized" replace />;
  }

  // token exist & role allowed
  console.log("token exist & role allowed");
  return <Outlet />;
};

export default ProtectedRoute;
