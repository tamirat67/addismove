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
    <div className="fixed top-4 w-full z-50 flex justify-center px-4 pointer-events-none">
      <nav className="pointer-events-auto flex items-center justify-between w-full max-w-md bg-black/50 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] rounded-3xl py-2 px-3">
        {/* Brand */}
        <Link 
          href="/" 
          className="flex items-center gap-2 pl-1 group"
        >
          <div className="bg-gradient-to-tr from-[#E63946] to-[#FFC107] p-1.5 rounded-xl shadow-lg ring-1 ring-white/20 group-hover:scale-105 transition-transform">
            <BusFront className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-tight pr-2">
            <span className="text-white font-black text-sm tracking-wider">Addis</span>
            <span className="text-white/70 font-bold text-[10px] tracking-[0.2em] uppercase">Move</span>
          </div>
        </Link>
        
        {/* Links */}
        <div className="flex gap-1 pl-2 border-l border-white/10">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.path} 
                href={item.path} 
                className={`relative px-3 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive 
                    ? "text-white" 
                    : "text-white/50 hover:text-white/90 hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="glass-nav-pill"
                    className="absolute inset-0 bg-white/20 shadow-[inset_0_1px_3px_rgba(255,255,255,0.3)] rounded-2xl border border-white/10"
                    transition={{ type: "spring", stiffness: 450, damping: 25 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#FFC107]" : ""}`} strokeWidth={isActive ? 2.5 : 2} />
                  <span className={`${isActive ? "block" : "hidden sm:block"}`}>{item.name}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
