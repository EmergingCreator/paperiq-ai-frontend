
import { create } from "zustand";
import api from "../api/client";

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),

  loadUser: async () => {
    try {
      const response = await api.get("/auth/me");

      set({
        user: response.data.user,
        loading: false,
      });
    } catch {
      set({
        user: null,
        loading: false,
      });
    }
  },

  // Login
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);

    if (response.data.user) {
      set({ user: response.data.user });
    }

    return response.data;
  },

  // Registration
  register: async (details) => {
    const response = await api.post("/auth/register", details);

    if (response.data.user) {
      set({ user: response.data.user });
    }

    return response.data;
  },

  // Forgot password: send OTP
  forgotPassword: async (email) => {
    const response = await api.post("/auth/forgot-password", {
      email,
    });

    return response.data;
  },

  // Verify password reset OTP
  verifyResetOtp: async (details) => {
    const response = await api.post(
      "/auth/verify-reset-otp",
      details
    );

    return response.data;
  },

  // Resend OTP
  resendOtp: async (email) => {
    const response = await api.post("/auth/resend-otp", {
      email,
    });

    return response.data;
  },

  // Reset password
  resetPassword: async (details) => {
    const response = await api.post(
      "/auth/reset-password",
      details
    );

    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      set({ user: null });
    }
  },
}));
