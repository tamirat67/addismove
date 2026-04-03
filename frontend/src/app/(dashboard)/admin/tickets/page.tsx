"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { TicketLog } from "@/components/TicketLog";
import { useTenant } from "@/context/TenantContext";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function AdminTicketsPage() {
    const { adminTheme, theme } = useTenant();
    const isDark = adminTheme === "zinc";

    return (
        <DashboardLayout>
            <div className="space-y-8 max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h2 className={`text-3xl font-black tracking-tight uppercase flex items-center gap-3 ${isDark ? "text-white" : "text-slate-800"}`}>
                            Ticket <span style={{ color: theme.primary }}>Ledger</span>
                            <span className={`text-[10px] px-2.5 py-1 rounded-lg tracking-[0.2em] border font-black ${
                                isDark ? "bg-zinc-800 text-zinc-400 border-zinc-700" : "bg-slate-100 text-slate-500 border-slate-200"
                            }`}>
                                ARCHIVE
                            </span>
                        </h2>
                        <div className="flex items-center gap-3 mt-1">
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 
                                High-Security Audit Trail
                            </p>
                        </div>
                    </motion.div>
                </header>

                <TicketLog />
            </div>
        </DashboardLayout>
    );
}
