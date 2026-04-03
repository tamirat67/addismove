"use client";

import React, { useState } from "react";
import { useTenant } from "@/context/TenantContext";
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Bus, 
  BusFront,
  History, 
  Settings, 
  Menu, 
  X, 
  Bell, 
  User,
  LogOut,
  Sun,
  Moon,
  Monitor,
  Ticket
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TenantSwitcher } from "./TenantSwitcher";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  href?: string;
}

const NavItem = ({ icon: Icon, label, active, href }: NavItemProps) => {
  const { theme, adminTheme } = useTenant();
  const isDark = adminTheme === "zinc";

  const content = (
    <div 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group ${
        active 
          ? isDark ? "bg-zinc-800 shadow-xl ring-1 ring-white/5" : "bg-white shadow-sm ring-1 ring-black/5" 
          : isDark ? "hover:bg-zinc-800/50" : "hover:bg-white/50"
      }`}
    >
      <Icon 
        className={`w-5 h-5 ${active ? "" : isDark ? "text-zinc-500 group-hover:text-zinc-300" : "text-gray-400 group-hover:text-gray-600"}`} 
        style={{ color: active ? theme.primary : undefined }}
      />
      <span className={`text-sm font-bold tracking-tight ${active ? isDark ? "text-white" : "text-gray-900" : isDark ? "text-zinc-400 group-hover:text-zinc-200" : "text-gray-500 group-hover:text-gray-700"}`}>
        {label}
      </span>
    </div>
  );

  return href ? (
    <Link href={href} className="block">
      {content}
    </Link>
  ) : content;
};

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { tenant, theme, adminTheme, setAdminTheme } = useTenant();
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const isDark = adminTheme === "zinc";

  return (
    <div className={`flex min-h-screen font-sans antialiased transition-colors duration-500 ${
        isDark ? "bg-zinc-950 text-zinc-100" : "bg-slate-50 text-slate-900"
    }`}>
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 transform border-r ${
          isOpen ? "w-64" : "-translate-x-full lg:w-20"
        } ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-slate-200"}`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-8 px-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div 
                className="w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12"
                style={{ backgroundColor: theme.primary }}
              >
                <Bus className="w-6 h-6 text-white" />
              </div>
              {isOpen && (
                <span className="font-black text-xl tracking-tight uppercase" style={{ color: isDark ? "white" : theme.text }}>
                  Anbessa Bus
                </span>
              )}
            </Link>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                  isDark ? "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-1.5 flex-1 overflow-y-auto custom-scrollbar pr-1">
            <NavItem icon={LayoutDashboard} label="Dashboard" href="/admin" active={pathname === '/admin'} />
            <NavItem icon={Ticket} label="Tickets" href="/admin/tickets" active={pathname.startsWith('/admin/tickets')} />
            <NavItem icon={MapIcon} label="Fleet Map" />
            <NavItem icon={Bus} label="Bus Fleet" />
            <NavItem icon={History} label="Operations" />
            <NavItem icon={Settings} label="Settings" />
          </div>

          <div className="mt-auto space-y-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
            {isOpen && <TenantSwitcher />}

            {/* Return to Public Site */}
            <Link
              href="/"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group border border-[#CC1F1F]/20 hover:border-[#CC1F1F]/50 hover:bg-[#CC1F1F]/5 ${isOpen ? "" : "justify-center"}`}
              title="Return to Public Site"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform" style={{ backgroundColor: "#CC1F1F" }}>
                <BusFront className="w-4 h-4 text-white" />
              </div>
              {isOpen && (
                <div className="min-w-0">
                  <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#CC1F1F" }}>Public Site</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Return to Anbessa</p>
                </div>
              )}
            </Link>

            <div className={`p-4 rounded-2xl flex items-center ${isOpen ? "gap-4" : "justify-center"} ${
                isDark ? "bg-zinc-800/50" : "bg-slate-50"
            }`}>
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0 border-2 border-white shadow-sm overflow-hidden dark:border-zinc-700">
                <User className="text-slate-400" />
              </div>
              {isOpen && (
                <div className="min-w-0">
                  <p className="text-sm font-black truncate">Abnet Solomon</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">System Admin</p>
                </div>
              )}
              {isOpen && (
                <button title="Log out" className="text-slate-400 hover:text-red-500 transition-colors ml-auto">
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isOpen ? "lg:ml-64" : "lg:ml-20"}`}>
        <header className={`sticky top-0 z-40 h-16 backdrop-blur-md border-b px-4 flex items-center justify-between transition-colors ${
            isDark ? "bg-zinc-950/80 border-zinc-800" : "bg-white/80 border-slate-200"
        }`}>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`hidden lg:flex p-2 rounded-lg h-10 w-10 items-center justify-center transition-colors border ${
                isDark ? "text-zinc-500 hover:text-zinc-300 bg-zinc-900 border-zinc-800 hover:bg-zinc-800" : "text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 border-slate-200"
            }`}
          >
            <Menu className="w-5 h-5 font-black" />
          </button>
          
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button 
                onClick={() => setAdminTheme(isDark ? "light" : "zinc")}
                className={`flex items-center justify-center w-10 h-10 rounded-xl border transition-all active:scale-95 ${
                    isDark ? "bg-zinc-900 border-zinc-800 text-yellow-400 hover:bg-zinc-800" : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
                }`}
            >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button className={`relative p-2 transition-all active:scale-95 ${
                isDark ? "text-zinc-500 hover:text-zinc-300" : "text-slate-400 hover:text-slate-600"
            }`}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full border-2 border-white dark:border-zinc-900" style={{ backgroundColor: theme.primary }}></span>
            </button>
          </div>
        </header>

        <main className="p-4 lg:p-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
