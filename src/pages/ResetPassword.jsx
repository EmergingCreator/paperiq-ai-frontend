
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import { useAuthStore } from "../stores/authStore";

export default function ResetPassword() {
  const navigate = useNavigate();

  const resetPassword = useAuthStore(
    (state) => state.resetPassword
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8 || password.length > 128) {
      setError("Password must be between 8 and 128 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const resetToken = sessionStorage.getItem(
      "passwordResetToken"
    );

    if (!resetToken) {
      setError(
        "Your password reset session has expired. Please start again."
      );
      return;
    }

    try {
      setLoading(true);

      await resetPassword({
        resetToken,
        password,
      });

      // Clear reset session after successful password update.
      sessionStorage.removeItem("passwordResetToken");
      sessionStorage.removeItem("passwordResetEmail");

      navigate("/login", {
        replace: true,
        state: {
          message:
            "Password reset successfully. Please log in with your new password.",
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080b18] px-4 py-12 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/[0.08] bg-[#101528] p-7 shadow-2xl shadow-black/30 sm:p-9">

        {/* Icon */}
        <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10">
          <LockKeyhole
            size={26}
            className="text-violet-400"
          />
        </div>

        {/* Heading */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-violet-400">
            <ShieldCheck size={15} />
            Account Security
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Create new password
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate-400">
            Your email has been verified. Create a new password
            to secure your PaprIQ account.
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

          {/* New password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              New password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                autoComplete="new-password"
                minLength={8}
                maxLength={128}
                required
                className="w-full rounded-xl border border-white/10 bg-[#080d1d] px-4 py-3.5 pr-12 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((value) => !value)
                }
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-violet-400"
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Password must contain 8–128 characters.
            </p>
          </div>

          {/* Confirm password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Confirm new password
            </label>

            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Confirm new password"
                autoComplete="new-password"
                required
                className="w-full rounded-xl border border-white/10 bg-[#080d1d] px-4 py-3.5 pr-12 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirm((value) => !value)
                }
                aria-label={
                  showConfirm
                    ? "Hide password"
                    : "Show password"
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-violet-400"
              >
                {showConfirm ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          {/* Password match indicator */}
          {confirmPassword.length > 0 && (
            <div
              className={`flex items-center gap-2 text-xs ${
                password === confirmPassword
                  ? "text-emerald-400"
                  : "text-slate-500"
              }`}
            >
              <CheckCircle2 size={15} />
              {password === confirmPassword
                ? "Passwords match"
                : "Passwords do not match"}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 font-semibold text-white shadow-lg shadow-violet-900/20 transition hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Updating password...
              </>
            ) : (
              <>
                Reset password
                <LockKeyhole size={17} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
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
    </div>
  );
}
