import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const userRole = user.user_metadata?.role;
    if (!allowedRoles.includes(userRole)) {
      navigate(userRole === "customer" ? "/dashboard/customer" : "/dashboard/business");
    }
  }, [user, navigate, allowedRoles]);

  return <>{children}</>;
};

export default ProtectedRoute;