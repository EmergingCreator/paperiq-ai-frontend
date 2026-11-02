import { Link } from "react-router-dom";
import { FileText, Sparkles, CheckCircle2 } from "lucide-react";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080d18] text-slate-100">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-violet-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-600/15 blur-[120px]" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl lg:grid-cols-2">
        {/* Left side */}
        <section className="hidden flex-col justify-between px-10 py-12 lg:flex xl:px-16">
          <Link to="/" className="inline-flex w-fit items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600">
              <FileText size={23} />
            </span>

            <span className="text-xl font-bold text-white">
              PaprIQ <span className="text-violet-400">AI</span>
            </span>
          </Link>

          <div className="relative z-10 mt-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/[0.08] px-3 py-1.5 text-xs text-violet-300">
              <Sparkles size={14} />
              Your intelligent document workspace
            </div>

            <h1 className="max-w-xl text-5xl font-bold leading-tight text-white xl:text-6xl">
              {title}
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-slate-400">
              {subtitle}
            </p>

            <div className="mt-9 space-y-5">
              {[
                "Ask questions about your PDFs",
                "Get instant AI-powered insights",
                "Find information without reading everything",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-violet-500/15 text-violet-300">
                    <CheckCircle2 size={16} />
                  </span>
                  <span className="text-sm text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-8">
            <div className="absolute inset-10 rounded-full bg-violet-600/20 blur-3xl" />
            <img
              src="./login-illustration.png"
              alt="AI assistant helping with PDF documents"
              className="relative mx-auto max-h-[340px] w-full max-w-lg object-contain"
            />
          </div>

          <p className="mt-8 text-xs text-slate-600">
            © {new Date().getFullYear()} PaprIQ AI · A product by AppKaun
          </p>
        </section>

        {/* Right side */}
        <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-8 lg:px-10">
          <div className="w-full max-w-md">
            {/* Mobile brand */}
            <Link
              to="/"
              className="mb-10 flex items-center justify-center gap-3 lg:hidden"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600">
                <FileText size={21} />
              </span>
              <span className="text-lg font-bold text-white">
                PaprIQ <span className="text-violet-400">AI</span>
              </span>
            </Link>

            {/* Form card */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-7 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-9">
              <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

              <div className="relative">
                {children}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-5 text-xs text-slate-500">
              <Link to="/privacy-policy" className="hover:text-violet-300">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-violet-300">
                Terms & Conditions
              </Link>
            </div>

            <p className="mt-5 text-center text-[11px] text-slate-600">
              © {new Date().getFullYear()} PaprIQ AI · Powered by AppKaun
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}