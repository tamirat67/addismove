"use client";

import { useTenant } from "@/context/TenantContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    Ticket, 
    Search, 
    Filter, 
    Download, 
    ExternalLink, 
    CheckCircle2, 
    Clock, 
    XCircle,
    ArrowUpRight
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TicketLog() {
    const { tickets, adminTheme, theme } = useTenant();
    const isDark = adminTheme === "zinc";
    const [search, setSearch] = useState("");
    
    const filteredTickets = tickets.filter(t => 
        t.id.toLowerCase().includes(search.toLowerCase()) || 
        t.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
        t.route.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const getStatusStyle = (status: string) => {
        switch(status) {
            case "Active": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case "Used": return "bg-slate-500/10 text-slate-500 border-slate-500/20";
            case "Expired": return "bg-rose-500/10 text-rose-500 border-rose-500/20";
            default: return "bg-slate-500/10 text-slate-500 border-slate-500/20";
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Search Area */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                        placeholder="Search by ID, Bus, or Route..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={`h-12 pl-12 rounded-2xl border-0 shadow-lg ${
                            isDark ? "bg-zinc-900 text-white placeholder:text-zinc-600" : "bg-white text-slate-900 placeholder:text-slate-400"
                        }`}
                    />
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button variant="outline" className={`flex-1 md:flex-none h-12 rounded-2xl border-0 shadow-lg px-6 font-black uppercase text-[10px] tracking-widest ${
                        isDark ? "bg-zinc-900 text-zinc-400 hover:bg-zinc-800" : "bg-white text-slate-500 hover:bg-slate-50"
                    }`}>
                        <Filter className="w-4 h-4 mr-2" /> Filter
                    </Button>
                    <Button variant="outline" className={`flex-1 md:flex-none h-12 rounded-2xl border-0 shadow-lg px-6 font-black uppercase text-[10px] tracking-widest ${
                        isDark ? "bg-zinc-900 text-zinc-400 hover:bg-zinc-800" : "bg-white text-slate-500 hover:bg-slate-50"
                    }`}>
                        <Download className="w-4 h-4 mr-2" /> CSV
                    </Button>
                </div>
            </div>

            {/* Ticket Table */}
            <Card className={`border-0 shadow-2xl rounded-[2.5rem] overflow-hidden transition-colors ${isDark ? "bg-zinc-900" : "bg-white"}`}>
                <CardHeader className="p-8 pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-[#CC1F1F0F]">
                                <Ticket className="w-5 h-5 text-[#CC1F1F]" />
                            </div>
                            <CardTitle className={`text-sm font-black uppercase tracking-widest ${isDark ? "text-white" : "text-slate-800"}`}>Issued Asset Ledger</CardTitle>
                        </div>
                        <span className="text-[10px] font-black px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 uppercase tracking-widest border border-emerald-500/20">
                            {filteredTickets.length} Total Records
                        </span>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className={`text-[9px] font-black uppercase tracking-[0.2em] border-b ${
                                    isDark ? "border-zinc-800 text-zinc-500" : "border-slate-50 text-slate-400"
                                }`}>
                                    <th className="px-8 py-5">Asset Identifier</th>
                                    <th className="px-8 py-5">Operational Path</th>
                                    <th className="px-8 py-5">Fleet Unit</th>
                                    <th className="px-8 py-5">Price</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5">Issued At</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${isDark ? "divide-zinc-800" : "divide-slate-50"}`}>
                                {filteredTickets.length > 0 ? filteredTickets.map((t, idx) => (
                                    <motion.tr 
                                        key={t.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.02 }}
                                        className={`group transition-all ${isDark ? "hover:bg-zinc-800/50" : "hover:bg-slate-50/80"}`}
                                    >
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <span className={`text-[10px] font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>#{t.id.split('-').pop()}</span>
                                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{t.securityCode}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`text-[10px] font-black uppercase ${isDark ? "text-zinc-300" : "text-slate-700"}`}>{t.route}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                                <span className={`text-[10px] font-black uppercase ${isDark ? "text-zinc-400" : "text-slate-600"}`}>{t.plateNumber}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 font-black text-[10px] text-slate-900 dark:text-white">
                                            {t.price} ETB
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusStyle(t.status)}`}>
                                                {t.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                            {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <Button size="sm" variant="ghost" className={`h-8 w-8 rounded-lg p-0 ${isDark ? "hover:bg-zinc-700" : "hover:bg-slate-100"}`}>
                                                <ArrowUpRight className="w-4 h-4 text-slate-400" />
                                            </Button>
                                        </td>
                                    </motion.tr>
                                )) : (
                                    <tr>
                                        <td colSpan={7} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="p-4 bg-slate-50 dark:bg-zinc-800 rounded-full">
                                                    <Ticket className="w-8 h-8 text-slate-200" />
                                                </div>
                                                <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.2em]">No Digital Assets Found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
