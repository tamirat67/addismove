"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BusFront, Wallet, Ticket, ShieldAlert, Home, Search, LayoutDashboard } from "lucide-react";

export function Navigation() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  const mainNavItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Routes", path: "/routes", icon: Search },
    { name: "Wallet", path: "/wallet", icon: Wallet },
    { name: "Ticket", path: "/ticket", icon: Ticket },
    { name: "Admin", path: "/admin", icon: ShieldAlert },
  ];

  return (
    <>
      {/* TOP HEADER (Desktop: Full / Mobile: Branding Only) */}
      <header
        className="fixed top-0 left-0 right-0 z-50 w-full shadow-lg"
        style={{ backgroundColor: "#CC1F1F" }}
      >
        {/* Yellow top stripe */}
        <div className="w-full h-1.5" style={{ backgroundColor: "#FFD600" }} />

        <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-14">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div
              className="p-2 rounded-lg shadow-md group-hover:scale-105 transition-transform duration-200 ring-2 animate-float"
              style={{ backgroundColor: "#FFD600" }}
            >
              <BusFront className="w-5 h-5" style={{ color: "#CC1F1F" }} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-tight">
              <div className="flex items-baseline gap-2">
                <span className="font-black text-sm sm:text-base tracking-wider" style={{ color: "#FFFFFF" }}>
                  Anbessa Bus
                </span>
                <span className="text-[10px] font-bold text-white/60">አንበሳ ባስ</span>
              </div>
              <span
                className="font-bold text-[8px] sm:text-[9px] tracking-[0.25em] uppercase"
                style={{ color: "#FFD600" }}
              >
                Addis Ababa Transit
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links (Hidden on Mobile) */}
          <div className="hidden lg:flex items-center gap-1">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className="relative px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all duration-200 flex items-center gap-2"
                  style={{
                    color: isActive ? "#CC1F1F" : "rgba(255,255,255,0.80)",
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="anbessa-nav-pill-desktop"
                      className="absolute inset-0 rounded-lg shadow-md"
                      style={{ backgroundColor: "#FFD600" }}
                      transition={{ type: "spring", stiffness: 450, damping: 28 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className="w-4 h-4" strokeWidth={isActive ? 2.5 : 2} />
                    <span>{item.name}</span>
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Right Action (Optional - Profile or Search) */}
          <div className="lg:hidden">
              {/* Could add a specific mobile action here if needed */}
          </div>
        </nav>

        {/* Yellow bottom stripe (Desktop only) */}
        <div className="hidden lg:block w-full h-1" style={{ backgroundColor: "#FFD600" }} />
      </header>

      {/* BOTTOM NAVIGATION (Mobile Only) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around h-16 px-4">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                className="relative flex flex-col items-center justify-center w-full h-full gap-1 transition-all"
              >
                <div className={`relative p-2 rounded-xl transition-all ${isActive ? "bg-[#CC1F1F] text-white shadow-lg" : "text-slate-400"}`}>
                    <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                    {isActive && (
                        <motion.div 
                            layoutId="mobile-active-bg"
                            className="absolute inset-0 bg-[#CC1F1F] rounded-xl -z-10"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? "text-[#CC1F1F]" : "text-slate-400"}`}>
                  {item.name === "Admin" ? "Op" : item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
