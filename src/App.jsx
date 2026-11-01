import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Documents from "./pages/Documents";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import Conversation from "./pages/Conversation";
import Helpbox from "./pages/Helpbox";
import VerifyOtp from "./pages/VerifyOtp";
import Pricing from "./pages/Pricing";
import Subscription from "./pages/Subscription";
import AdminHelpbox from "./pages/AdminHelpbox";

import ProtectedRoute from "./components/ProtectedRoute";
import { useAuthStore } from "./stores/authStore";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import FAQ from "./pages/FAQ";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyResetOtp from "./pages/VerifyResetOtp";
import ResetPassword from "./pages/ResetPassword";

function HomeRedirect() {
  const user = useAuthStore((state) => state.user);

  // Visitors can access the public landing page.
  if (!user) {
    return <Home />;
  }

  // Admins get their own dashboard.
  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  // Regular users get their own dashboard.
  return <Navigate to="/dashboard" replace />;
}

function AppRoutes() {
  const loadUser = useAuthStore((state) => state.loadUser);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <Routes>
      {/* Home page */}
      <Route path="/" element={<HomeRedirect />} />

      {/* Public pages */}
      <Route
        path="/login"
        element={
          user ? (
            <Navigate
              to={user.role === "admin" ? "/admin" : "/dashboard"}
              replace
            />
          ) : (
            <Login />
          )
        }
      />
      <Route path="/conversations" element={<Conversation />} />
      <Route
        path="/register"
        element={
          user ? (
            <Navigate
              to={user.role === "admin" ? "/admin" : "/dashboard"}
              replace
            />
          ) : (
            <Register />
          )
        }
      />

      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/pricing" element={<Pricing />} />

      {/* Regular user pages */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <Documents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/helpbox"
        element={
          <ProtectedRoute>
            <Helpbox />
          </ProtectedRoute>
        }
      />

      <Route
        path="/subscription"
        element={
          <ProtectedRoute>
            <Subscription />
          </ProtectedRoute>
        }
      />

      {/* Admin pages */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/helpbox"
        element={
          <ProtectedRoute adminOnly>
            <AdminHelpbox />
          </ProtectedRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/faq" element={<FAQ />} />
      {/* Unknown URLs */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
