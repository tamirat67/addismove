"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LiveMap } from "@/components/LiveMap";
import { LeafletMap } from "@/components/LeafletMap";
import Link from "next/link";
import { ArrowRight, Bus, Clock, MapPin, Info, Search, Map as MapIcon, ChevronRight } from "lucide-react";
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
      {/* 1. HERO SECTION (ORIGINAL FULL-WIDTH STYLE) */}
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
            <p className="text-[#FFD600] font-black uppercase tracking-[0.3em] text-[10px] lg:text-xs mb-2 drop-shadow-lg">
              One App · Bus Rapid · Smart Travel
            </p>
            <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tighter leading-none uppercase drop-shadow-2xl">
              Home <span style={{ color: "#FFD600" }}>Dashboard</span>
            </h1>
          </motion.div>

          {/* SMART BOOKING CARD (TRUE TRANSPARENT GLASS) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-3xl px-2"
          >
            <div 
                className="backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden relative"
                style={{ WebkitBackdropFilter: "blur(24px)" }}
            >
              {/* Subtle top reflection */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              
              {/* HEADER */}
              <div className="px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between border-b border-white/5 gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#e53e3e] rounded-xl flex items-center justify-center shadow-md">
                        <Bus className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-black uppercase tracking-[0.15em] text-sm drop-shadow-md">Anbessa Pro</span>
                </div>
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md shadow-inner">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></div>
                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Live Status:</span>
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest drop-shadow-sm">Normal Operations</span>
                </div>
              </div>

              {/* CARD BODY (INPUTS & CTA) */}
              <div className="p-6 lg:p-10 space-y-6 relative">
                 <div className="relative space-y-6 w-full">
                    
                    {/* The Connecting Vertical Line */}
                    <div className="absolute left-[29px] top-[30px] bottom-[30px] w-[2px] bg-white/10 z-0"></div>

                    {/* FROM INPUT */}
                    <div className="relative z-10 w-full group">
                        <div className="absolute left-[24px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-[2.5px] border-white/60 bg-transparent shadow-sm"></div>
                        <Input
                          placeholder="From: Departure Station"
                          value={from}
                          onChange={(e) => handleFromChange(e.target.value)}
                          className="pl-16 h-16 w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 focus-visible:ring-1 focus-visible:ring-white/30 rounded-2xl text-white text-base font-bold placeholder:text-white/40 transition-all shadow-sm focus-visible:border-white/30"
                        />
                        <AnimatePresence>
                          {fromSuggestions.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute z-20 w-full mt-2 bg-[#1A1A1A]/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                              {fromSuggestions.map(s => (
                                <button key={s} onClick={() => {setFrom(s); setFromSuggestions([]);}} className="w-full text-left px-5 py-4 text-white hover:bg-white/10 font-bold text-sm transition-colors border-b border-white/5 last:border-0 flex items-center gap-3">
                                    <MapPin className="w-4 h-4 text-white/50" /> {s}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                    </div>

                    {/* TO INPUT */}
                    <div className="relative z-10 w-full group">
                        <div className="absolute left-[24px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white/40 shadow-sm"></div>
                        <Input
                          placeholder="To: Destination Station"
                          value={to}
                          onChange={(e) => handleToChange(e.target.value)}
                          className="pl-16 h-16 w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 focus-visible:ring-1 focus-visible:ring-white/30 rounded-2xl text-white text-base font-bold placeholder:text-white/40 transition-all shadow-sm focus-visible:border-white/30"
                        />
                        <AnimatePresence>
                          {toSuggestions.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute z-20 w-full mt-2 bg-[#1A1A1A]/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                              {toSuggestions.map(s => (
                                <button key={s} onClick={() => {setTo(s); setToSuggestions([]);}} className="w-full text-left px-5 py-4 text-white hover:bg-white/10 font-bold text-sm transition-colors border-b border-white/5 last:border-0 flex items-center gap-3">
                                    <MapPin className="w-4 h-4 text-white/50" /> {s}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                    </div>

                 </div>

                {/* SEARCH BUTTON */}
                <Link href="/results" className="block pt-2">
                  <Button
                    className="w-full h-16 rounded-2xl bg-[#a02e2e]/90 hover:bg-[#a02e2e] text-white font-black text-lg tracking-widest uppercase transition-all shadow-lg border border-white/10 flex items-center justify-center gap-3"
                  >
                    <Search className="w-5 h-5" /> Search Routes
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. LIVE NETWORK (FIRST SECTION DIRECTLY BELOW HERO) */}
      <section className="bg-white w-full py-20 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          <div className="flex flex-col md:flex-row items-end justify-between gap-4">
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

          <div className="h-[640px] w-full relative group shadow-2xl rounded-[3rem] overflow-hidden border border-slate-200 bg-slate-50">
              <LeafletMap height="640px" />
              <div className="absolute top-8 right-8 p-6 bg-white/95 backdrop-blur-xl shadow-2xl rounded-[2rem] z-[500] border border-white/20">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#CC1F1F]">System Active</span>
                    </div>
                    <div className="flex items-end justify-between gap-8">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Fleet Count</span>
                            <span className="text-2xl font-black text-slate-900 tracking-tighter">112</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Efficiency</span>
                            <span className="text-2xl font-black text-emerald-600 tracking-tighter">94.2%</span>
                        </div>
                    </div>
                  </div>
              </div>
          </div>
        </div>
      </section>

      {/* 3. OPERATIONAL ASSETS (RESOURCES AT THE BOTTOM / FOOTER AREA) */}
      <section className="bg-slate-50 w-full py-24 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-10">
            
            {/* ROUTE DIRECTORY (ORIGINAL STYLE) */}
            <Link href="/routes" className="lg:col-span-5 h-full group order-1">
              <Card className="h-full border-0 bg-white hover:border-[#CC1F1F]/20 transition-all rounded-[2.5rem] p-10 shadow-sm hover:shadow-xl flex flex-col justify-between">
                <div className="flex flex-col gap-8">
                  <div className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl" style={{ backgroundColor: "#CC1F1F" }}>
                    <Info className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black uppercase tracking-tighter text-slate-900 leading-tight">Route <br />Directory</h4>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-3">Explore 115+ Active Routes Since 1945</p>
                  </div>
                </div>
                <div className="flex items-center text-[11px] font-black uppercase text-[#CC1F1F] tracking-[0.2em] group-hover:translate-x-2 transition-transform mt-12">
                  View full list <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              </Card>
            </Link>

            {/* ANBESSA BUS PASSES (ORIGINAL STYLE) */}
            <Card className="border-0 bg-white rounded-[3rem] p-10 lg:p-12 shadow-sm lg:col-span-7 flex flex-col items-start gap-8 h-full order-2">
              <div className="space-y-4">
                <h4 className="text-3xl font-black uppercase tracking-tighter text-slate-900 leading-tight">Anbessa <br /><span style={{ color: "#CC1F1F" }}>Bus Passes</span></h4>
                <p className="text-base text-slate-500 font-medium leading-relaxed max-w-sm">Smart passes for frequent riders. Save up to 30% on your daily commute.</p>
              </div>
              <div className="grid grid-cols-3 gap-4 w-full">
                  {["Daily", "Weekly", "Monthly"].map(p => (
                      <div key={p} className="flex-1 text-center p-6 rounded-[1.5rem] border-2 border-slate-50 hover:border-[#FFD600] transition-all cursor-pointer group bg-slate-50 shadow-sm hover:shadow-lg">
                          <span className="block text-[10px] font-black uppercase text-slate-400 mb-2 group-hover:text-[#CC1F1F] tracking-widest">{p}</span>
                          <span className="block font-black text-slate-800 text-lg tracking-tighter">Pass</span>
                      </div>
                  ))}
              </div>
            </Card>

          </div>
        </div>
      </section>
    </div>
  );
}
