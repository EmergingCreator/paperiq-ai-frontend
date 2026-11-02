import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FileText,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  UserRound,
  LifeBuoy,
  Menu,
  X,
  CreditCard,
  ChevronRight,
  Sparkles,
  Upload,
  MessagesSquare,
  MessageCircle,
} from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import Footer from "./Footer";

export default function SiteLayout({ children }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isAdmin = user?.role === "admin";
  const dashboardPath = isAdmin ? "/admin" : "/dashboard";

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await logout();
      closeMobileMenu();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  }

  const navLinkClass = ({ isActive }) =>
    [
      "inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
      isActive
        ? "bg-violet-500/15 text-violet-300 ring-1 ring-violet-400/20"
        : "text-slate-400 hover:bg-white/[0.05] hover:text-white",
    ].join(" ");

  const mobileLinkClass = ({ isActive }) =>
    [
      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
      isActive
        ? "bg-violet-500/15 text-violet-300 ring-1 ring-violet-400/20"
        : "text-slate-300 hover:bg-white/5 hover:text-white",
    ].join(" ");

  const uploadButtonClass =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-400 hover:shadow-violet-500/20";

  return (
    <div className="min-h-screen bg-[#080d18] text-slate-100">
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#080d18]/90 backdrop-blur-2xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          {/* PaprIQ Brand */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            aria-label="PaprIQ home"
            className="group flex shrink-0 items-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            <img
              src="./logo.png"
              alt="PaprIQ"
              className="h-11 w-auto max-w-[170px] object-contain transition duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-1 lg:flex">
            {user ? (
              <>
                <NavLink to={dashboardPath} end className={navLinkClass}>
                  {isAdmin ? (
                    <ShieldCheck size={17} />
                  ) : (
                    <LayoutDashboard size={17} />
                  )}
                  Dashboard
                </NavLink>

                {!isAdmin && (
                  <>
                    <NavLink to="/documents" className={navLinkClass}>
                      <Upload size={17} />
                      Upload PDF
                    </NavLink>

                    <NavLink to="/conversations" className={navLinkClass}>
                      <MessagesSquare size={17} />
                      Conversations
                    </NavLink>

                    <NavLink to="/profile" className={navLinkClass}>
                      <UserRound size={17} />
                      Profile
                    </NavLink>

                    <NavLink to="/helpbox" className={navLinkClass}>
                      <LifeBuoy size={17} />
                      Support
                    </NavLink>

                    <NavLink to="/faq" className={navLinkClass}>
                      <MessageCircle size={17} />
                      FAQ
                    </NavLink>
                  </>
                )}

                {isAdmin && (
                  <NavLink to="/admin/helpbox" className={navLinkClass}>
                    <LifeBuoy size={17} />
                    Support inbox
                  </NavLink>
                )}
              </>
            ) : (
              <>
                {/* <NavLink to="/pricing" className={navLinkClass}>
                  Pricing
                </NavLink> */}
              </>
            )}
          </div>

          {/* Desktop right side */}
          <div className="hidden shrink-0 items-center gap-3 md:flex">
            {user ? (
              <>
                <div className="hidden items-center gap-2 border-l border-white/10 pl-4 xl:flex">
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-violet-400/20 bg-violet-500/10 text-sm font-bold text-violet-300">
                    {(user.name || user.email || "U").charAt(0).toUpperCase()}
                  </span>

                  <div className="max-w-32">
                    <p className="truncate text-sm font-medium text-slate-200">
                      {user.name || "Your account"}
                    </p>
                    <p className="text-xs capitalize text-slate-500">
                      {isAdmin ? "Administrator" : "Free account"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm font-medium text-slate-300 transition hover:border-red-400/20 hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <LogOut size={16} />
                  {loggingOut ? "Logging out..." : "Log out"}
                </button>
              </>
            ) : (
              <>
                <NavLink to="/pricing" className={navLinkClass}>
                  <CreditCard size={17} />
                  Pricing
                </NavLink>

                <NavLink to="/faq" className={navLinkClass}>
                  <MessageCircle size={17} />
                  FAQ
                </NavLink>

                <Link
                  to="/login"
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  Log in
                </Link>

                <Link to="/register" className={uploadButtonClass}>
                  Get started
                  <ChevronRight size={15} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={
              mobileOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={mobileOpen}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 transition hover:bg-white/10 hover:text-white md:hidden"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {/* Mobile navigation */}
        {mobileOpen && (
          <div className="border-t border-white/10 bg-[#080d18] px-4 pb-5 pt-4 md:hidden sm:px-6">
            <div className="mx-auto max-w-7xl space-y-1">
              {user ? (
                <>
                  <div className="mb-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-violet-500/15 text-base font-bold text-violet-300 ring-1 ring-violet-400/20">
                      {(user.name || user.email || "U").charAt(0).toUpperCase()}
                    </span>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {user.name || "Your account"}
                      </p>
                      <p className="text-xs capitalize text-slate-400">
                        {isAdmin ? "Administrator" : "User account"}
                      </p>
                    </div>
                  </div>

                  <NavLink
                    to={dashboardPath}
                    end
                    onClick={closeMobileMenu}
                    className={mobileLinkClass}
                  >
                    {isAdmin ? (
                      <ShieldCheck size={18} />
                    ) : (
                      <LayoutDashboard size={18} />
                    )}
                    Dashboard
                  </NavLink>

                  {!isAdmin && (
                    <>
                      <NavLink
                        to="/upload"
                        onClick={closeMobileMenu}
                        className={mobileLinkClass}
                      >
                        <Upload size={18} />
                        Upload PDF
                      </NavLink>

                      <NavLink
                        to="/conversations"
                        onClick={closeMobileMenu}
                        className={mobileLinkClass}
                      >
                        <MessagesSquare size={18} />
                        Conversations
                      </NavLink>

                      <NavLink
                        to="/profile"
                        onClick={closeMobileMenu}
                        className={mobileLinkClass}
                      >
                        <UserRound size={18} />
                        Profile
                      </NavLink>

                      <NavLink
                        to="/helpbox"
                        onClick={closeMobileMenu}
                        className={mobileLinkClass}
                      >
                        <LifeBuoy size={18} />
                        Support
                      </NavLink>

                      <NavLink
                        to="/faq"
                        className={mobileLinkClass}
                        onClick={closeMobileMenu}
                      >
                        <MessageCircle size={17} />
                        FAQ
                      </NavLink>
                    </>
                  )}

                  {isAdmin && (
                    <NavLink
                      to="/admin/helpbox"
                      onClick={closeMobileMenu}
                      className={mobileLinkClass}
                    >
                      <LifeBuoy size={18} />
                      Support inbox
                    </NavLink>
                  )}

                  <div className="my-3 border-t border-white/10" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
                  >
                    <LogOut size={18} />
                    {loggingOut ? "Logging out..." : "Log out"}
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/pricing"
                    onClick={closeMobileMenu}
                    className={mobileLinkClass}
                  >
                    <CreditCard size={18} />
                    Pricing
                  </NavLink>

                     <NavLink
                        to="/faq"
                        className={mobileLinkClass}
                        onClick={closeMobileMenu}
                      >
                        <MessageCircle size={17} />
                        FAQ
                      </NavLink>

                  <NavLink
                    to="/login"
                    onClick={closeMobileMenu}
                    className={mobileLinkClass}
                  >
                    Log in
                  </NavLink>

                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-400"
                  >
                    Get started
                    <ChevronRight size={16} />
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main page */}
      <main>{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
