import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  FileText,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Zap,
  Crown,
  Clock3,
} from "lucide-react";

import { useAuthStore } from "../stores/authStore";
import { usePaymentStore } from "../stores/paymentStore";
import SiteLayout from "../components/SiteLayout";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Explore AI-powered document conversations.",
    icon: Zap,
    features: [
      "5 questions per month",
      "PDF upload and document history",
      "Source references in answers",
      "Essential document Q&A tools",
      "Community support",
    ],
    action: "Get started for free",
    featured: false,
  },
  {
    name: "Pro",
    price: "$4.99",
    period: "per month",
    description: "For regular study, research, and productivity.",
    icon: Crown,
    features: [
      "Higher question allowance",
      "PDF assistant workflow",
      "Conversation history",
      "Source references in answers",
      "Priority support",
    ],
    action: "Upgrade to Pro",
    featured: true,
  },
];

const highlights = [
  {
    icon: FileText,
    title: "Work with your PDFs",
    description:
      "Ask questions about your documents instead of searching manually.",
  },
  {
    icon: MessageSquareText,
    title: "Keep your context",
    description: "Return to previous conversations and continue your work.",
  },
  {
    icon: ShieldCheck,
    title: "A straightforward experience",
    description:
      "Choose a plan that fits your needs without confusing pricing.",
  },
];

