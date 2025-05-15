
import { Navigate } from "react-router-dom";
import { useAuthState } from "@/hooks/useAuthState";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const AuthGuard = ({ children, requiredRole }: AuthGuardProps) => {
  const { isAuthenticated, isLoading, user } = useAuthState();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check role if required
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export default AuthGuard;
