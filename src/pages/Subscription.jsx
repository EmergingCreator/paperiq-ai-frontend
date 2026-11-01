
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  Check,
  CreditCard,
  Crown,
  FileText,
  HelpCircle,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import api from "../api/client";
import SiteLayout from "../components/SiteLayout";

function formatDate(value) {
  if (!value) return "Not available";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Not available"
    : date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-violet-300 ring-1 ring-white/10">
        <Icon size={19} />
      </div>

      <div className="min-w-0">
        <p className="text-sm text-slate-400">{label}</p>
        <p className="mt-0.5 truncate font-medium text-slate-100">
          {value}
        </p>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center gap-3">
      <LoaderCircle
        className="animate-spin text-violet-300"
        size={30}
      />
      <p className="text-sm text-slate-400">
        Loading your subscription details...
      </p>
    </div>
  );
}

export default function Subscription() {
  const [state, setState] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadSubscription() {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/subscription");
      setState(data.subscription);
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "We couldn't load your subscription. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSubscription();
  }, []);

  const isPro =
    String(state?.plan || "").toLowerCase() === "pro";

  const status = String(state?.status || "inactive").replaceAll(
    "_",
    " "
  );

  const statusLabel =
    status.charAt(0).toUpperCase() + status.slice(1);

  async function checkout() {
    setBusy(true);
    setError("");
    setNotice("");

    try {
      const { data } = await api.post("/subscription/checkout");

      if (data.url) {
        window.location.assign(data.url);
      } else {
        setError(
          "Checkout URL was not returned. Please try again."
        );
      }
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Checkout is unavailable. Please try again later."
      );
    } finally {
      setBusy(false);
    }
  }

  async function cancel() {
    const confirmed = window.confirm(
      "Are you sure you want to schedule cancellation? Your plan may remain active until the current billing period ends."
    );

    if (!confirmed) return;

    setBusy(true);
    setError("");
    setNotice("");

    try {
      await api.post("/subscription/cancel");

      setNotice(
        "Your cancellation request was submitted. Refresh your subscription details to confirm the updated status."
      );

      await loadSubscription();
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Unable to schedule cancellation. Please try again."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <SiteLayout>
      <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-violet-300"
            >
              <ArrowLeft size={16} />
              Back to pricing
            </Link>

            <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-300">
                  <CreditCard size={14} />
                  BILLING & SUBSCRIPTION
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Your subscription
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                  Manage your plan, review your billing status,
                  and choose the features that fit your workflow.
                </p>
              </div>

              <button
                type="button"
                onClick={loadSubscription}
                disabled={loading || busy}
                className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
              >
                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200"
            >
              <HelpCircle
                size={19}
                className="mt-0.5 shrink-0"
              />

              <div className="flex-1">{error}</div>

              <button
                type="button"
                onClick={() => setError("")}
                className="font-semibold text-red-200 hover:text-white"
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          )}

          {/* Success message */}
          {notice && (
            <div
              role="status"
              className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-200"
            >
              <BadgeCheck
                size={19}
                className="mt-0.5 shrink-0"
              />
              <p>{notice}</p>
            </div>
          )}

          {/* Loading state */}
          {loading && !state ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.025]">
              <LoadingState />
            </div>
          ) : state ? (
            <>
              {/* Current plan */}
              <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-6 shadow-xl shadow-black/10 sm:p-9">
                <div className="pointer-events-none absolute -right-16 -top-28 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl" />

                <div className="pointer-events-none absolute -bottom-32 right-1/3 h-64 w-64 rounded-full bg-indigo-600/15 blur-3xl" />

                <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/10 ring-1 ring-violet-400/20">
                        {isPro ? (
                          <Crown
                            size={23}
                            className="text-violet-300"
                          />
                        ) : (
                          <Zap
                            size={23}
                            className="text-violet-300"
                          />
                        )}
                      </span>

                      <span className="text-sm font-medium text-slate-400">
                        CURRENT PLAN
                      </span>

                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
                        {statusLabel}
                      </span>
                    </div>

                    <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
                      {isPro ? "Pro plan" : "Free plan"}
                    </h2>

                    <p className="mt-3 max-w-lg text-sm leading-6 text-slate-400 sm:text-base">
                      {isPro
                        ? "Enjoy your current Pro benefits and keep your document workflow running smoothly."
                        : "You're on the Free plan. Upgrade when you're ready for more AI-powered document work."}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      {!isPro && (
                        <button
                          type="button"
                          onClick={checkout}
                          disabled={busy}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {busy ? (
                            <LoaderCircle
                              className="animate-spin"
                              size={17}
                            />
                          ) : (
                            <Sparkles size={17} />
                          )}

                          Upgrade to Pro

                          {!busy && <ArrowUpRight size={16} />}
                        </button>
                      )}

                      <Link
                        to="/pricing"
                        className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                      >
                        Compare plans
                      </Link>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 lg:w-64 lg:grid-cols-1">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                        Subscription
                      </p>

                      <p className="mt-2 text-lg font-semibold text-white">
                        {isPro ? "Pro" : "Free"}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Current plan
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                        Renewal date
                      </p>

                      <p className="mt-2 text-lg font-semibold text-white">
                        {formatDate(state.currentPeriodEnd)}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Based on available billing data
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Subscription details and benefits */}
              <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 shadow-sm sm:p-7">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        Subscription details
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        An overview of your current billing information.
                      </p>
                    </div>

                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
                      <CreditCard size={21} />
                    </span>
                  </div>

                  <div className="mt-7 grid gap-6 sm:grid-cols-2">
                    <Detail
                      icon={BadgeCheck}
                      label="Current plan"
                      value={isPro ? "Pro" : "Free"}
                    />

                    <Detail
                      icon={ShieldCheck}
                      label="Subscription status"
                      value={statusLabel}
                    />

                    <Detail
                      icon={CalendarDays}
                      label="Next renewal / period end"
                      value={formatDate(state.currentPeriodEnd)}
                    />

                    <Detail
                      icon={FileText}
                      label="Billing information"
                      value={
                        isPro
                          ? "Managed by Stripe"
                          : "No paid subscription"
                      }
                    />
                  </div>

                  {isPro && (
                    <div className="mt-8 border-t border-white/10 pt-6">
                      <button
                        type="button"
                        onClick={cancel}
                        disabled={
                          busy || state.cancelAtPeriodEnd === true
                        }
                        className="rounded-xl border border-red-400/20 bg-red-500/5 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {state.cancelAtPeriodEnd
                          ? "Cancellation already scheduled"
                          : busy
                            ? "Please wait..."
                            : "Cancel subscription"}
                      </button>

                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        Cancellation behavior depends on your Stripe
                        subscription configuration. Confirm the effective
                        date before relying on the displayed status.
                      </p>
                    </div>
                  )}
                </section>

                {/* Plan benefits */}
                <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 shadow-sm sm:p-7">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
                      <Sparkles size={21} />
                    </span>

                    <div>
                      <h3 className="text-lg font-bold text-white">
                        Your plan benefits
                      </h3>

                      <p className="text-sm text-slate-400">
                        {isPro
                          ? "Pro plan overview"
                          : "Free plan overview"}
                      </p>
                    </div>
                  </div>

                  <ul className="mt-6 space-y-4">
                    {(isPro
                      ? [
                          "Access to Pro plan features",
                          "Your current subscription status",
                          "Manage billing through the configured checkout",
                          "Ask questions about your PDFs",
                        ]
                      : [
                          "Get started with PDF question answering",
                          "Upload and explore your documents",
                          "Keep track of your conversations",
                          "Upgrade when you need more capacity",
                        ]
                    ).map((feature) => (
                      <li
                        key={feature}
                        className="flex gap-3 text-sm text-slate-300"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300">
                          <Check size={13} strokeWidth={3} />
                        </span>

                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-7 rounded-2xl border border-white/5 bg-white/[0.025] p-4">
                    <div className="flex items-start gap-3">
                      <ShieldCheck
                        size={19}
                        className="mt-0.5 shrink-0 text-violet-300"
                      />

                      <div>
                        <p className="text-sm font-semibold text-slate-200">
                          Secure billing
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          Payments are handled through Stripe when billing
                          is configured. This page does not store card
                          details.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Page footer */}
              <footer className="mt-8 flex flex-col justify-between gap-3 border-t border-white/10 pt-5 text-xs text-slate-500 sm:flex-row">
                <p>Subscription management · AI PDF Assistant</p>

                <Link
                  to="/pricing"
                  className="font-medium text-violet-300 transition hover:text-violet-200"
                >
                  View available plans
                </Link>
              </footer>
            </>
          ) : (
            /* Subscription loading failed */
            <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-8 text-center">
              <CreditCard
                size={30}
                className="mx-auto text-slate-500"
              />

              <h2 className="mt-4 text-lg font-semibold text-white">
                Subscription details unavailable
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                We couldn't retrieve your billing information. Try
                refreshing the page, or return to pricing to review
                the available plans.
              </p>

              <button
                type="button"
                onClick={loadSubscription}
                disabled={loading || busy}
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />
                Try again
              </button>
            </section>
          )}
        </div>
      </main>
    </SiteLayout>
  );
}
