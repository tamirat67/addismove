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
      {/* 1. HERO SECTION */}
      <section className="relative h-[85vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax-light effect */}
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="/hero.png" 
            alt="Anbessa Bus" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-slate-950/90" />
        </motion.div>

        {/* Content Container */}
        <div className="relative z-10 max-w-6xl mx-auto w-full px-4 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            <p className="text-[#FFD600] font-black uppercase tracking-[0.3em] text-[10px] lg:text-xs mb-3">
              One App · Bus Rapid · Smart Travel
            </p>
            <h1 className="text-4xl lg:text-7xl font-black text-white tracking-tighter leading-none uppercase">
              Home <span style={{ color: "#FFD600" }}>Dashboard</span>
            </h1>
          </motion.div>

          {/* SMART BOOKING CARD */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="w-full max-w-2xl"
          >
            <Card className="bg-white/10 backdrop-blur-2xl border-white/20 shadow-2xl rounded-[2.5rem] overflow-hidden">
              <CardContent className="p-6 lg:p-10 space-y-6">
                <div className="space-y-4 relative">
                  <div className="absolute left-[1.35rem] top-10 bottom-10 w-0.5 bg-white/10 rounded-full z-0"></div>

                  {/* FROM INPUT */}
                  <div className="relative z-10 group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white/50 bg-white group-focus-within:border-[#FFD600] transition-colors shadow-sm"></div>
                    <Input
                      placeholder="From: Departure Station"
                      value={from}
                      onChange={(e) => handleFromChange(e.target.value)}
                      className="pl-12 h-16 bg-white/5 border-white/10 focus-visible:ring-2 focus-visible:ring-[#FFD600]/30 rounded-2xl text-white text-lg font-bold placeholder:text-white/40 transition-all focus-visible:bg-white/10 border-2"
                    />
                    <AnimatePresence>
                      {fromSuggestions.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute z-20 w-full mt-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                          {fromSuggestions.map(s => (
                            <button key={s} onClick={() => {setFrom(s); setFromSuggestions([]);}} className="w-full text-left px-5 py-3 text-white hover:bg-[#CC1F1F] font-bold text-sm transition-colors border-b border-white/5 last:border-0">{s}</button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* TO INPUT */}
                  <div className="relative z-10 group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-sm group-focus-within:bg-[#CC1F1F] bg-white transition-colors shadow-sm"></div>
                    <Input
                      placeholder="To: Destination Station"
                      value={to}
                      onChange={(e) => handleToChange(e.target.value)}
                      className="pl-12 h-16 bg-white/5 border-white/10 focus-visible:ring-2 focus-visible:ring-[#CC1F1F]/20 rounded-2xl text-white text-lg font-bold placeholder:text-white/40 transition-all focus-visible:bg-white/10 border-2"
                    />
                    <AnimatePresence>
                      {toSuggestions.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute z-20 w-full mt-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                          {toSuggestions.map(s => (
                            <button key={s} onClick={() => {setTo(s); setToSuggestions([]);}} className="w-full text-left px-5 py-3 text-white hover:bg-[#CC1F1F] font-bold text-sm transition-colors border-b border-white/5 last:border-0">{s}</button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <Link href="/results" className="block">
                  <Button
                    className="w-full text-white shadow-xl text-sm lg:text-base font-black uppercase tracking-widest h-16 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 hover:opacity-90"
                    style={{ backgroundColor: "#CC1F1F" }}
                  >
                    <Search className="w-6 h-6" /> Search Routes
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* 2. SECONDARY CONTENT SECTION */}
      <section className="bg-slate-50 w-full py-20 px-4">
        <div className="max-w-6xl mx-auto space-y-24">
          
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

          {/* INTERACTIVE MAP SECTION */}
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl lg:text-4xl font-black tracking-tighter uppercase text-slate-900">
                        Live <span style={{ color: "#CC1F1F" }}>Network</span>
                    </h2>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Real-Time Fleet Visualization</p>
                </div>
                <Button variant="outline" className="rounded-xl border-slate-200 font-black text-[10px] uppercase tracking-widest px-6 h-12 flex items-center gap-2">
                    <MapIcon className="w-4 h-4" /> Expand View
                </Button>
            </div>

            <div className="h-[500px] w-full rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white relative group">
                <LiveMap />
                <div className="absolute top-6 left-6 p-4 bg-white/95 backdrop-blur shadow-xl border border-white rounded-2xl z-20">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-800">92% Fleet Operational</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
