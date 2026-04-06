"use client";

import { useTenant } from "@/context/TenantContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, ArrowLeft, RefreshCw, Bus, Radio, Type, ShieldCheck, Fingerprint, Layers, CheckCircle2, Clock, CreditCard, ChevronRight, Share2, Info, Zap } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Ticket() {
  const { tickets, balance } = useTenant();
  const [focusedTicketId, setFocusedTicketId] = useState<string | null>(tickets.length > 0 ? tickets[0].id : null);
  const [mode, setMode] = useState<"qr" | "nfc" | "manual">("qr");

  const focusedTicket = tickets.find(t => t.id === focusedTicketId) || tickets[0];

  const handleQuickBoard = () => {
    if (tickets.length > 0) {
      setFocusedTicketId(tickets[0].id);
      setMode("nfc");
    }
  };

    return (
      <div className="max-w-7xl mx-auto w-full px-6 pt-20 pb-32 flex flex-col items-center justify-center text-center space-y-12 animate-in fade-in zoom-in-95 duration-700">
        <div className="relative group">
            {/* Animated Glow Rings */}
            <div className="absolute inset-0 bg-[#CC1F1F] rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse"></div>
            <div className="absolute inset-[-20px] border border-[#CC1F1F10] rounded-full animate-[spin_10s_linear_infinite]"></div>
            
            <div className="relative p-12 bg-white rounded-[4rem] shadow-2xl border border-slate-50 flex flex-col items-center">
                <div className="p-6 bg-[#CC1F1F] rounded-[2rem] shadow-xl shadow-red-500/20 mb-6 animate-float">
                    <QrCode className="w-12 h-12 text-[#FFD600]" strokeWidth={1.5} />
                </div>
                <div className="space-y-2">
                    <p className="text-[#CC1F1F] font-black uppercase text-[10px] tracking-[0.4em]">Operational Asset Required</p>
                    <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">No Active <span className="text-[#CC1F1F]">Tokens</span></h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">አንበሳ ባስ · Anbessa Bus</p>
                </div>
            </div>
        </div>

        <div className="space-y-6 w-full max-w-sm">
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
                You currently have no active transit assets. Secure your next ride by acquiring a digital pass from the dashboard.
            </p>
            <Link href="/" className="block">
              <Button className="w-full bg-slate-900 hover:bg-[#CC1F1F] text-white font-black uppercase tracking-[0.2em] text-[10px] h-16 rounded-2xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3">
                <Zap className="w-4 h-4 text-[#FFD600]" /> Acquire Boarding Pass
              </Button>
            </Link>
            <div className="flex items-center justify-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Secured</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-sky-500"></div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Real-time</span>
                </div>
            </div>
        </div>
      </div>
    );

  // --- FOCUS VIEW (The Cinematic Ticket) ---
  if (focusedTicketId) {
    return (
      <div className="max-w-7xl mx-auto w-full px-6 pt-10 pb-32 flex-1 animate-in slide-in-from-bottom duration-500">
        <div className="w-full space-y-8">
            {/* No return button, token inspector is standalone */ }

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Left Column: Context & Metadata (Desktop Only) */}
                <div className="hidden lg:block lg:col-span-4 space-y-8 pt-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#CC1F1F10] rounded-full text-[#CC1F1F] text-[10px] font-black uppercase tracking-widest">
                            <ShieldCheck className="w-3 h-3" /> Encrypted Asset
                        </div>
                        <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">Token <span className="text-[#CC1F1F]">Inspector</span></h2>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">You are viewing a high-security transit token issued for the Anbessa Pro network. This asset is synchronized with real-time fleet radar for boarding validation.</p>
                    </div>

                    <div className="p-6 bg-slate-900 rounded-[2rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute right-0 top-0 bottom-0 w-24 bg-white/5 skew-x-[-20deg] -mr-12"></div>
                        <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">Boarding Integrity</p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                <span className="text-xs font-bold text-white uppercase">Valid Asset</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Radio className="w-5 h-5 text-sky-400" />
                                <span className="text-xs font-bold text-white uppercase">Radar Linked</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center Column: The Cinematic Ticket */}
                <div className="lg:col-span-4 flex justify-center w-full">
                    <div className="w-full max-w-sm space-y-6">
                        {/* THE ICON MODE SWITCHER (Restored) */}
                        <div className="bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200 flex items-center shadow-inner">
                            {[
                                { id: "qr", label: "QR Code", icon: QrCode },
                                { id: "nfc", label: "NFC Tap", icon: Radio },
                                { id: "manual", label: "Manual", icon: Type },
                            ].map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => setMode(m.id as any)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 relative ${
                                        mode === m.id ? "text-white" : "text-slate-400 hover:text-slate-600"
                                    }`}
                                >
                                    {mode === m.id && (
                                        <motion.div 
                                            layoutId="ticket-mode-pill"
                                            className="absolute inset-0 bg-[#CC1F1F] rounded-xl shadow-lg shadow-red-500/20"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <m.icon className={`w-4 h-4 relative z-10 ${mode === m.id ? "text-white" : ""}`} />
                                    <span className="text-[9px] font-black uppercase tracking-widest relative z-10 hidden sm:block">{m.label}</span>
                                </button>
                            ))}
                        </div>

                        <Card className="w-full text-center overflow-hidden border-0 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] bg-white rounded-[3rem] relative ring-1 ring-slate-100">
                            <div className="relative py-6 px-6" style={{ backgroundColor: "#CC1F1F" }}>
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.1]"></div>
                                <div className="relative z-10 flex flex-col items-center gap-2 text-white">
                                    <div className="p-3 bg-[#FFD600] rounded-2xl shadow-2xl scale-110">
                                        <Bus className="w-7 h-7 text-[#CC1F1F]" strokeWidth={3} />
                                    </div>
                                    <span className="text-[#FFD600] font-black uppercase tracking-[0.3em] text-[10px] italic shadow-sm">Verified Operational Asset</span>
                                </div>
                            </div>

                            <CardContent className="pt-6 pb-4 px-6 relative">
                                <div className="relative z-10 space-y-1 mb-4">
                                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400">Authenticated Operational Path</p>
                                    <h3 className="text-2xl font-black tracking-tight uppercase text-slate-900 leading-tight">
                                        {focusedTicket.route}
                                    </h3>
                                </div>

                                <AnimatePresence mode="wait">
                                    {mode === "qr" && (
                                        <motion.div key="qr" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="my-4 flex justify-center relative h-36">
                                            <div className="absolute inset-0 rounded-[3rem] blur-3xl opacity-15" style={{ backgroundColor: "#FFD600" }}></div>
                                            <div className="p-4 bg-white rounded-[2rem] shadow-2xl border-4 border-slate-50 relative z-10 w-36 h-36 flex items-center justify-center">
                                                <QrCode className="w-full h-full text-slate-900" strokeWidth={0.8} />
                                            </div>
                                        </motion.div>
                                    )}
                                    {mode === "nfc" && (
                                        <motion.div key="nfc" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="my-4 flex flex-col items-center justify-center h-36">
                                            <div className="relative w-28 h-28 flex items-center justify-center">
                                                <motion.div animate={{ scale: [1, 1.5], opacity: [0.3, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-[#CC1F1F] rounded-full" />
                                                <div className="w-20 h-20 bg-white rounded-full shadow-2xl flex items-center justify-center relative z-10">
                                                    <Fingerprint className="w-10 h-10 text-[#CC1F1F]" strokeWidth={1.2} />
                                                </div>
                                            </div>
                                            <p className="mt-3 text-[9px] font-black uppercase text-[#CC1F1F] tracking-[0.4em] animate-pulse">TAP NEAR READER</p>
                                        </motion.div>
                                    )}
                                    {mode === "manual" && (
                                        <motion.div key="manual" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="my-4 flex flex-col items-center justify-center h-36 px-6">
                                            <div className="w-full p-4 bg-slate-900 rounded-3xl shadow-2xl text-center">
                                                <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.25em] mb-2 block">Security Token Code</span>
                                                <h3 className="text-3xl font-black text-[#FFD600] tracking-[0.15em]">{focusedTicket.securityCode}</h3>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="relative h-px w-full my-5 border-t-2 border-dashed border-slate-100"></div>

                                <div className="grid grid-cols-2 gap-y-5">
                                    <div className="text-left">
                                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Targa / Plate</p>
                                        <p className="font-black text-slate-900 uppercase text-sm">{focusedTicket.plateNumber}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Pass Status</p>
                                        <p className="font-black text-emerald-600 uppercase text-sm">{focusedTicket.status}</p>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Operator ID</p>
                                        <p className="font-black text-slate-700 uppercase text-xs truncate">{focusedTicket.driverName.replace('Driver: ', '')}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Price Point</p>
                                        <p className="font-black text-[#CC1F1F] text-sm">{focusedTicket.price} ETB</p>
                                    </div>
                                </div>
                            </CardContent>
                            <div className="bg-slate-900 py-4 flex items-center justify-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
                                <span className="text-white font-black uppercase tracking-[0.3em] text-[9px]">Active Boarding Asset</span>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Right Column: Actions & Details (Desktop Only) */}
                <div className="hidden lg:block lg:col-span-4 space-y-6 pt-12">
                   <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl space-y-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#CC1F1F]">Asset Actions</p>
                        <Button className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-[10px]">
                            <Share2 className="w-5 h-5 mr-3" /> Share Token
                        </Button>
                        <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-200 font-black uppercase tracking-widest text-[10px]">
                            Download Image
                        </Button>
                   </div>
                   <div className="p-8 bg-white/50 rounded-[2.5rem] border border-slate-100 border-dashed space-y-4">
                        <div className="flex items-start gap-4">
                            <Info className="w-5 h-5 text-slate-400 mt-0.5" />
                            <div>
                                <p className="text-xs font-black uppercase text-slate-900">Security Notice</p>
                                <p className="text-[11px] font-medium text-slate-500 leading-relaxed mt-1">This token is single-use and will be automatically archived upon successful boarding validation.</p>
                            </div>
                        </div>
                   </div>
                </div>
            </div>
        </div>
      </div>
    );
  }

  // --- MANAGED DASHBOARD VIEW ---
  return (
    <div className="max-w-7xl mx-auto w-full px-6 pt-12 pb-32 flex-1 animate-in fade-in duration-700">
      <div className="space-y-16">
        
        {/* DASHBOARD HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <div className="space-y-3">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-[#CC1F1F0D] rounded-full text-[#CC1F1F] text-[10px] font-black uppercase tracking-[0.2em]">
                   <ShieldCheck className="w-3.5 h-3.5" /> Anbessa Pro · Authorized Network Pass
                </div>
                <h1 className="text-5xl lg:text-8xl font-black tracking-tighter text-slate-900 uppercase leading-none">
                    Asset <span className="text-[#CC1F1F]">Management</span>
                </h1>
                <div className="w-32 h-2.5 bg-[#FFD600] rounded-full"></div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6">
                <Button 
                    onClick={handleQuickBoard}
                    className="bg-slate-900 hover:bg-slate-800 text-white rounded-[2rem] h-20 px-8 font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl flex items-center gap-4 transition-transform hover:scale-105 active:scale-95"
                >
                    <div className="p-3 bg-[#CC1F1F] rounded-xl">
                        <Zap className="w-5 h-5 text-[#FFD600]" />
                    </div>
                    <span>Boarding Ready / Tap Go</span>
                </Button>

                <div className="px-8 py-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] flex items-center gap-6 group">
                    <div className="p-4 bg-slate-50 rounded-2xl text-[#CC1F1F]">
                        <CreditCard className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Managed Balance</p>
                        <p className="text-3xl font-black text-slate-900 tracking-tighter">{balance.toFixed(2)} <span className="text-sm font-black text-[#CC1F1F] uppercase ml-1">ETB</span></p>
                    </div>
                </div>
            </div>
        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
                { label: "Active Tokens", value: tickets.filter(t => t.status === "Active").length, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50/50" },
                { label: "Used History", value: tickets.filter(t => t.status === "Used").length, icon: Clock, color: "text-slate-400", bg: "bg-slate-50/50" },
                { label: "Account Rank", value: "Silver Tier", icon: ShieldCheck, color: "text-sky-500", bg: "bg-sky-50/50" },
                { label: "Fleet Sync", value: "Live", icon: Radio, color: "text-[#CC1F1F]", bg: "bg-red-50/50" },
            ].map((stat, i) => (
                <motion.div 
                    key={i} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-sm flex items-center gap-6 hover:shadow-lg transition-shadow"
                >
                    <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                        <stat.icon className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] mb-1">{stat.label}</p>
                        <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                    </div>
                </motion.div>
            ))}
        </div>

        {/* ASSET LIST (MANAGED) */}
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-slate-900 rounded-xl">
                        <Layers className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-black uppercase text-slate-900 tracking-widest">Boarding Tokens & Operational Assets</h2>
                </div>
                <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Secure Cloud Sync Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tickets.map((ticket, i) => (
                    <motion.div
                        key={ticket.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -5 }}
                        onClick={() => setFocusedTicketId(ticket.id)}
                        className={`group cursor-pointer bg-white rounded-[2.5rem] border transition-all duration-500 overflow-hidden shadow-[0_10px_40px_-20px_rgba(0,0,0,0.1)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] ${
                            ticket.status === "Active" ? "border-slate-50 hover:border-[#CC1F1F1A]" : "border-slate-50 opacity-60 hover:opacity-100"
                        }`}
                    >
                        {/* MINI TOKEN HEADER */}
                        <div className={`relative px-6 py-4 flex items-center justify-between overflow-hidden transition-colors ${ticket.status === "Active" ? "bg-[#CC1F1F]" : "bg-slate-400"}`}>
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.1]"></div>
                            <div className="relative z-10 flex items-center gap-2">
                                <Bus className="w-3.5 h-3.5 text-[#FFD600]" strokeWidth={3} />
                                <span className="text-[8px] font-black uppercase text-white tracking-widest">{ticket.status === "Active" ? "Verified Asset" : "Archived Asset"}</span>
                            </div>
                            <div className="relative z-10 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                        </div>

                        <div className="p-8 flex flex-col h-full bg-gradient-to-b from-white to-slate-50/20">
                            <div className="flex-1 space-y-4">
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Operational Path</p>
                                    <h3 className="text-lg font-black text-slate-900 leading-tight uppercase group-hover:text-[#CC1F1F] transition-colors line-clamp-1">
                                        {ticket.route}
                                    </h3>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 group-hover:border-[#CC1F1F1A]">
                                         <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">Targa / Plate</p>
                                         <p className="text-[10px] font-black text-slate-900 uppercase">{ticket.plateNumber}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 group-hover:border-[#CC1F1F1A]">
                                         <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">Asset Value</p>
                                         <p className="text-[10px] font-black text-slate-900 uppercase">{ticket.price} ETB</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-dashed border-slate-100 flex items-center justify-between gap-4">
                                <div className="flex flex-col">
                                    <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Security Token</span>
                                    <span className="text-[10px] font-black text-slate-700 uppercase">{ticket.securityCode}</span>
                                </div>
                                <Button size="sm" className="bg-slate-900 text-white hover:bg-[#CC1F1F] rounded-xl text-[8px] font-black uppercase tracking-widest px-6 h-10 shadow-xl transition-all active:scale-95">
                                    Launch Inspector
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>

        {/* BOTTOM HUD / ACTIONS */}
        <div className="bg-slate-900 p-12 lg:p-20 rounded-[4rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-24 opacity-10 group-hover:opacity-20 transition-opacity">
                <Radio className="w-64 h-64 text-white animate-pulse" />
            </div>
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                <div className="space-y-6">
                    <div className="w-16 h-2 bg-[#FFD600] rounded-full"></div>
                    <h3 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter leading-tight">Unified Digital <br /><span className="text-[#FFD600]">Transit Assets</span></h3>
                    <p className="text-slate-400 text-sm font-medium max-w-sm leading-relaxed">All Anbessa Pro assets are cryptographically signed and synchronized with the central fleet radar for immediate validation across the network hubs.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-6">
                    <Button variant="outline" className="border-slate-800 text-white hover:bg-white hover:text-slate-900 rounded-[2rem] h-20 px-12 font-black uppercase tracking-widest text-xs transition-all">
                        <Share2 className="w-5 h-5 mr-3" /> Share Token
                    </Button>
                    <Link href="/admin">
                        <Button className="bg-[#FFD600] text-slate-950 hover:bg-white rounded-[2rem] h-20 px-12 font-black uppercase tracking-widest text-xs shadow-2xl transition-all">
                            Fleet Dashboard <ChevronRight className="w-5 h-5 ml-3" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
