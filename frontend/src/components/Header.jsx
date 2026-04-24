import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const navItems = [
    { path: "/home", label: "Home" }, 
    { path: "/features", label: "Features" },
    { path: "/pricing", label: "Pricing" },
    { path: "/about", label: "About Us" },
    { path: "/contact", label: "Contact Us" }
  ];

  const isActive = (path) => location.pathname === path;
  const isHomePage = location.pathname === "/" || location.pathname === "/home";

  return (
    <header className="relative z-30 w-full">
      <div className={`${isHomePage ? "bg-[linear-gradient(90deg,#FEF6EE_942px,#0e7c67_943px)]" : "bg-white border-b border-slate-200"}`}>
        <div className="mx-auto flex w-full max-w-[1340px] items-center justify-between px-4 py-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-8 xl:gap-10 pr-10">
            <Link to="/home" className="flex shrink-0 items-center no-underline" onClick={() => setMenuOpen(false)}>
              <img src="/shared image.jpg" alt="Logo" className="h-22 w-auto" />
            </Link>

            <nav className="hidden items-center gap-7 lg:flex">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} className={`text-[18px] font-semibold no-underline pt-2 ${isActive(item.path) ? "text-[#04776d]" : "text-slate-700"}`}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            <Link
              to="/login"
              className={`rounded-xl border px-8 py-3 text-lg font-semibold no-underline ${isHomePage ? "border-[#e5f7f3] text-white" : "border-slate-300 text-slate-700"}`}
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="rounded-xl bg-[#f4824c] px-8 py-3 text-lg font-semibold text-white no-underline"
            >
              Register
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-md border lg:hidden ${isHomePage ? "border-[#e5f7f3] text-white" : "border-slate-300 text-slate-700"}`}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className={`px-4 py-4 sm:px-6 lg:hidden ${isHomePage ? "bg-[#04776d]" : "bg-white border-b border-slate-200"}`}>
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`rounded-md px-3 py-2.5 text-sm no-underline ${isActive(item.path) ? "bg-white/20 text-white" : isHomePage ? "text-white" : "text-slate-700"}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className={`rounded-md border px-3 py-2.5 text-center text-sm no-underline ${isHomePage ? "border-white/60 text-white" : "border-slate-300 text-slate-700"}`}
            >
              Log in
            </Link>
            <Link
              to="/signup"
              onClick={() => setMenuOpen(false)}
              className="rounded-md bg-[#f4824c] px-3 py-2.5 text-center text-sm font-semibold text-white no-underline"
            >
              Register
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}