export default function Pricing() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const startCheckout = usePaymentStore((s) => s.startCheckout);
  const checkoutLoading = usePaymentStore((s) => s.checkoutLoading);
  const paymentError = usePaymentStore((s) => s.error);
  const clearError = usePaymentStore((s) => s.clearError);

  const [checkoutMessage, setCheckoutMessage] = useState("");

  async function choose(plan) {
    if (plan === "Pro") {
      if (!user) {
        navigate("/login", {
          state: {
            from: "/subscription",
            plan: "Pro",
            returnTo: "/subscription",
          },
        });

        return;
      }

      try {
        setCheckoutMessage("");
        clearError();

        const result = await startCheckout(user);

        if (result?.verified) {
          setCheckoutMessage(
            "Payment details verified. Your subscription status will update after Razorpay confirms activation.",
          );

          navigate("/subscription?checkout=processing");
        }
      } catch (error) {
        console.error("Razorpay checkout error:", error);
      }

      return;
    }

    navigate(user ? "/dashboard" : "/register");
  }

  return (
    <SiteLayout>
      <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
        {/* Hero */}
        <section className="relative border-b border-white/10 bg-slate-950">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.18),_transparent_60%)]" />

          <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-8 sm:pb-20">
            <div className="mx-auto mt-16 max-w-3xl text-center sm:mt-20">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3.5 py-2 text-sm font-medium text-violet-300">
                <Sparkles size={15} />
                Straightforward, flexible plans
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Your documents.
                <span className="block bg-gradient-to-r from-violet-300 to-indigo-400 bg-clip-text text-transparent">
                  More useful than ever.
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
                Turn your PDFs into a space for questions, insights, and focused
                work. Start free and explore an upgraded workflow when you need
                it.
              </p>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-slate-400">
                {[
                  "Free plan available",
                  "Source references",
                  "Upgrade when ready",
                ].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <Check size={16} className="text-violet-300" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing cards */}
        <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Choose your plan
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
              Start with the essentials or explore the Pro experience.
            </p>
          </div>

          {paymentError && (
            <div className="mx-auto mb-6 max-w-2xl rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              {paymentError}
            </div>
          )}

          {checkoutMessage && (
            <div className="mx-auto mb-6 max-w-2xl rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300">
              {checkoutMessage}
            </div>
          )}

          <div className="mx-auto grid max-w-4xl items-stretch gap-6 md:grid-cols-2">
            {plans.map((plan) => {
              const Icon = plan.icon;

              return (
                <section
                  key={plan.name}
                  className={`relative flex flex-col rounded-3xl border p-6 transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-8 ${
                    plan.featured
                      ? "border-violet-400/50 bg-violet-500/[0.07] shadow-xl shadow-violet-950/20 ring-1 ring-violet-400/20"
                      : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  {plan.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-violet-400/20 bg-violet-500 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-violet-950/30">
                      PRO EXPERIENCE
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                          plan.featured
                            ? "bg-violet-500/15 text-violet-300"
                            : "bg-white/5 text-slate-300"
                        }`}
                      >
                        <Icon size={23} />
                      </div>

                      <h3 className="mt-5 text-2xl font-bold text-white">
                        {plan.name}
                      </h3>

                      <p className="mt-2 max-w-xs text-sm leading-6 text-slate-400">
                        {plan.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-7 border-b border-white/10 pb-6">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <span className="text-4xl font-bold tracking-tight text-white">
                        {plan.price}
                      </span>

                      <span className="text-sm text-slate-400">
                        {plan.period}
                      </span>
                    </div>

                    {plan.featured && (
                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        Secure recurring payments powered by Razorpay.
                      </p>
                    )}
                  </div>

                  <div className="mt-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      What's included
                    </p>

                    <ul className="mt-5 space-y-4">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 text-sm leading-5 text-slate-300"
                        >
                          <span
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                              plan.featured
                                ? "bg-violet-500/15 text-violet-300"
                                : "bg-white/5 text-emerald-400"
                            }`}
                          >
                            <Check size={13} strokeWidth={3} />
                          </span>

                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => choose(plan.name)}
                    disabled={plan.name === "Pro" && checkoutLoading}
                    className={`mt-8 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${
                      plan.featured
                        ? "bg-violet-500 text-white shadow-lg shadow-violet-950/30 hover:bg-violet-400 focus:ring-violet-500/20"
                        : "border border-white/10 bg-white/5 text-white hover:border-white/20 hover:bg-white/10 focus:ring-white/10"
                    }`}
                  >
                    {plan.name === "Pro" && checkoutLoading
                      ? "Opening Checkout..."
                      : plan.action}

                    {!checkoutLoading && <ArrowRight size={17} />}
                  </button>

                  <p className="mt-3 text-center text-xs leading-5 text-slate-500">
                    {plan.name === "Free"
                      ? "A simple way to get started."
                      : "Review your plan before payment."}
                  </p>
                </section>
              );
            })}
          </div>

          {/* Trust note */}
          <div className="mx-auto mt-8 flex max-w-4xl items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:items-center sm:p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
              <ShieldCheck size={21} />
            </span>

            <div>
              <p className="text-sm font-semibold text-white">
                Clear and secure checkout
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-400">
                Paid checkout uses Razorpay. No payment is taken just by viewing
                this page.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="border-y border-white/10 bg-white/[0.015]">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold text-violet-300">
                BUILT FOR YOUR WORKFLOW
              </p>

              <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Less searching. More understanding.
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
                Keep your document work organized and make your information
                easier to explore.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {highlights.map(({ icon: Icon, title, description }) => (
                <article
                  key={title}
                  className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition hover:border-violet-400/30 hover:bg-violet-500/[0.04]"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300 ring-1 ring-violet-400/10">
                    <Icon size={21} />
                  </span>

                  <h3 className="mt-5 font-semibold text-white">{title}</h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="relative overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-500/15 via-slate-900 to-slate-950 px-6 py-10 text-center sm:px-12 sm:py-14">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.15),_transparent_65%)]" />

            <div className="relative">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-violet-300">
                <Clock3 size={23} />
              </div>

              <h2 className="mt-5 text-2xl font-bold text-white sm:text-3xl">
                Ready to explore your PDFs?
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                Get started with the Free plan and discover a more focused way
                to work with your documents.
              </p>

              <button
                type="button"
                onClick={() => choose("Free")}
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-400"
              >
                Start for free
                <ArrowRight size={17} />
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-400">
            <Link to="/" className="transition hover:text-violet-300">
              Home
            </Link>

            <Link to="/login" className="transition hover:text-violet-300">
              Log in
            </Link>

            <Link to="/register" className="transition hover:text-violet-300">
              Create account
            </Link>
          </div>

          <p className="mt-5 text-center text-xs text-slate-600">
            AI PDF Assistant · Pricing and features are subject to your
            application's actual configuration.
          </p>
        </section>
      </main>
    </SiteLayout>
  );
}
