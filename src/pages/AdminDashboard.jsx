import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Users, CreditCard, LifeBuoy } from "lucide-react";
import SiteLayout from "../components/SiteLayout";
import api from "../api/client";
import { useAuthStore } from "../stores/authStore";

export default function AdminDashboard() {
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    api
      .get("/admin/dashboard")
      .then((r) => setStats(r.data.stats))
      .catch((e) =>
        setError(
          e.response?.data?.message || "Could not load admin statistics.",
        ),
      );
  }, []);
  return (
    <SiteLayout>
      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-violet-500/15 text-violet-300">
            <ShieldCheck size={24} />
          </span>
          <div>
            <p className="text-sm text-violet-300">Administration</p>
            <h1 className="text-3xl font-semibold">Admin dashboard</h1>
          </div>
        </div>
        <p className="mt-4 text-slate-400">
          Signed in as {user?.email}. This page and its API are protected by the
          admin role.
        </p>
        {error && (
          <p className="mt-6 rounded-xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-200">
            {error} If this account is not an admin, access is correctly denied.
          </p>
        )}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Stat
            icon={Users}
            label="Total registered users"
            value={stats?.totalUsers ?? "—"}
          />
          <Stat
            icon={CreditCard}
            label="Active Pro subscriptions"
            value={stats?.proUsers ?? "—"}
          />
          <Stat
            icon={LifeBuoy}
            label="Open help requests"
            value={stats?.openHelpRequests ?? "—"}
          />
        </div>
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-6">
          <h2 className="font-semibold">Helpbox management</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Review user requests, read the conversation history, update
            priority/status, and send replies.
          </p>
          <Link
            to="/admin/helpbox"
            className="mt-4 inline-flex rounded-xl bg-violet-500 px-4 py-2 font-medium"
          >
            Open support inbox →
          </Link>
        </div>
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-6">
          <h2 className="font-semibold">Admin safety</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Public registration always creates a regular user. Provision an
            admin account only through a trusted, private database operation or
            a one-time secured admin script. Do not add a public “make me admin”
            endpoint.
          </p>
        </div>
      </main>
    </SiteLayout>
  );
}
function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{label}</p>
        <Icon size={18} className="text-violet-300" />
      </div>
      <p className="mt-4 text-3xl font-semibold">{value}</p>
    </div>
  );
}
