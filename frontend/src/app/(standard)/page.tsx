"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LiveMap } from "@/components/LiveMap";
import Link from "next/link";
import { ArrowRight, Bus, Clock, MapPin, Info, Search, Map as MapIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { anbessaRoutes } from "@/lib/routes";

export default function Home() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [toSuggestions, setToSuggestions] = useState<string[]>([]);

  const handleFromChange = (val: string) => {
    setFrom(val);
    if (val.length > 1) {
      const filtered = Array.from(new Set(anbessaRoutes
        .filter(r => r.start.toLowerCase().includes(val.toLowerCase()))
        .map(r => r.start))).slice(0, 5);
      setFromSuggestions(filtered);
    } else {
      setFromSuggestions([]);
    }
  };

  const handleToChange = (val: string) => {
    setTo(val);
    if (val.length > 1) {
      const filtered = Array.from(new Set(anbessaRoutes
        .filter(r => r.destination.toLowerCase().includes(val.toLowerCase()))
        .map(r => r.destination))).slice(0, 5);
      setToSuggestions(filtered);
    } else {
      setToSuggestions([]);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO SECTION (STANDARDIZED COMPACT & GLASS TRANSPARENCY) */}
      <section className="relative h-[480px] lg:h-[520px] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image - Cinematic & Clear */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero.png" 
            alt="Anbessa Bus" 
            className="w-full h-full object-cover"
          />
          {/* Subtle bottom vignette to lift the card slightly */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-6xl mx-auto w-full px-4 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6 lg:mb-8"
          >
            <p className="text-[#FFD600] font-black uppercase tracking-[0.3em] text-[9px] lg:text-xs mb-2 drop-shadow-lg">
              One App · Bus Rapid · Smart Travel
            </p>
            <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tighter leading-none uppercase drop-shadow-2xl">
              Home <span style={{ color: "#FFD600" }}>Dashboard</span>
            </h1>
          </motion.div>

          {/* SMART BOOKING CARD (SUBTLE GLASS / MINIMUM VISIBILITY) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-2xl px-2"
          >
            <div 
                className="backdrop-blur-md border border-white/20 rounded-[2.5rem] shadow-2xl overflow-hidden"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
            >
              {/* Branded Card Header (Subtle Tint) */}
              <div className="px-6 lg:px-8 py-3 lg:py-4 flex items-center justify-between border-b border-white/10" style={{ background: "rgba(255, 255, 255, 0.03)" }}>
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-[#CC1F1F]/60 rounded-lg border border-white/10 shadow-sm">
                        <Bus className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-black uppercase tracking-widest text-[9px] lg:text-xs drop-shadow-sm">Anbessa Pro</span>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-white/50 uppercase tracking-widest">
                    Live Status: <span className="text-emerald-400">Normal Operations</span>
                </div>
              </div>

              <div className="p-6 lg:p-10 space-y-6">
                <div className="space-y-4 relative">
                  <div className="absolute left-[1.35rem] top-10 bottom-10 w-0.5 bg-white/10 rounded-full z-0"></div>

                  {/* FROM INPUT (GLASS DEFINED) */}
                  <div className="relative z-10 group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white/40 bg-white/10 group-focus-within:border-[#FFD600] transition-colors shadow-sm"></div>
                    <Input
                      placeholder="From: Departure Station"
                      value={from}
                      onChange={(e) => handleFromChange(e.target.value)}
                      className="pl-12 h-16 !bg-transparent border-white/10 focus-visible:ring-1 focus-visible:ring-[#FFD600]/30 rounded-2xl text-white text-lg font-bold placeholder:text-white/40 transition-all border-2 backdrop-blur-none"
                    />
                    <AnimatePresence>
                      {fromSuggestions.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute z-20 w-full mt-2 bg-slate-900/95 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                          {fromSuggestions.map(s => (
                            <button key={s} onClick={() => {setFrom(s); setFromSuggestions([]);}} className="w-full text-left px-5 py-4 text-white hover:bg-[#CC1F1F]/60 font-bold text-sm transition-colors border-b border-white/5 last:border-0 flex items-center gap-3">
                                <MapPin className="w-4 h-4 text-[#FFD600]" /> {s}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* TO INPUT (GLASS DEFINED) */}
                  <div className="relative z-10 group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-sm group-focus-within:bg-[#CC1F1F] bg-white/20 transition-colors shadow-sm"></div>
                    <Input
                      placeholder="To: Destination Station"
                      value={to}
                      onChange={(e) => handleToChange(e.target.value)}
                      className="pl-12 h-16 !bg-transparent border-white/10 focus-visible:ring-1 focus-visible:ring-[#CC1F1F]/30 rounded-2xl text-white text-lg font-bold placeholder:text-white/40 transition-all border-2 backdrop-blur-none"
                    />
                    <AnimatePresence>
                      {toSuggestions.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute z-20 w-full mt-2 bg-slate-900/95 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                          {toSuggestions.map(s => (
                            <button key={s} onClick={() => {setTo(s); setToSuggestions([]);}} className="w-full text-left px-5 py-4 text-white hover:bg-[#CC1F1F]/60 font-bold text-sm transition-colors border-b border-white/5 last:border-0 flex items-center gap-3">
                                <MapPin className="w-4 h-4 text-[#FFD600]" /> {s}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <Link href="/results" className="block pt-2">
                  <Button
                    className="w-full text-white shadow-xl text-base font-black uppercase tracking-widest h-16 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 hover:opacity-90 border border-white/10"
                    style={{ backgroundColor: "rgba(204, 31, 31, 0.5)" }}
                  >
                    <Search className="w-6 h-6" /> Search Routes
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. SECONDARY CONTENT SECTION */}
      <section className="bg-slate-50 w-full py-20">
        <div className="max-w-6xl mx-auto px-4 space-y-24">
          {/* STATS & QUICK LINKS */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link href="/routes" className="group">
              <Card className="border-0 bg-white hover:border-[#CC1F1F]/20 transition-all rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl">
                <div className="flex flex-col gap-6">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: "#CC1F1F" }}>
                    <Info className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black uppercase tracking-tighter text-slate-800">Route Directory</h4>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Explore 115+ Active Routes Since 1945</p>
                  </div>
                  <div className="flex items-center text-[10px] font-black uppercase text-[#CC1F1F] tracking-widest group-hover:translate-x-1 transition-transform">
                    View list <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Card>
            </Link>

            <Card className="border-0 bg-white rounded-[2.5rem] p-8 shadow-sm lg:col-span-2">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 h-full">
                <div className="space-y-4">
                  <h4 className="text-xl font-black uppercase tracking-tighter text-slate-800">Anbessa Bus Passes</h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-sm">Smart passes for frequent riders. Save up to 30% on your daily commute.</p>
                </div>
                <div className="flex gap-4 w-full lg:w-auto">
                    {["Daily", "Weekly", "Monthly"].map(p => (
                        <div key={p} className="flex-1 lg:w-24 text-center p-4 rounded-2xl border-2 border-slate-50 hover:border-[#FFD600] transition-colors cursor-pointer group">
                            <span className="block text-[10px] font-black uppercase text-slate-400 mb-1 group-hover:text-[#CC1F1F]">{p}</span>
                            <span className="block font-black text-slate-800">Pass</span>
                        </div>
                    ))}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* FULL WIDTH INTERACTIVE MAP SECTION */}
        <div className="mt-24 space-y-8">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-end justify-between gap-4">
              <div>
                  <h2 className="text-3xl lg:text-4xl font-black tracking-tighter uppercase text-slate-900">
                      Live <span style={{ color: "#CC1F1F" }}>Network</span>
                  </h2>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Real-Time Fleet Visualization</p>
              </div>
              <Link href="/admin">
                <Button variant="outline" className="rounded-xl border-slate-200 font-black text-[10px] uppercase tracking-widest px-6 h-12 flex items-center gap-2">
                    <MapIcon className="w-4 h-4" /> Go to Operations
                </Button>
              </Link>
          </div>

          <div className="h-[640px] w-full relative group shadow-2xl rounded-3xl overflow-hidden border border-slate-200">
              <LiveMap />
              {/* Floating Anbessa Pro Status Card (Top Right to avoid Title Overlap) */}
              <div className="absolute top-4 right-4 md:top-8 md:right-8 p-6 bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[2rem] z-10 border border-white/20 max-w-[280px] animate-in slide-in-from-right-4 duration-1000">
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#CC1F1F]">Anbessa Pro Live</span>
                        </div>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100 italic">v.2.4</span>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 group-hover:border-[#FFD600]/30 transition-all">
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Fleet Operations</span>
                                <div className="flex items-end justify-between">
                                    <span className="text-2xl font-black text-slate-900 tracking-tighter">112</span>
                                    <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-tighter">On-Track</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 group-hover:border-[#CC1F1F]/20 transition-all">
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">System Efficiency</span>
                                <div className="flex items-end justify-between">
                                    <span className="text-2xl font-black text-slate-900 tracking-tighter">94.2%</span>
                                    <span className="text-[9px] font-black text-[#CC1F1F] bg-rose-50 px-2 py-1 rounded-lg uppercase tracking-tighter">+2.4%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button className="w-full bg-slate-900 py-3 rounded-xl text-[9px] font-black text-white uppercase tracking-[0.2em] transition-all hover:bg-black active:scale-95 shadow-lg">
                            Analyze All Units
                        </button>
                    </div>
                  </div>
              </div>
          </div>
        </div>
      </section>
    </div>
  );
}
