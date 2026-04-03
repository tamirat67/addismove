"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BusFront, Wallet, Ticket, ShieldAlert } from "lucide-react";
import { useState, useEffect } from "react";

export function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  if (pathname.startsWith("/admin")) return null;

  const navItems = [
    { name: "Wallet", path: "/wallet", icon: Wallet },
    { name: "Ticket", path: "/ticket", icon: Ticket },
    { name: "Admin", path: "/admin", icon: ShieldAlert },
  ];

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/90 backdrop-blur-lg shadow-sm border-b border-gray-200 py-3" 
          : "bg-white border-b border-transparent py-4"
      }`}
    >
      <div className="flex justify-between items-center max-w-md mx-auto px-4 md:px-0">
        <Link 
          href="/" 
          className="font-black text-2xl tracking-tight flex items-center gap-2 group"
        >
          <div className="bg-[#E63946] p-1.5 rounded-xl shadow-inner group-hover:bg-[#FFC107] group-hover:-translate-y-0.5 transition-all duration-300">
            <BusFront className="w-5 h-5 text-white group-hover:text-gray-900 transition-colors" strokeWidth={2.5} />
          </div>
          <div className="flex items-center">
            <span className="text-gray-900">Addis</span>
            <span className="text-[#E63946]">Move</span>
          </div>
        </Link>
        
        <div className="flex gap-1 bg-gray-100 p-1 rounded-full shadow-inner border border-gray-200/60">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.path} 
                href={item.path} 
                className={`relative px-3 py-1.5 rounded-full text-sm font-bold transition-colors flex items-center gap-1.5 ${
                  isActive 
                    ? "text-gray-900" 
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-[#FFC107] shadow-sm rounded-full border border-yellow-300"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#E63946]" : ""}`} strokeWidth={isActive ? 2.5 : 2} />
                  <span className={`${isActive ? "block" : "hidden sm:block"}`}>{item.name}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
