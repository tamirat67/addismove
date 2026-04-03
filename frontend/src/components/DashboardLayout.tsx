"use client";

import React, { useState } from "react";
import { useTenant } from "@/context/TenantContext";
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Bus, 
  History, 
  Settings, 
  Menu, 
  X, 
  Bell, 
  User,
  LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { TenantSwitcher } from "./TenantSwitcher";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

const NavItem = ({ icon: Icon, label, active }: NavItemProps) => {
  const { theme } = useTenant();
  return (
    <div 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group ${
        active 
          ? "bg-white shadow-sm ring-1 ring-black/5" 
          : "hover:bg-white/50"
      }`}
    >
      <Icon 
        className={`w-5 h-5 ${active ? "" : "text-gray-400 group-hover:text-gray-600"}`} 
        style={{ color: active ? theme.primary : undefined }}
      />
      <span className={`text-sm font-bold tracking-tight ${active ? "text-gray-900" : "text-gray-500 group-hover:text-gray-700"}`}>
        {label}
      </span>
    </div>
  );
};

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { tenant, theme } = useTenant();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 transform bg-white border-r border-slate-200 lg:translate-x-0 ${
          isOpen ? "w-64" : "-translate-x-full lg:w-20"
        }`}
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
                <span className="font-black text-xl tracking-tight uppercase" style={{ color: theme.text }}>
                  Anbessa Bus
                </span>
              )}
            </Link>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-1.5 flex-1 overflow-y-auto custom-scrollbar pr-1">
            <NavItem icon={LayoutDashboard} label="Dashboard" active />
            <NavItem icon={MapIcon} label="Fleet Map" />
            <NavItem icon={Bus} label="Bus Fleet" />
            <NavItem icon={History} label="Operations" />
            <NavItem icon={Settings} label="Settings" />
          </div>

          <div className="mt-auto space-y-4 pt-4 border-t border-slate-100">
            {isOpen && <TenantSwitcher />}
            <div className={`p-4 rounded-2xl bg-slate-50 flex items-center ${isOpen ? "gap-4" : "justify-center"}`}>
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0 border-2 border-white shadow-sm overflow-hidden">
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
        <header className="sticky top-0 z-40 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 flex items-center justify-between">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="hidden lg:flex p-2 text-slate-400 hover:text-slate-600 rounded-lg h-10 w-10 items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200"
          >
            <Menu className="w-5 h-5 font-black" />
          </button>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-all active:scale-95">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full border-2 border-white" style={{ backgroundColor: theme.primary }}></span>
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
