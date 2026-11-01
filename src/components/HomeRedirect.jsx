
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import LandingPage from "../pages/LandingPage";

export default function HomeRedirect() {
  const { user } = useAuthStore();

  if (!user) {
    return <LandingPage />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}
