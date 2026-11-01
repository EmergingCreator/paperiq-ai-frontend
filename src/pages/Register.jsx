
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Globe,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import AuthLayout from "../components/AuthLayout";
import { useAuthStore } from "../stores/authStore";

const countries = [
  { code: "IN", name: "India" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "SG", name: "Singapore" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "ZZ", name: "Other / not listed" },
];

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    country: { code: "IN", name: "India" },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setBusy(true);

    try {
      const result = await register(form);

      if (result.requiresOtp) {
        sessionStorage.setItem("otpEmail", form.email);
        navigate("/verify-otp", {
          state: { email: form.email },
        });
        return;
      }

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not create account. Check your connection and try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start asking smarter questions about your PDFs"
    >
      <form onSubmit={handleSubmit} className="mt-7 space-y-5">
        {/* Full name */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Full name
          </label>

          <div className="relative">
            <User
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              required
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Enter your full name"
              autoComplete="name"
              maxLength={100}
              className="w-full rounded-xl border border-white/10 bg-[#080d18]/80 py-3.5 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/70 focus:ring-2 focus:ring-violet-400/10"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Email address
          </label>

          <div className="relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              maxLength={254}
              className="w-full rounded-xl border border-white/10 bg-[#080d18]/80 py-3.5 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/70 focus:ring-2 focus:ring-violet-400/10"
            />
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Country
          </label>

          <div className="relative">
            <Globe
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <select
              value={form.country.code}
              onChange={(e) => {
                const selected = countries.find(
                  (country) => country.code === e.target.value,
                );

                updateField("country", selected);
              }}
              className="w-full appearance-none rounded-xl border border-white/10 bg-[#080d18] py-3.5 pl-12 pr-4 text-white outline-none transition focus:border-violet-400/70 focus:ring-2 focus:ring-violet-400/10"
            >
              {countries.map((country) => (
                <option
                  key={country.code}
                  value={country.code}
                  className="bg-[#080d18] text-white"
                >
                  {country.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Password
          </label>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              required
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              placeholder="Create a strong password"
              autoComplete="new-password"
              minLength={8}
              maxLength={128}
              className="w-full rounded-xl border border-white/10 bg-[#080d18]/80 py-3.5 pl-12 pr-12 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/70 focus:ring-2 focus:ring-violet-400/10"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-violet-300"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Use at least 8 characters.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200"
          >
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={busy}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-violet-900/20 transition hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Creating account..." : "Create account"}

          {!busy && (
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          )}
        </button>

        {/* Login link */}
        <p className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-violet-300 transition hover:text-violet-200"
          >
            Sign in
          </Link>
        </p>

        {/* Security note */}
        <div className="flex items-center justify-center gap-2 border-t border-white/5 pt-4 text-xs text-slate-500">
          <ShieldCheck size={15} className="text-emerald-400" />
          Your account and documents are protected.
        </div>
      </form>
    </AuthLayout>
  );
}
