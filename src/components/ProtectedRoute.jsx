import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <div className="grid min-h-screen place-items-center text-slate-300">Loading your workspace…</div>;
  }
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
}
