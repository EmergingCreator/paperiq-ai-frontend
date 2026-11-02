import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  FileText,
} from "lucide-react";

import { useAuthStore } from "../stores/authStore";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      const result = await login(form);

      navigate(result.user?.role === "admin" ? "/admin" : "/dashboard", {
        replace: true,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not log in. Check your credentials and try again."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
      
    <div className="relative min-h-screen overflow-hidden bg-[#080d18] text-slate-100">

      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-violet-600/15 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-600/15 blur-[140px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/[0.05] blur-[120px]" />

      <div className="relative mx-auto grid min-h-screen max-w-[1440px] lg:grid-cols-2">

        {/* LEFT PANEL */}
        <section className="relative hidden flex-col justify-between px-10 py-10 lg:flex xl:px-20 xl:py-12">

          {/* Logo */}
          <Link to="/" className="inline-flex w-fit items-center">
            <img
              src="./logo.png"
              alt="PaprIQ"
              className="h-14 w-auto max-w-[210px] object-contain"
            />
          </Link>

          {/* Hero content */}
          <div className="relative z-10 mt-10">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/[0.08] px-4 py-2 text-xs font-medium text-violet-300">
              <Sparkles size={14} />
              Your intelligent PDF workspace
            </div>

            <h1 className="max-w-xl text-5xl font-bold leading-[1.15] tracking-tight text-white xl:text-6xl">
              Your documents,
              <br />
              your knowledge,
              <span className="mt-2 block bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                powered by AI.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-slate-400">
              Stop searching through endless pages. Upload your PDFs, ask
              questions, and discover the information you need in seconds.
            </p>

            {/* Benefits */}
            <div className="mt-9 space-y-5">
              {[
                "Chat with your PDF documents",
                "Get instant AI-powered answers",
                "Find important information faster",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-violet-500/15 text-violet-300 ring-1 ring-violet-400/20">
                    <CheckCircle2 size={16} />
                  </span>
                  <span className="text-sm font-medium text-slate-300">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Illustration */}
          <div className="relative mt-8 flex min-h-[280px] items-center justify-center">
            <div className="absolute h-64 w-64 rounded-full bg-violet-600/20 blur-[80px]" />

            <img
              src="./login-illustration.png"
              alt="PaprIQ AI PDF assistant illustration"
              className="relative z-10 mx-auto max-h-[340px] w-full max-w-lg object-contain drop-shadow-[0_20px_50px_rgba(124,58,237,0.2)]"
            />
          </div>

          <p className="mt-6 text-xs text-slate-600">
            © {new Date().getFullYear()} PaprIQ · A product by AppKaun
          </p>
        </section>

        {/* RIGHT PANEL */}
        <section className="relative flex min-h-screen items-center justify-center px-5 py-12 sm:px-8 lg:px-12">

          <div className="w-full max-w-[440px]">

            {/* Mobile logo */}
            <Link
              to="/"
              className="mb-10 flex justify-center lg:hidden"
            >
              <img
                src="./logo.png"
                alt="PaprIQ"
                className="h-14 w-auto max-w-[190px] object-contain"
              />
            </Link>

            {/* Login card */}
            <div className="relative overflow-hidden rounded-[28px] border border-white/[0.10] bg-white/[0.035] p-7 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-10">

              {/* Card glow */}
              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-500/10 blur-[80px]" />
              <div className="pointer-events-none absolute -bottom-24 -left-24 h-52 w-52 rounded-full bg-indigo-500/[0.08] blur-[80px]" />

              <div className="relative">

                {/* Card icon */}
                <div className="mb-7 grid h-14 w-14 place-items-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300 shadow-lg shadow-violet-950/20">
                  <LockKeyhole size={24} />
                </div>

                {/* Heading */}
                <div className="mb-8">
                  <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
                    <Sparkles size={14} />
                    Welcome back
                  </div>

                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Sign in to PaprIQ
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    Continue to your intelligent document workspace.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      Email address
                    </label>

                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                      />

                      <input
                        id="email"
                        type="email"
                        required
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-white/10 bg-[#080d18]/80 py-3.5 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-violet-400/60 focus:ring-4 focus:ring-violet-400/10"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <label
                        htmlFor="password"
                        className="text-sm font-medium text-slate-300"
                      >
                        Password
                      </label>

                      <Link
                        to="/forgot-password"
                        className="text-xs font-medium text-violet-300 transition hover:text-violet-200"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <div className="relative">
                      <LockKeyhole
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                      />

                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="current-password"
                        value={form.password}
                        onChange={(e) =>
                          setForm({ ...form, password: e.target.value })
                        }
                        placeholder="Enter your password"
                        className="w-full rounded-xl border border-white/10 bg-[#080d18]/80 py-3.5 pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-violet-400/60 focus:ring-4 focus:ring-violet-400/10"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-violet-300"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <div
                      role="alert"
                      className="rounded-xl border border-rose-400/20 bg-rose-400/[0.08] p-3.5 text-sm text-rose-300"
                    >
                      {error}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={busy}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {busy ? "Signing in..." : "Sign in to your account"}

                    {!busy && (
                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    )}
                  </button>

                  {/* Divider */}
                  <div className="flex items-center gap-3 py-2">
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="text-xs text-slate-500">
                      New to PaprIQ?
                    </span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>

                  {/* Register */}
                  <Link
                    to="/register"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-violet-400/30 hover:bg-violet-500/[0.07] hover:text-white"
                  >
                    Create an account
                  </Link>
                </form>

                {/* Security note */}
                <div className="mt-7 flex items-center justify-center gap-2 border-t border-white/[0.08] pt-6 text-xs text-slate-500">
                  <ShieldCheck size={15} className="text-violet-400" />
                  Secure access to your personal PDF workspace
                </div>
              </div>
            </div>

            {/* Legal links */}
            <div className="mt-6 flex items-center justify-center gap-5 text-xs text-slate-500">
              <Link
                to="/privacy-policy"
                className="transition hover:text-violet-300"
              >
                Privacy Policy
              </Link>

              <span className="h-1 w-1 rounded-full bg-slate-700" />

              <Link
                to="/terms"
                className="transition hover:text-violet-300"
              >
                Terms & Conditions
              </Link>
            </div>

            <p className="mt-5 text-center text-[11px] text-slate-600">
              © {new Date().getFullYear()} PaprIQ · Powered by AppKaun
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}