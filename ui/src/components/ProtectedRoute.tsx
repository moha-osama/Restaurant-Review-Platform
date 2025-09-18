import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FaSpinner } from "react-icons/fa";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    // Checking user authentication status while loading
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-yellow-400 mb-4" />
        <span className="text-lg text-gray-700">Checking if you are authenticated...</span>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
