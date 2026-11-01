
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

import { useAuthStore } from "../stores/authStore";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const forgotPassword = useAuthStore(
    (state) => state.forgotPassword
  );

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      await forgotPassword(normalizedEmail);

      sessionStorage.setItem(
        "passwordResetEmail",
        normalizedEmail
      );

      navigate("/verify-reset-otp", {
        replace: true,
        state: { email: normalizedEmail },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to send verification code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080b18] px-4 py-12 text-white">
      <div className="w-full max-w-md">

        {/* Login link */}
        <Link
          to="/login"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-violet-400"
        >
          <ArrowLeft size={16} />
          Back to login
        </Link>

        {/* Card */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#101528] p-7 shadow-2xl shadow-black/30 sm:p-9">

          {/* Icon */}
          <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10">
            <Mail size={26} className="text-violet-400" />
          </div>

          {/* Heading */}
          <div className="mb-8">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-violet-400">
              <Sparkles size={15} />
              PaprIQ Account Security
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              Forgot password?
            </h1>

            <p className="mt-3 text-sm leading-7 text-slate-400">
              Don't worry! Enter the email address associated
              with your account. We'll send you a verification
              code to reset your password.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                maxLength={254}
                className="w-full rounded-xl border border-white/10 bg-[#080d1d] px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 font-semibold text-white shadow-lg shadow-violet-900/20 transition hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Sending code...
                </>
              ) : (
                <>
                  Send verification code
                  <Mail size={17} />
                </>
              )}
            </button>
          </form>

          {/* Security note */}
          <div className="mt-7 flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <ShieldCheck
              size={19}
              className="mt-0.5 shrink-0 text-violet-400"
            />

            <p className="text-xs leading-6 text-slate-500">
              Your account security matters to us. Your
              verification code will expire after 10 minutes.
            </p>
          </div>

          {/* Login link */}
          <p className="mt-7 text-center text-sm text-slate-400">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-semibold text-violet-400 transition hover:text-violet-300"
            >
              Log in
            </Link>
          </p>
        </div>

        <p className="mt-7 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} PaprIQ. All rights reserved.
        </p>
      </div>
    </div>
  );
}
