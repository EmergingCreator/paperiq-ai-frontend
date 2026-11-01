import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LifeBuoy,
  Send,
  MessageCircle,
  Plus,
  ArrowLeft,
  X,
  Clock3,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  FileText,
  Bot,
  Bug,
  Lightbulb,
  UserRound,
  ChevronRight,
  RefreshCw,
  Inbox,
  Headphones,
} from "lucide-react";

import SiteLayout from "../components/SiteLayout";
import api from "../api/client";

const categories = [
  { value: "account", label: "Account", icon: UserRound },
  { value: "billing", label: "Billing or subscription", icon: CreditCard },
  { value: "pdf-upload", label: "PDF upload", icon: FileText },
  { value: "ai-answer", label: "AI answer", icon: Bot },
  { value: "bug-report", label: "Report a bug", icon: Bug },
  { value: "feature-request", label: "Feature request", icon: Lightbulb },
  { value: "other", label: "Other", icon: MessageCircle },
];

const statusStyles = {
  open: "border-sky-400/20 bg-sky-400/10 text-sky-300",
  pending: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  "in-progress": "border-violet-400/20 bg-violet-400/10 text-violet-300",
  resolved: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  closed: "border-slate-400/20 bg-slate-400/10 text-slate-400",
};

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  const parsed = new Date(date);

  return Number.isNaN(parsed.getTime())
    ? "Date unavailable"
    : parsed.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
};

const formatDateTime = (date) => {
  if (!date) return "";

  const parsed = new Date(date);

  return Number.isNaN(parsed.getTime())
    ? ""
    : parsed.toLocaleString(undefined, {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
      });
};

function StatusBadge({ status = "open" }) {
  const normalized = String(status).toLowerCase();
  const style =
    statusStyles[normalized] ||
    "border-white/10 bg-white/5 text-slate-300";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${style}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {normalized.replaceAll("-", " ")}
    </span>
  );
}

