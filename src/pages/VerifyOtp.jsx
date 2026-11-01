import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuthStore } from "../stores/authStore";
export default function VerifyOtp() {
  const location = useLocation(),
    navigate = useNavigate(),
    email = location.state?.email || sessionStorage.getItem("otpEmail") || "";
  const [otp, setOtp] = useState("");
  const [wait, setWait] = useState(30);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);
  useEffect(() => {
    const id = setInterval(() => setWait((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  async function verify(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post("/auth/verify-otp", { email, otp });
      setUser?.(data.user);
      sessionStorage.removeItem("otpEmail");
      navigate(data.user?.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Could not verify code.");
    } finally {
      setBusy(false);
    }
  }
  async function resend() {
    try {
      await api.post("/auth/resend-otp", { email });
      setWait(30);
      setError("A new code was sent if the account is eligible.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not resend code.");
    }
  }
  return (
    <main className="mx-auto max-w-md px-6 py-20">
      <h1 className="text-3xl font-semibold">Verify your email</h1>
      <p className="mt-3 text-slate-600">
        Enter the 6-digit code sent to <strong>{email || "your email"}</strong>.
      </p>
      <form onSubmit={verify} className="mt-8 space-y-4">
        <input
          className="w-full rounded-xl border p-3 text-center text-xl tracking-[.4em]"
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="000000"
          required
        />
        <button
          disabled={busy || otp.length !== 6}
          className="w-full rounded-xl bg-indigo-600 p-3 font-medium text-white disabled:opacity-50"
        >
          {busy ? "Verifying…" : "Verify and continue"}
        </button>
      </form>
      {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}
      <button
        disabled={wait > 0}
        onClick={resend}
        className="mt-5 text-sm text-indigo-700 disabled:text-slate-400"
      >
        {wait > 0 ? `Resend code in ${wait}s` : "Resend code"}
      </button>
    </main>
  );
}
