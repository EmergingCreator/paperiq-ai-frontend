import { Link } from "react-router-dom";
import {
  ArrowRight,
  FileSearch,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  Zap,
} from "lucide-react";
import SiteLayout from "../components/SiteLayout";

const features = [
  {
    icon: UploadCloud,
    title: "Upload your PDFs",
    text: "Keep your study notes, reports, and documents organized in one workspace.",
  },
  {
    icon: MessageSquareText,
    title: "Ask in plain English",
    text: "Ask questions about your document and get answers grounded in its content.",
  },
  {
    icon: FileSearch,
    title: "Find the source",
    text: "See supporting page references so you can check answers against the document.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    text: "Your account and documents are protected by server-side access checks.",
  },
];

export default function Home() {
  return (
    <SiteLayout>
      <main>
        <section className="relative isolate overflow-hidden">
          <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[520px] w-[800px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[130px]" />
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 md:grid-cols-[1.05fr_.95fr] md:py-28 lg:px-8">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-400/10 px-3 py-1.5 text-xs font-medium text-violet-200">
                <Sparkles size={14} /> Your documents, powered by AI
              </div>
              <h1 className="max-w-3xl text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
                Your PDFs have{" "}
                <span className="bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent">
                  answers.
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
                Upload a document, ask a question, and get a clear answer with
                page references. Spend less time searching and more time
                understanding.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-500 px-5 py-3.5 font-semibold text-white shadow-lg shadow-violet-950/40 hover:bg-violet-400"
                >
                  Try it free <ArrowRight size={17} />
                </Link>
                <a
                  href="#features"
                  className="rounded-xl border border-white/15 px-5 py-3.5 font-semibold text-slate-200 hover:bg-white/5"
                >
                  Explore features
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <ShieldCheck size={15} /> Private workspace
                </span>
                <span className="flex items-center gap-2">
                  <Zap size={15} /> Fast answers
                </span>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-4 shadow-2xl shadow-violet-950/30 sm:p-6">
              <div className="rounded-2xl border border-white/10 bg-[#0c1322] p-5">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500/15 text-violet-300">
                    <FileSearch size={20} />
                  </span>
                  <div>
                    <p className="font-medium">Quarterly_Report.pdf</p>
                    <p className="mt-1 text-xs text-slate-500">
                      12 pages · Ready to chat
                    </p>
                  </div>
                  <span className="ml-auto rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-300">
                    Indexed
                  </span>
                </div>
                <div className="mt-5 max-w-[85%] rounded-2xl rounded-tl-sm bg-white/[0.06] p-4 text-sm leading-6 text-slate-300">
                  What were the main drivers of revenue growth?
                </div>
                <div className="ml-auto mt-4 max-w-[95%] rounded-2xl rounded-tr-sm border border-violet-400/20 bg-violet-500/10 p-4 text-sm leading-6 text-slate-200">
                  <span className="mb-2 flex items-center gap-2 font-medium text-violet-200">
                    <Sparkles size={15} /> AI answer
                  </span>
                  Revenue growth was mainly driven by increased customer
                  retention and higher average order value.{" "}
                  <span className="mt-3 inline-flex rounded-lg border border-violet-300/20 bg-violet-300/10 px-2.5 py-1 text-xs text-violet-200">
                    Source · Page 4
                  </span>
                </div>
                <div className="mt-5 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-sm text-slate-500">
                  Ask anything about this PDF…{" "}
                  <span className="ml-auto grid h-8 w-8 place-items-center rounded-lg bg-violet-500 text-white">
                    <ArrowRight size={16} />
                  </span>
                </div>
                <p className="mt-3 text-center text-[11px] text-slate-600">
                  Illustrative preview · sample answer
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20"
        >
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[.2em] text-violet-300">
              Built for focus
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              From long documents to clear answers.
            </h2>
            <p className="mt-4 leading-7 text-slate-400">
              A focused document workspace with useful answers, clear sources,
              and account-level controls.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:-translate-y-1 hover:border-violet-400/30"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-500/15 text-violet-300">
                  <Icon size={21} />
                </span>
                <h3 className="mt-5 font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
              </article>
            ))}
          </div>
        </section>
        <section
          id="pricing"
          className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20"
        >
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[.2em] text-violet-300">
              Simple plans
            </p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Start free. Upgrade when you need more.
            </h2>
            <p className="mt-4 text-slate-400">
              Plan prices and limits can be configured when Stripe billing is
              connected.
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-3xl gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-white/[0.025] p-7">
              <p className="font-semibold">Free</p>
              <p className="mt-3 text-4xl font-semibold">
                $0{" "}
                <span className="text-sm font-normal text-slate-500">
                  / forever
                </span>
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                <li>5 AI questions per calendar month</li>
                <li>PDF upload within configured limits</li>
                <li>Personal document workspace</li>
              </ul>
              <Link
                to="/register"
                className="mt-8 block rounded-xl border border-white/15 px-4 py-3 text-center font-semibold hover:bg-white/5"
              >
                Start for free
              </Link>
            </article>
            <article className="relative rounded-2xl border border-violet-400/40 bg-gradient-to-b from-violet-500/10 to-white/[0.025] p-7">
              <span className="absolute right-5 top-5 rounded-full bg-violet-400/15 px-2.5 py-1 text-xs font-medium text-violet-200">
                For power users
              </span>
              <p className="font-semibold">Pro</p>
              <p className="mt-3 text-4xl font-semibold">
                $4.99{" "}
                <span className="text-sm font-normal text-slate-500">
                  pricing
                </span>
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                <li>Higher AI question allowance</li>
                <li>Expanded document limits</li>
                <li>Subscription management</li>
              </ul>
              <Link
                to="/register"
                className="mt-8 block rounded-xl bg-violet-500 px-4 py-3 text-center font-semibold hover:bg-violet-400"
              >
                Create an account{" "}
                <ArrowRight className="ml-1 inline" size={16} />
              </Link>
            </article>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-white/10 bg-gradient-to-r from-violet-500/15 to-cyan-500/5 p-8 sm:flex-row sm:items-center sm:p-10">
            <div>
              <h2 className="text-2xl font-semibold">
                Ready to make PDFs easier?
              </h2>
              <p className="mt-2 text-slate-400">
                Create your workspace and start with the free plan.
              </p>
            </div>
            <Link
              to="/register"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-200"
            >
              Get started <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
