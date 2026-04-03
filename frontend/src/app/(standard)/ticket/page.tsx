"use client";

import { useTenant } from "@/context/TenantContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, ArrowLeft, RefreshCw, Bus, Radio, Type, ShieldCheck, Fingerprint } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Ticket() {
  const { tickets } = useTenant();
  const latestTicket = tickets[0];
  const [mode, setMode] = useState<"qr" | "nfc" | "manual">("qr");

  if (!latestTicket) {
    return (
      <div className="py-24 text-center space-y-6 max-w-sm mx-auto px-6">
        <div className="p-8 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <QrCode className="w-16 h-16 text-slate-200 mx-auto mb-4" strokeWidth={1} />
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em]">No Active Digital Assets</p>
        </div>
        <Link href="/" className="block">
          <Button className="w-full bg-[#CC1F1F] text-white font-black uppercase tracking-widest h-14 rounded-2xl shadow-xl">Search Routes</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full px-4 pt-10 lg:pt-16 pb-32 lg:pb-20 flex-1 animate-in fade-in duration-700">
      <div className="max-w-md mx-auto w-full space-y-8">
        
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-8">
          <p className="text-[#CC1F1F] font-black uppercase tracking-[0.3em] text-[10px] lg:text-xs mb-3">
            Anbessa Pro · Authorized Pass
          </p>
          <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-slate-900 uppercase leading-none">
            Digital <span style={{ color: "#CC1F1F" }}>Token</span>
          </h2>
          <div className="w-12 h-1 bg-[#FFD600] rounded-full mt-4"></div>
        </div>

        {/* MODE SWITCHER */}
        <div className="bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200 flex items-center shadow-sm">
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

        <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
        >
          {/* THE CINEMATIC TICKET OBJECT */}
          <Card className="text-center overflow-hidden border-0 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.15)] bg-white max-w-sm mx-auto relative group rounded-[2.5rem]">
            
            {/* Anbessa Pro Livery Header */}
            <div className="relative py-8 px-6 overflow-hidden" style={{ backgroundColor: "#CC1F1F" }}>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.1] pointer-events-none"></div>
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                
                <div className="relative z-10 flex flex-col items-center gap-2 text-white">
                    <div className="p-2 bg-[#FFD600] rounded-xl shadow-lg border border-white/20">
                        <Bus className="w-6 h-6 text-[#CC1F1F]" strokeWidth={3} />
                    </div>
                    <span className="text-[#FFD600] font-black uppercase tracking-[0.2em] text-[9px] mt-1 italic">Verified Rapid Transit Asset</span>
                </div>
            </div>

            <CardContent className="pt-10 pb-8 px-8 relative">
              {/* Security Pattern Background */}
              <div className="absolute inset-0 bg-[linear-gradient(45deg,#CC1F1F05_25%,transparent_25%),linear-gradient(-45deg,#CC1F1F05_25%,transparent_25%)] bg-[length:20px_20px] opacity-50 pointer-events-none"></div>

              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Authenticated Route</p>
                <h3 className="text-2xl font-black tracking-tighter uppercase text-slate-900 leading-tight">
                  {latestTicket.route}
                </h3>
                
                <AnimatePresence mode="wait">
                    {/* MODE 1: QR CODE */}
                    {mode === "qr" && (
                        <motion.div 
                            key="qr"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="my-10 flex justify-center relative h-56"
                        >
                            <div className="absolute inset-0 rounded-[2.5rem] blur-3xl opacity-20 animate-pulse" style={{ backgroundColor: "#FFD600" }}></div>
                            <div className="p-6 bg-white rounded-[2.5rem] shadow-2xl border-4 border-slate-50 relative z-10 w-56 h-56 flex items-center justify-center">
                                <QrCode className="w-full h-full text-slate-900" strokeWidth={1} />
                                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
                                    <span className="text-[8px] font-black uppercase text-emerald-600 tracking-tighter">Live Auth</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* MODE 2: NFC TAP */}
                    {mode === "nfc" && (
                        <motion.div 
                            key="nfc"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="my-10 flex flex-col items-center justify-center relative h-56"
                        >
                            <div className="relative w-48 h-48 flex items-center justify-center">
                                <motion.div 
                                    animate={{ scale: [1, 1.4], opacity: [0.3, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute inset-0 bg-[#CC1F1F] rounded-full"
                                />
                                <motion.div 
                                    animate={{ scale: [1, 1.2], opacity: [0.5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                    className="absolute inset-4 bg-[#FFD600] rounded-full"
                                />
                                <div className="w-32 h-32 bg-white rounded-full shadow-2xl border-4 border-slate-50 flex items-center justify-center relative z-10">
                                    <Fingerprint className="w-16 h-16 text-[#CC1F1F]" strokeWidth={1.5} />
                                </div>
                            </div>
                            <p className="mt-6 text-[10px] font-black uppercase text-[#CC1F1F] tracking-[0.3em] animate-pulse">TAP NEAR READER</p>
                            <div className="mt-2 text-[8px] font-bold text-slate-400 uppercase tracking-widest">{latestTicket.nfcId}</div>
                        </motion.div>
                    )}

                    {/* MODE 3: MANUAL PASS */}
                    {mode === "manual" && (
                        <motion.div 
                            key="manual"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="my-10 flex flex-col items-center justify-center relative h-56 px-6"
                        >
                             <div className="w-full space-y-4">
                                <div className="p-6 bg-slate-900 rounded-3xl shadow-2xl relative overflow-hidden">
                                     <div className="absolute right-0 top-0 bottom-0 w-24 bg-white/5 skew-x-[-20deg] -mr-12"></div>
                                     <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 block">Security Token Code</span>
                                     <h3 className="text-4xl font-black text-[#FFD600] tracking-[0.15em] flex justify-between">
                                        {latestTicket.securityCode}
                                     </h3>
                                </div>
                                <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 flex items-center gap-3">
                                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                                    <p className="text-[8px] font-bold text-amber-800 uppercase tracking-tight text-left">Manual verification pass for single-use boarding.</p>
                                </div>
                             </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* PERFORATED LINE (TEAR OFF) */}
                <div className="relative h-px w-full my-8">
                    <div className="absolute inset-0 border-t-4 border-dashed border-slate-100"></div>
                    {/* Circle Cutouts */}
                    <div className="absolute -left-[3.25rem] -top-5 w-10 h-10 bg-slate-50 rounded-full border-r-2 border-slate-100 shadow-inner"></div>
                    <div className="absolute -right-[3.25rem] -top-5 w-10 h-10 bg-slate-50 rounded-full border-l-2 border-slate-100 shadow-inner"></div>
                </div>

                {/* TICKET DETAILS (CLEAN & SMART) */}
                <div className="grid grid-cols-2 gap-y-6 pt-2">
                  <div className="text-left">
                    <span className="text-slate-400 font-black uppercase text-[9px] tracking-widest block mb-1">Pass Identity</span>
                    <span className="font-black text-slate-900 uppercase text-xs">Anbessa Pro</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 font-black uppercase text-[9px] tracking-widest block mb-1">Status Code</span>
                    <span className="font-black text-emerald-600 uppercase text-xs">{latestTicket.status}</span>
                  </div>
                  <div className="text-left col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-black uppercase text-[8px] tracking-widest block mb-1">Unique Token Identifier</span>
                    <span className="font-mono text-slate-900 text-[11px] font-black tracking-[0.1em]">
                      {latestTicket.id}
                    </span>
                  </div>
                </div>

                <div className="mt-8 pt-6">
                    <div className="flex items-center justify-between">
                        <div className="text-left">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Valid Until</p>
                            <p className="text-sm font-black text-slate-900 tracking-tight">{latestTicket.expiry}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Price Paid</p>
                            <p className="text-sm font-black text-[#CC1F1F] tracking-tight">{latestTicket.price.toFixed(2)} ETB</p>
                        </div>
                    </div>
                </div>
              </div>
            </CardContent>

            {/* Bottom Branding Footer */}
            <div className="bg-slate-900 py-5 flex items-center justify-center gap-3">
                <Bus className="w-4 h-4 text-[#FFD600]" />
                <span className="text-white font-black uppercase tracking-[0.25em] text-[8px]">Scan, Tap or Share Code to board</span>
            </div>
          </Card>
        </motion.div>

        {/* SECURITY REFRESH */}
        <div className="text-center group">
            <div className="inline-flex items-center gap-4 px-6 py-4 bg-white rounded-2xl shadow-xl border border-slate-50 group-hover:border-[#CC1F1F]/20 transition-all">
                <RefreshCw className="w-4 h-4 text-[#CC1F1F] animate-spin-slow" />
                <div className="text-left">
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Security Refresh Active</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">T1 Token Synchronized with Cloud</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
