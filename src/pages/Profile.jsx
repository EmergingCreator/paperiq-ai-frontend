import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserRound, Save } from "lucide-react";
import SiteLayout from "../components/SiteLayout";
import api from "../api/client";
import { useAuthStore } from "../stores/authStore";

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    bio: "",
    countryCode: "IN",
    countryName: "India",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/profile")
      .then(({ data }) => {
        const u = data.user;
        setForm({
          name: u.name || "",
          phone: u.profile?.phone || "",
          bio: u.profile?.bio || "",
          countryCode: u.country?.code || "",
          countryName: u.country?.name || "",
        });
        setUser(u);
      })
      .catch((e) =>
        setError(e.response?.data?.message || "Could not load profile."),
      )
      .finally(() => setLoading(false));
  }, [setUser]);

  function change(key, value) {
    setForm((old) => ({ ...old, [key]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setNotice("");
    setError("");
    setBusy(true);
    try {
      const { data } = await api.patch("/profile", {
        name: form.name,
        phone: form.phone,
        bio: form.bio,
        country: { code: form.countryCode, name: form.countryName },
      });
      setUser(data.user);
      if (avatarFile) {
        const body = new FormData();
        body.append("avatar", avatarFile);
        const uploaded = await api.post("/profile/avatar", body, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setUser(uploaded.data.user);
        setAvatarFile(null);
        setAvatarPreview("");
      }
      setNotice("Your profile was updated.");
    } catch (e) {
      setError(e.response?.data?.message || "Could not update profile.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <SiteLayout>
      <main className="mx-auto max-w-3xl px-5 py-10 lg:px-8">
        <Link
          to="/dashboard"
          className="text-sm text-violet-300 hover:text-violet-200"
        >
          ← Back to dashboard
        </Link>
        <div className="mt-5 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-violet-500/15 text-violet-300">
            <UserRound size={24} />
          </span>
          <div>
            <h1 className="text-3xl font-semibold">Your profile</h1>
            <p className="mt-1 text-sm text-slate-400">
              Update the information shown on your account.
            </p>
          </div>
        </div>
        <form
          onSubmit={submit}
          className="mt-8 space-y-5 rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-8"
        >
          {loading ? (
            <p className="text-slate-400">Loading profile…</p>
          ) : (
            <>
              <Field
                label="Full name"
                value={form.name}
                onChange={(v) => change("name", v)}
                maxLength={80}
                required
              />
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Email address
                </label>
                <input
                  value={user?.email || ""}
                  disabled
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-slate-500"
                />
                {/* <p className="mt-2 text-xs text-slate-500">
                  Email changes are disabled in this starter.
                </p> */}
              </div>
              <Field
                label="Phone (optional)"
                value={form.phone}
                onChange={(v) => change("phone", v)}
                maxLength={30}
              />
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-300">
                  Country
                </span>
                <select
                  value={form.countryCode}
                  onChange={(e) => {
                    const o = e.target.selectedOptions[0];
                    change("countryCode", e.target.value);
                    change("countryName", o.text);
                  }}
                  className="w-full rounded-xl border border-white/10 bg-[#080d18] px-4 py-3"
                >
                  <option value="">Select country</option>
                  <option value="IN">India</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="SG">Singapore</option>
                  <option value="AE">United Arab Emirates</option>
                  <option value="ZZ">Other / not listed</option>
                </select>
              </label>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  About you
                </label>
                <textarea
                  value={form.bio}
                  onChange={(e) => change("bio", e.target.value)}
                  maxLength={300}
                  rows={4}
                  placeholder="A short introduction…"
                  className="w-full resize-y rounded-xl border border-white/10 bg-[#080d18] px-4 py-3 outline-none placeholder:text-slate-600 focus:border-violet-400/70"
                />
                <p className="mt-1 text-right text-xs text-slate-600">
                  {form.bio.length}/300
                </p>
              </div>
            </>
          )}
          {notice && (
            <p
              role="status"
              className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-200"
            >
              {notice}
            </p>
          )}
          {error && (
            <p
              role="alert"
              className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200"
            >
              {error}
            </p>
          )}
          <button
            disabled={busy || loading}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-500 px-5 py-3 font-semibold hover:bg-violet-400 disabled:opacity-60"
          >
            <Save size={17} />
            {busy ? "Saving…" : "Save changes"}
          </button>
        </form>
      </main>
    </SiteLayout>
  );
}
function Field({
  label,
  value,
  onChange,
  maxLength,
  required = false,
  type = "text",
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-[#080d18] px-4 py-3 outline-none focus:border-violet-400/70"
      />
    </label>
  );
}
