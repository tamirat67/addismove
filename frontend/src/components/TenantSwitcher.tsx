"use client";

import { useTenant } from "@/context/TenantContext";
import { Bus, Train } from "lucide-react";

export function TenantSwitcher() {
  const { tenant, setTenant } = useTenant();

  return (
    <div className="flex flex-col gap-2 bg-slate-50/50 p-2 rounded-2xl border border-slate-100">
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-2 mb-1">
        Context Switcher
      </p>
      <div className="flex flex-col gap-1.5">
        <button
          onClick={() => setTenant("anbessa")}
          className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 group ${
            tenant === "anbessa" 
              ? "bg-white shadow-sm ring-1 ring-slate-200" 
              : "hover:bg-white/50"
          }`}
        >
          <div 
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-transform ${
              tenant === "anbessa" ? "scale-110 rotate-3" : "opacity-40 group-hover:opacity-100"
            }`}
            style={{ backgroundColor: tenant === "anbessa" ? "#D32F2F" : "#CBD5E1" }}
          >
            <Bus className={`w-4 h-4 ${tenant === "anbessa" ? "text-white" : "text-slate-400"}`} />
          </div>
          <span className={`text-[11px] font-black uppercase tracking-widest transition-colors ${
            tenant === "anbessa" ? "text-slate-800" : "text-slate-400 group-hover:text-slate-600"
          }`}>
            Anbessa
          </span>
          {tenant === "anbessa" && (
            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
          )}
        </button>

        <button
          onClick={() => setTenant("lrt")}
          className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 group ${
            tenant === "lrt" 
              ? "bg-white shadow-sm ring-1 ring-slate-200" 
              : "hover:bg-white/50"
          }`}
        >
          <div 
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-transform ${
              tenant === "lrt" ? "scale-110 -rotate-3" : "opacity-40 group-hover:opacity-100"
            }`}
            style={{ backgroundColor: tenant === "lrt" ? "#00796B" : "#CBD5E1" }}
          >
            <Train className={`w-4 h-4 ${tenant === "lrt" ? "text-white" : "text-slate-400"}`} />
          </div>
          <span className={`text-[11px] font-black uppercase tracking-widest transition-colors ${
            tenant === "lrt" ? "text-slate-800" : "text-slate-400 group-hover:text-slate-600"
          }`}>
            Addis LRT
          </span>
          {tenant === "lrt" && (
            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
          )}
        </button>
      </div>
    </div>
  );
}
