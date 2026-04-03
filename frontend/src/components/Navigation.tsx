"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BusFront, Wallet, Ticket, ShieldAlert } from "lucide-react";

export function Navigation() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  const navItems = [
    { name: "Wallet", path: "/wallet", icon: Wallet },
    { name: "Ticket", path: "/ticket", icon: Ticket },
    { name: "Admin", path: "/admin", icon: ShieldAlert },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 w-full shadow-lg"
      style={{ backgroundColor: "#CC1F1F" }}
    >
      {/* Yellow top stripe — like the yellow band on the Anbessa bus roof */}
      <div className="w-full h-1.5" style={{ backgroundColor: "#FFD600" }} />

      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-14">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
          <div
            className="p-2 rounded-lg shadow-md group-hover:scale-105 transition-transform duration-200 ring-2"
            style={{ backgroundColor: "#FFD600" }}
          >
            <BusFront className="w-5 h-5" style={{ color: "#CC1F1F" }} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-black text-base tracking-wider" style={{ color: "#FFFFFF" }}>
              Anbessa Bus
            </span>
            <span
              className="font-bold text-[9px] tracking-[0.25em] uppercase"
              style={{ color: "#FFD600" }}
            >
              Addis Ababa Transit
            </span>
          </div>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                className="relative px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2"
                style={{
                  color: isActive ? "#CC1F1F" : "rgba(255,255,255,0.80)",
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="anbessa-nav-pill"
                    className="absolute inset-0 rounded-lg shadow-md"
                    style={{ backgroundColor: "#FFD600" }}
                    transition={{ type: "spring", stiffness: 450, damping: 28 }}
                  />
                )}
                <span
                  className="relative z-10 flex items-center gap-2"
                  onMouseEnter={(e) => {
                    if (!isActive)
                      (e.currentTarget.parentElement as HTMLElement).style.color = "#FFD600";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      (e.currentTarget.parentElement as HTMLElement).style.color =
                        "rgba(255,255,255,0.80)";
                  }}
                >
                  <Icon
                    className="w-4 h-4"
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className={`${isActive ? "block" : "hidden sm:block"}`}>
                    {item.name}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Yellow bottom stripe */}
      <div className="w-full h-1" style={{ backgroundColor: "#FFD600" }} />
    </header>
  );
}
