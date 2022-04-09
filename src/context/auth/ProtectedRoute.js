import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "./AuthState";

function ProtectedRoute({ children }) {
  let auth = useAuth();
  let location = useLocation();

  if (!auth.state.token) {
    return <Navigate to="/login" state={{ from: location }} />;
  }
  return children;
}

export default ProtectedRoute;
