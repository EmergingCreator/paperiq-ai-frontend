
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShieldCheck,
  RefreshCw,
  Mail,
} from "lucide-react";

import { useAuthStore } from "../stores/authStore";

export default function VerifyResetOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const verifyResetOtp = useAuthStore(
    (state) => state.verifyResetOtp
  );

  const resendOtp = useAuthStore(
    (state) => state.resendOtp
  );

  const email =
    location.state?.email ||
    sessionStorage.getItem("passwordResetEmail") ||
    "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(30);

  // Countdown timer
  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setTimeout(() => {
      setSeconds((value) => value - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds]);

  // Verify OTP
  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    try {
      setLoading(true);

      const data = await verifyResetOtp({
        email,
        otp,
      });

      if (!data.resetToken) {
        throw new Error("Reset token was not received.");
      }

      sessionStorage.setItem(
        "passwordResetToken",
        data.resetToken
      );

      navigate("/reset-password", {
        replace: true,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to verify the code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    setError("");

    try {
      setResending(true);

      await resendOtp(email);

      setOtp("");
      setSeconds(30);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to resend verification code."
      );

      const availableAt =
        err.response?.data?.resendAvailableAt;

      if (availableAt) {
        const remaining = Math.ceil(
          (new Date(availableAt).getTime() - Date.now()) /
            1000
        );

        setSeconds(Math.max(1, remaining));
      }
    } finally {
      setResending(false);
    }
  };

  // Missing email
  if (!email) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080b18] px-4 text-white">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#101528] p-8 text-center">
          <Mail
            size={32}
            className="mx-auto mb-5 text-violet-400"
          />

          <h2 className="text-xl font-bold">
            Verification session not found
          </h2>

          <p className="mt-3 text-sm text-slate-400">
            Please start the password reset process again.
          </p>

          <Link
            to="/forgot-password"
            className="mt-6 inline-flex rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold hover:bg-violet-500"
          >
            Try again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080b18] px-4 py-12 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/[0.08] bg-[#101528] p-7 shadow-2xl shadow-black/30 sm:p-9">

        {/* Back */}
        <Link
          to="/forgot-password"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-violet-400"
        >
          <ArrowLeft size={16} />
          Back
        </Link>

        {/* Icon */}
        <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10">
          <ShieldCheck
            size={27}
            className="text-violet-400"
          />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold tracking-tight">
          Verify your email
        </h1>

        <p className="mt-3 text-sm leading-7 text-slate-400">
          We've sent a six-digit verification code to{" "}
          <span className="font-semibold text-slate-200">
            {email}
          </span>
          . Enter the code below to continue.
        </p>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* OTP form */}
        <form onSubmit={handleVerify} className="mt-8 space-y-6">

          <div>
            <label
              htmlFor="otp"
              className="mb-3 block text-sm font-medium text-slate-300"
            >
              Verification code
            </label>

            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(e) =>
                setOtp(
                  e.target.value.replace(/\D/g, "").slice(0, 6)
                )
              }
              placeholder="000000"
              required
              className="w-full rounded-xl border border-white/10 bg-[#080d1d] px-4 py-5 text-center text-3xl font-bold tracking-[0.6em] text-white outline-none transition placeholder:text-slate-700 focus:border-violet-500"
            />

            <p className="mt-2 text-xs text-slate-500">
              The code expires after 10 minutes.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 font-semibold text-white transition hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Verifying...
              </>
            ) : (
              <>
                Verify code
                <ShieldCheck size={18} />
              </>
            )}
          </button>
        </form>

        {/* Resend */}
        <div className="mt-7 text-center text-sm text-slate-400">
          Didn't receive the code?{" "}

          {seconds > 0 ? (
            <span className="font-medium text-slate-500">
              Resend in {seconds}s
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="inline-flex items-center gap-2 font-semibold text-violet-400 transition hover:text-violet-300 disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={resending ? "animate-spin" : ""}
              />

              {resending ? "Sending..." : "Resend code"}
            </button>
          )}
        </div>

        {/* Change email */}
        <div className="mt-7 border-t border-white/[0.06] pt-6 text-center">
          <Link
            to="/forgot-password"
            className="text-sm text-slate-500 transition hover:text-violet-400"
          >
            Use a different email address
          </Link>
        </div>
      </div>
    </div>
  );
}
