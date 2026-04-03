"use client";

import { useTenant } from "@/context/TenantContext";
import { 
    BusFront, 
    ShieldCheck, 
    Radio, 
    Activity, 
    MapPin, 
    ChevronRight,
    ExternalLink,
    Globe
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function Footer() {
  const { theme, tenant } = useTenant();

  return (
    <footer className="relative w-full overflow-hidden bg-[#09090b] pt-24 pb-40">
        {/* Subtle background accent */}
        <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] opacity-10 blur-[120px] rounded-full -translate-y-1/2"
            style={{ backgroundColor: theme.primary }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
                
                {/* Brand & Status */}
                <div className="lg:col-span-4 space-y-8">
                    <Link href="/" className="flex items-center gap-4 group">
                        <div 
                            className="p-3 rounded-2xl shadow-2xl transition-transform group-hover:rotate-12"
                            style={{ backgroundColor: theme.primary }}
                        >
                            <BusFront className="w-7 h-7 text-white" strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-black text-white tracking-tighter uppercase">{tenant} <span style={{ color: theme.primary }}>Pro</span></span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Unified Transit Network</span>
                        </div>
                    </Link>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                            <div className="relative">
                                <motion.div 
                                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }} 
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute inset-0 rounded-full bg-emerald-500"
                                />
                                <div className="relative w-3 h-3 rounded-full bg-emerald-500" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Fleet Sync</span>
                                <span className="text-[9px] font-bold text-slate-500 uppercase">Latency: 14ms · Global Node</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                            <div className="p-2 rounded-lg bg-sky-500/10">
                                <Radio className="w-4 h-4 text-sky-400" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Radar Health</span>
                                <span className="text-[9px] font-bold text-slate-500 uppercase">Operational · 99.9% Uptime</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Columns */}
                <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-12">
                    <div className="space-y-6">
                        <h4 className="text-[11px] font-black text-white uppercase tracking-[0.25em] pb-2 border-b border-white/10">Corridors</h4>
                        <ul className="space-y-3">
                            {["Network Map", "Live Tracking", "Schedule Hub", "Station Finder"].map(link => (
                                <li key={link}>
                                    <Link href="#" className="text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center group">
                                        <ChevronRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#CC1F1F]" />
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-[11px] font-black text-white uppercase tracking-[0.25em] pb-2 border-b border-white/10">Resources</h4>
                        <ul className="space-y-3">
                            {["Smart Pass Hub", "Corridor Wallet", "Identity Verification", "Privacy Vault"].map(link => (
                                <li key={link}>
                                    <Link href="#" className="text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center group">
                                        <ChevronRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#CC1F1F]" />
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-[11px] font-black text-white uppercase tracking-[0.25em] pb-2 border-b border-white/10">Network</h4>
                        <div className="flex gap-4">
                            {[ExternalLink, Globe].map((Icon, i) => (
                                <Link key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:bg-white hover:text-[#09090b] transition-all">
                                    <Icon className="w-5 h-5" />
                                </Link>
                            ))}
                        </div>
                        <div className="p-4 rounded-2xl bg-[#CC1F1F08] border border-[#CC1F1F20]">
                            <p className="text-[9px] font-black text-[#CC1F1F] uppercase tracking-widest leading-relaxed">
                                High-Security <br />Authorized Ops Only
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] sm:text-[12px] font-black uppercase tracking-[0.3em]">
                    <span className="text-white/30">Powered By</span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FFD600] to-amber-400 drop-shadow-[0_0_10px_rgba(255,214,0,0.4)]">
                        TangaTech Innovations
                    </span>
                    <span className="text-white/30">@ 2026 · All Rights Reserved</span>
                </div>
                <div className="flex items-center gap-8">
                    <Link href="#" className="text-[10px] font-bold text-white/60 hover:text-white uppercase tracking-widest">Legal Authority</Link>
                    <Link href="#" className="text-[10px] font-bold text-white/60 hover:text-white uppercase tracking-widest">Corridor Privacy</Link>
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest italic">Encrypted Connection</span>
                    </div>
                </div>
            </div>
        </div>
    </footer>
  );
}
