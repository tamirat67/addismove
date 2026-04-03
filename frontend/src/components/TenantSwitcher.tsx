"use client";

import { useTenant } from "@/context/TenantContext";
import { Bus } from "lucide-react";

export function TenantSwitcher() {
  const { tenant } = useTenant();

  return (
    <div className="flex flex-col gap-2 bg-slate-50/50 p-2 rounded-2xl border border-slate-100">
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-2 mb-1">
        Operator
      </p>
      <div className="flex flex-col gap-1.5">
        <div
          className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white shadow-sm ring-1 ring-slate-200"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center scale-110 rotate-3"
            style={{ backgroundColor: "#CC1F1F" }}
          >
            <Bus className="w-4 h-4 text-white" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-800">
            Anbessa Bus
          </span>
          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
        </div>
      </div>
    </div>
  );
}
