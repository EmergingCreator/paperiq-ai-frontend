
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  CircleHelp,
  Clock3,
  FileText,
  MessageSquareText,
  RefreshCw,
  Sparkles,
  UploadCloud,
  Zap,
} from "lucide-react";

import { Link } from "react-router-dom";
import SiteLayout from "../components/SiteLayout";
import api from "../api/client";
import { useAuthStore } from "../stores/authStore";
import Footer from "../components/Footer";

function StatCard({ icon: Icon, label, value, description, iconClass }) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition duration-200 hover:-translate-y-1 hover:border-violet-400/30 hover:bg-white/[0.055]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-white">
            {value}
          </p>
        </div>

        <span
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={21} />
        </span>
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function QuickAction({ icon: Icon, title, description, to, accent }) {
  return (
    <Link
      to={to}
      className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4 transition hover:border-violet-400/30 hover:bg-white/[0.055] sm:p-5"
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accent}`}
      >
        <Icon size={21} />
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-slate-100">{title}</h3>
        <p className="mt-1 text-sm leading-5 text-slate-400">
          {description}
        </p>
      </div>

      <ArrowUpRight
        size={18}
        className="shrink-0 text-slate-500 transition group-hover:text-violet-300"
      />
    </Link>
  );
}

function LoadingCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-white/10 bg-white/[0.025] p-5">
      <div className="h-4 w-32 rounded bg-white/10" />
      <div className="mt-5 h-8 w-20 rounded bg-white/10" />
      <div className="mt-5 h-3 w-40 rounded bg-white/5" />
    </div>
  );
}

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);

  const [serverData, setServerData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/user/dashboard");
      setServerData(data);
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Could not load your account details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  // User and dashboard information
  const current = serverData?.user || user;
  const stats = serverData?.stats || {};

  // Check whether the user has an active Pro subscription
  const isPro =
    String(current?.plan || "free").toLowerCase() === "pro" &&
    ["active", "trialing"].includes(
      String(current?.subscriptionStatus || "").toLowerCase()
    );

  // Monthly question allowance
  const questionsLimit = isPro
    ? Math.max(0, Number(stats.questionsLimit ?? 1000))
    : 5;

  const used = Math.max(
    0,
    Number(current?.questionsUsed) || 0
  );

  const remaining = Math.max(0, questionsLimit - used);

  const usagePercent =
    questionsLimit > 0
      ? Math.min(100, (used / questionsLimit) * 100)
      : 0;

  const limitReached = !isPro && used >= 5;

  const firstName =
    current?.name?.trim()?.split(/\s+/)[0] || "there";

  // Next calendar-month reset date
  const now = new Date();

  const resetDate = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1
  );

  const formattedResetDate = resetDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <SiteLayout>
      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">

        {/* Page header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-violet-300">
              <Sparkles size={16} />
              Your workspace
            </div>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Welcome back, {firstName}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Your documents, questions, and conversations—all in one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium ${
                isPro
                  ? "border-violet-400/25 bg-violet-500/10 text-violet-200"
                  : "border-white/10 bg-white/[0.04] text-slate-300"
              }`}
            >
              {isPro ? <BadgeCheck size={16} /> : <Zap size={16} />}
              {isPro ? "Pro plan" : "Free plan"}
            </span>

            <button
              type="button"
              onClick={loadDashboard}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div
            role="alert"
            className="mt-6 flex flex-col gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/[0.07] p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="text-sm leading-6 text-amber-200">
              {error}
            </p>

            <button
              type="button"
              onClick={loadDashboard}
              className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg border border-amber-200/20 px-3 py-2 text-sm font-medium text-amber-100 hover:bg-amber-200/10"
            >
              <RefreshCw size={15} />
              Try again
            </button>
          </div>
        )}

        {/* Welcome banner */}
        <section className="relative mt-8 overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-600/20 via-slate-900 to-indigo-600/10 p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1.5 text-xs font-semibold text-violet-200">
                <Sparkles size={14} />
                YOUR AI WORKSPACE
              </span>

              <h2 className="mt-5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Make more of your documents.
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
                Get ready to explore your PDFs, ask questions, and find
                information without manually searching every page.
              </p>

              <Link
                to="/documents"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-400"
              >
                Explore documents
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="hidden h-36 w-36 shrink-0 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04] shadow-inner lg:flex">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/25 to-indigo-500/20 text-violet-200 ring-1 ring-white/10">
                <FileText size={48} strokeWidth={1.3} />
              </div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">
              Workspace overview
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              A snapshot of your account activity.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {loading && !serverData ? (
              <>
                <LoadingCard />
                <LoadingCard />
                <LoadingCard />
              </>
            ) : (
              <>
                <StatCard
                  icon={MessageSquareText}
                  label="Questions used"
                  value={`${used} / ${questionsLimit}`}
                  description={
                    limitReached
                      ? "Your free question limit has been reached."
                      : `${remaining} questions remaining this month.`
                  }
                  iconClass="bg-violet-500/10 text-violet-300"
                />

                <StatCard
                  icon={FileText}
                  label="PDF documents"
                  value={stats.pdfCount ?? "—"}
                  description="Documents recorded in your account."
                  iconClass="bg-sky-500/10 text-sky-300"
                />

                <StatCard
                  icon={BookOpen}
                  label="Conversations"
                  value={stats.conversationCount ?? "—"}
                  description="Conversations recorded in your workspace."
                  iconClass="bg-emerald-500/10 text-emerald-300"
                />
              </>
            )}
          </div>
        </section>

        {/* Monthly question usage */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-violet-300" />

                <h2 className="font-semibold text-white">
                  Monthly question usage
                </h2>
              </div>

              <p className="mt-2 text-sm text-slate-400">
                {limitReached
                  ? "You have used all 5 free questions this month."
                  : `${remaining} questions remaining in your current allowance.`}
              </p>
            </div>

            <span className="text-sm font-semibold text-slate-300">
              {Math.round(usagePercent)}% used
            </span>
          </div>

          <div
            className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/10"
            role="progressbar"
            aria-label="Monthly question usage"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(usagePercent)}
          >
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                limitReached || usagePercent >= 90
                  ? "bg-amber-400"
                  : "bg-violet-400"
              }`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>

          <div className="mt-3 flex justify-between text-xs text-slate-500">
            <span>{used} used</span>
            <span>{questionsLimit} total</span>
          </div>

          {!isPro && (
            <div className="mt-5 border-t border-white/10 pt-5">
              {limitReached ? (
                <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-4">
                  <p className="font-semibold text-amber-200">
                    Free question limit reached
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    You have used all 5 free questions. Upgrade to Pro
                    to continue asking questions without this free-plan
                    limit.
                  </p>

                  <Link
                    to="/subscription"
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-400"
                  >
                    Upgrade to Pro
                    <ArrowRight size={15} />
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-200">
                      Need more questions?
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Upgrade to Pro for a higher question allowance.
                    </p>
                  </div>

                  <Link
                    to="/subscription"
                    className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-violet-400/20 bg-violet-500/10 px-4 py-2.5 text-sm font-semibold text-violet-200 transition hover:bg-violet-500/20"
                  >
                    View plans
                    <ArrowRight size={15} />
                  </Link>
                </div>
              )}

              <p className="mt-4 text-xs text-slate-500">
                Your free question allowance resets on{" "}
                {formattedResetDate}.
              </p>
            </div>
          )}
        </section>

        {/* Quick actions */}
        <section className="mt-9">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">
              Quick actions
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Jump straight to the area you need.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <QuickAction
              icon={UploadCloud}
              title="Your PDF library"
              description="Open your document workspace and manage your files."
              to="/documents"
              accent="bg-violet-500/10 text-violet-300"
            />

            <QuickAction
              icon={MessageSquareText}
              title="Conversations"
              description="Return to your saved document discussions."
              to="/conversations"
              accent="bg-sky-500/10 text-sky-300"
            />

            <QuickAction
              icon={BadgeCheck}
              title="Subscription"
              description="Review your plan and manage billing options."
              to="/subscription"
              accent="bg-emerald-500/10 text-emerald-300"
            />

            <QuickAction
              icon={CircleHelp}
              title="Help & support"
              description="View your support requests or contact the team."
              to="/helpbox"
              accent="bg-amber-500/10 text-amber-300"
            />
          </div>
        </section>

        {/* Integration note */}
        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-start gap-3">
            <Clock3 size={19} className="mt-0.5 shrink-0 text-slate-400" />

            <div>
              <h3 className="text-sm font-semibold text-slate-200">
                Workspace status
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-400">
                Dashboard statistics are loaded from your backend.
                Your PDF library, conversations, and AI question
                answering are managed by your connected services.
              </p>

              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <CheckCircle2 size={14} />
                Account dashboard connected
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
      </main>
    </SiteLayout>
  );
}