function Notice({ type = "success", children, onClose }) {
  const isError = type === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-xl border p-4 ${
        isError
          ? "border-rose-400/20 bg-rose-400/[0.07] text-rose-200"
          : "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-200"
      }`}
    >
      {isError ? (
        <AlertCircle size={18} className="mt-0.5 shrink-0" />
      ) : (
        <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
      )}

      <div className="min-w-0 flex-1 text-sm">{children}</div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss notification"
          className="shrink-0 rounded-lg p-1 opacity-70 transition hover:bg-white/10 hover:opacity-100"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}

function SectionHeading({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-violet-400/15 bg-violet-400/10 text-violet-300">
          <Icon size={19} />
        </span>

        <div>
          <h2 className="font-semibold text-white">{title}</h2>
          {description && (
            <p className="mt-1 text-sm leading-5 text-slate-400">
              {description}
            </p>
          )}
        </div>
      </div>

      {action}
    </div>
  );
}

function TicketCard({ ticket, onOpen }) {
  const category =
    categories.find((item) => item.value === ticket.category)?.label ||
    ticket.category ||
    "Other";

  const replyCount = ticket.replies?.length || 0;

  return (
    <article className="group rounded-xl border border-white/[0.08] bg-[#0b1220] p-4 transition duration-200 hover:border-violet-400/25 hover:bg-white/[0.035]">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-slate-300">
          <MessageCircle size={18} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="break-words font-medium text-slate-100">
              {ticket.subject}
            </h3>
            <StatusBadge status={ticket.status} />
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
            <span>{category}</span>
            <span aria-hidden="true">·</span>
            <span>{formatDate(ticket.createdAt)}</span>
          </div>

          {ticket.adminReply && (
            <div className="mt-3 rounded-lg border border-emerald-400/10 bg-emerald-400/[0.04] p-3">
              <p className="mb-1 text-xs font-medium text-emerald-300">
                Latest support reply
              </p>
              <p className="line-clamp-2 whitespace-pre-wrap break-words text-sm leading-5 text-slate-400">
                {ticket.adminReply}
              </p>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <MessageCircle size={13} />
              {replyCount} {replyCount === 1 ? "reply" : "replies"}
            </span>

            <button
              type="button"
              onClick={onOpen}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-violet-300 transition hover:bg-violet-400/10 hover:text-violet-200"
            >
              View conversation
              <ChevronRight
                size={15}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function ConversationModal({
  ticket,
  reply,
  setReply,
  onClose,
  onSend,
  sending,
  error,
}) {
  const isClosed = ["resolved", "closed"].includes(
    String(ticket.status).toLowerCase()
  );

  const replies = ticket.replies || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="conversation-title"
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#101727] shadow-2xl shadow-black/40"
      >
        <header className="flex items-start justify-between gap-4 border-b border-white/[0.08] p-5 sm:p-6">
          <div className="flex min-w-0 items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-violet-400/10 text-violet-300">
              <MessageCircle size={21} />
            </span>

            <div className="min-w-0">
              <h2
                id="conversation-title"
                className="break-words text-lg font-semibold text-white"
              >
                {ticket.subject}
              </h2>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <StatusBadge status={ticket.status} />
                <span className="text-xs text-slate-500">
                  Created {formatDate(ticket.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close conversation"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <X size={18} />
          </button>
        </header>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Original request
            </p>
            <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-300">
              {ticket.message}
            </p>
          </div>

          {replies.length > 0 ? (
            replies.map((item) => {
              const isAdmin = item.authorRole === "admin";

              return (
                <div
                  key={item._id}
                  className={`flex ${isAdmin ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[92%] rounded-2xl border p-4 sm:max-w-[85%] ${
                      isAdmin
                        ? "rounded-tl-md border-violet-400/15 bg-violet-400/[0.07]"
                        : "rounded-tr-md border-white/[0.08] bg-white/[0.04]"
                    }`}
                  >
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`text-xs font-semibold ${
                          isAdmin ? "text-violet-300" : "text-slate-300"
                        }`}
                      >
                        {isAdmin ? "Support team" : "You"}
                      </span>

                      <span className="text-xs text-slate-500">
                        {formatDateTime(item.createdAt)}
                      </span>
                    </div>

                    <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-300">
                      {item.message}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-center">
              <MessageCircle
                size={22}
                className="mx-auto text-slate-600"
              />
              <p className="mt-2 text-sm text-slate-400">
                No replies yet. Your conversation will appear here.
              </p>
            </div>
          )}

          {isClosed && (
            <div className="flex items-start gap-2 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.05] p-3 text-sm text-emerald-200">
              <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
              <p>
                This request is {ticket.status}. Replies are currently
                disabled.
              </p>
            </div>
          )}

          {error && <Notice type="error">{error}</Notice>}
        </div>

        {!isClosed && (
          <form
            onSubmit={onSend}
            className="space-y-3 border-t border-white/[0.08] bg-[#0c1321] p-5 sm:p-6"
          >
            <label
              htmlFor="ticket-reply"
              className="block text-sm font-medium text-slate-300"
            >
              Reply to this conversation
            </label>

            <textarea
              id="ticket-reply"
              value={reply}
              onChange={(event) => setReply(event.target.value)}
              rows={3}
              minLength={1}
              maxLength={5000}
              required
              placeholder="Write your message here..."
              className="w-full resize-y rounded-xl border border-white/10 bg-[#080d18] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-400/10"
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                {reply.length}/5000 characters
              </span>

              <button
                type="submit"
                disabled={sending || !reply.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={15} />
                {sending ? "Sending..." : "Send reply"}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}

export default function Helpbox() {
  const [form, setForm] = useState({
    subject: "",
    category: "other",
    message: "",
  });

  const [tickets, setTickets] = useState([]);
  const [busy, setBusy] = useState(false);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [reply, setReply] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [conversationError, setConversationError] = useState("");

  async function loadTickets({ quiet = false } = {}) {
    if (quiet) {
      setRefreshing(true);
    } else {
      setLoadingTickets(true);
    }

    try {
      const { data } = await api.get("/helpbox");
      setTickets(data.tickets || []);
      setError("");
    } catch (e) {
      setError(
        e.response?.data?.message || "Could not load your support requests."
      );
    } finally {
      setLoadingTickets(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  async function openTicket(id) {
    setConversationError("");
    setReply("");

    try {
      const { data } = await api.get(`/helpbox/${id}`);
      setSelectedTicket(data.ticket);
    } catch (e) {
      setError(
        e.response?.data?.message || "Could not open this conversation."
      );
    }
  }

  async function sendReply(event) {
    event.preventDefault();

    if (!selectedTicket || !reply.trim() || sendingReply) return;

    setSendingReply(true);
    setConversationError("");

    try {
      const { data } = await api.post(
        `/helpbox/${selectedTicket._id}/replies`,
        { message: reply.trim() }
      );

      setSelectedTicket(data.ticket);
      setReply("");
      await loadTickets({ quiet: true });
    } catch (e) {
      setConversationError(
        e.response?.data?.message || "Could not send your reply."
      );
    } finally {
      setSendingReply(false);
    }
  }

  async function submit(event) {
    event.preventDefault();

    if (busy) return;

    setBusy(true);
    setNotice("");
    setError("");

    try {
      const { data } = await api.post("/helpbox", {
        ...form,
        subject: form.subject.trim(),
        message: form.message.trim(),
      });

      setNotice(
        `Your request was submitted successfully. Reference: ${
          data.ticket?.id || data.ticket?._id || "submitted"
        }`
      );

      setForm({
        subject: "",
        category: "other",
        message: "",
      });

      await loadTickets({ quiet: true });
    } catch (e) {
      setError(
        e.response?.data?.message || "Could not submit your support request."
      );
    } finally {
      setBusy(false);
    }
  }

  const openCount = tickets.filter((ticket) =>
    ["open", "pending", "in-progress"].includes(
      String(ticket.status).toLowerCase()
    )
  ).length;

  return (
    <SiteLayout>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-violet-300"
        >
          <ArrowLeft size={15} />
          Back to dashboard
        </Link>

        <section className="relative mt-6 overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-violet-500/[0.12] via-[#111a2c] to-[#0b1220] p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full bg-violet-500/[0.09] blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.08] px-3 py-1.5 text-xs font-medium text-violet-200">
                <LifeBuoy size={14} />
                PaprIQ AI Support
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                How can we help you?
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                Have a question or found a problem? Send us a request and keep
                the entire conversation in one place.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-xl border border-white/[0.08] bg-black/15 p-4">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-400/10 text-violet-300">
                <Inbox size={22} />
              </span>
              <div>
                <p className="text-2xl font-semibold tabular-nums text-white">
                  {tickets.length}
                </p>
                <p className="text-xs text-slate-400">Total requests</p>
              </div>
              <div className="mx-1 h-9 w-px bg-white/10" />
              <div>
                <p className="text-2xl font-semibold tabular-nums text-white">
                  {openCount}
                </p>
                <p className="text-xs text-slate-400">Still open</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-7 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
            <SectionHeading
              icon={Plus}
              title="Submit a support request"
              description="Tell us what you need help with."
            />

            <form onSubmit={submit} className="mt-6 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-300">
                  What do you need help with?
                </span>

                <div className="relative">
                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm({ ...form, category: event.target.value })
                    }
                    className="w-full appearance-none rounded-xl border border-white/10 bg-[#080d18] px-4 py-3.5 pr-10 text-sm text-slate-200 outline-none transition focus:border-violet-400/60 focus:ring-2 focus:ring-violet-400/10"
                  >
                    {categories.map((category) => (
                      <option
                        key={category.value}
                        value={category.value}
                        className="bg-[#080d18]"
                      >
                        {category.label}
                      </option>
                    ))}
                  </select>

                  <ChevronRight
                    size={17}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-500"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-300">
                  Subject
                </span>

                <input
                  required
                  minLength={3}
                  maxLength={120}
                  value={form.subject}
                  onChange={(event) =>
                    setForm({ ...form, subject: event.target.value })
                  }
                  placeholder="e.g. I can't upload my PDF"
                  className="w-full rounded-xl border border-white/10 bg-[#080d18] px-4 py-3.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-400/10"
                />

                <span className="mt-1.5 block text-right text-xs text-slate-600">
                  {form.subject.length}/120
                </span>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-300">
                  Describe the issue
                </span>

                <textarea
                  required
                  minLength={10}
                  maxLength={5000}
                  rows={6}
                  value={form.message}
                  onChange={(event) =>
                    setForm({ ...form, message: event.target.value })
                  }
                  placeholder="Include what you were trying to do, what happened, and any error message you saw..."
                  className="w-full resize-y rounded-xl border border-white/10 bg-[#080d18] px-4 py-3.5 text-sm leading-6 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-400/10"
                />

                <div className="mt-1.5 flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-500">
                    Minimum 10 characters
                  </span>
                  <span className="text-xs text-slate-600">
                    {form.message.length}/5000
                  </span>
                </div>
              </label>

              {notice && (
                <Notice type="success" onClose={() => setNotice("")}>
                  {notice}
                </Notice>
              )}

              {error && (
                <Notice type="error" onClose={() => setError("")}>
                  {error}
                </Notice>
              )}

              <button
                type="submit"
                disabled={busy}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/20 transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {busy ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
                {busy ? "Submitting request..." : "Submit request"}
              </button>

              <p className="text-xs leading-5 text-slate-500">
                Please don't include passwords, payment card details, or other
                sensitive information in your request.
              </p>
            </form>
          </section>

          <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
            <SectionHeading
              icon={MessageCircle}
              title="Your support requests"
              description="View updates and reply to the support team."
              action={
                <button
                  type="button"
                  onClick={() => loadTickets({ quiet: true })}
                  disabled={refreshing}
                  aria-label="Refresh support requests"
                  title="Refresh requests"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-slate-400 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
                >
                  <RefreshCw
                    size={15}
                    className={refreshing ? "animate-spin" : ""}
                  />
                </button>
              }
            />

            <div className="mt-6">
              {loadingTickets ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="animate-pulse rounded-xl border border-white/[0.06] p-4"
                    >
                      <div className="h-4 w-2/3 rounded bg-white/[0.07]" />
                      <div className="mt-3 h-3 w-1/3 rounded bg-white/[0.05]" />
                      <div className="mt-5 h-3 w-1/2 rounded bg-white/[0.05]" />
                    </div>
                  ))}
                </div>
              ) : tickets.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 px-5 py-10 text-center">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white/[0.04] text-slate-400">
                    <Inbox size={23} />
                  </span>

                  <h3 className="mt-4 font-medium text-slate-200">
                    No requests yet
                  </h3>

                  <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">
                    When you contact support, your requests and replies will
                    appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tickets.map((ticket) => (
                    <TicketCard
                      key={ticket._id}
                      ticket={ticket}
                      onOpen={() => openTicket(ticket._id)}
                    />
                  ))}
                </div>
              )}

              {!loadingTickets && (
                <p className="mt-4 flex items-center gap-2 text-xs leading-5 text-slate-500">
                  <CheckCircle2 size={14} className="shrink-0 text-emerald-400" />
                  Your requests are private to your account.
                </p>
              )}
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-400/10 text-slate-300">
                <Headphones size={19} />
              </span>
              <div>
                <h2 className="font-medium text-slate-200">
                  Need help with a PaprIQ AI feature?
                </h2>
                <p className="mt-1 text-sm leading-5 text-slate-500">
                  Choose the category that best matches your issue so your
                  request is easier to review.
                </p>
              </div>
            </div>

            <Link
              to="/dashboard"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              <ArrowLeft size={15} />
              Return to dashboard
            </Link>
          </div>
        </section>
      </main>

      {selectedTicket && (
        <ConversationModal
          ticket={selectedTicket}
          reply={reply}
          setReply={setReply}
          onClose={() => {
            setSelectedTicket(null);
            setConversationError("");
            setReply("");
          }}
          onSend={sendReply}
          sending={sendingReply}
          error={conversationError}
        />
      )}
    </SiteLayout>
  );
}