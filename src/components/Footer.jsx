import { Link } from "react-router-dom";
import {
  FileText,
  ArrowRight,
  Mail,
  Sparkles,
  Globe,
  ShieldCheck,
  Scale,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const linkClass = "text-slate-400 transition hover:text-violet-300";

  return (
    <footer className="mt-16 border-t border-white/[0.08] bg-[#080d18]">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              aria-label="PaprIQ home"
              className="inline-flex items-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              <img
                src="/assets/logo.png"
                alt="PaprIQ"
                className="h-14 w-auto max-w-[220px] object-contain transition duration-300 hover:scale-105"
              />
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
              Your intelligent PDF workspace. Upload documents, ask questions,
              and find the information you need with AI-powered assistance.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-violet-400/15 bg-violet-500/[0.07] px-3 py-1.5 text-xs font-medium text-violet-300">
              <Sparkles size={13} />
              Understand your documents smarter
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-white">Product</h3>

            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link to="/" className={linkClass}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/pricing" className={linkClass}>
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/register" className={linkClass}>
                  Get started
                </Link>
              </li>
              {/* <li>
                <Link to="/login" className={linkClass}>
                  Log in
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Legal and support */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Legal & Support
            </h3>

            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link to="/helpbox" className={linkClass}>
                  Help & Support
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="inline-flex items-center gap-2 text-slate-400 transition hover:text-violet-300"
                >
                  <ShieldCheck size={14} />
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/faq"
                  className="inline-flex items-center gap-2 text-slate-400 transition hover:text-violet-300"
                >
                  <ShieldCheck size={14} />
                    FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="inline-flex items-center gap-2 text-slate-400 transition hover:text-violet-300"
                >
                  <Scale size={14} />
                  Terms & Conditions
                </Link>
              </li>
              {/* <li>
                <a href="mailto:support@appkaun.com" className={linkClass}>
                  Contact us
                </a>
              </li> */}
            </ul>
          </div>
        </div>

        <div className="my-9 border-t border-white/[0.08]" />

        {/* Bottom section */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          {/* Brand */}
    

          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* <a
              href="mailto:support@appkaun.com"
              aria-label="Email support"
              className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-violet-300"
            >
              <Mail size={16} />
            </a> */}
            {/* 
            <a
              href="https://appkaun.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit AppKaun website"
              className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-violet-300"
            >
              <Globe size={16} />
            </a> */}

            <Link
              to="/pricing"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/[0.05] px-3.5 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-violet-500/10 hover:text-violet-300"
            >
              Explore plans
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <p className="mt-7 text-center text-[11px] tracking-wide text-slate-600">
          A product by Chirag Raj · Built to make working with documents simpler.
        </p>
      </div>
    </footer>
  );
}
