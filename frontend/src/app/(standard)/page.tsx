"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LiveMap } from "@/components/LiveMap";
import Link from "next/link";
import { ArrowRight, Bus, Clock, MapPin, Info } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 w-full animate-in slide-in-from-bottom-4 duration-500 fade-in pb-12 lg:pb-0">

      {/* Left Column: Smart Interface */}
      <div className="space-y-8 flex flex-col justify-center min-h-[calc(100vh-140px)]">
        <div className="pt-4 lg:pt-0">
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black tracking-tighter text-slate-900 leading-[1.1]">
            Ride Addis <br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg, #CC1F1F, #FFD600)" }}>
              Smarter &amp; Faster.
            </span>
          </h1>
          <p className="text-xs lg:text-sm font-bold text-slate-400 uppercase tracking-widest mt-4 ml-1">
            Anbessa Bus · Addis Ababa City Transit
          </p>
        </div>

        <Tabs defaultValue="route" className="w-full">
          <TabsList className="bg-white border border-slate-100 shadow-sm p-1.5 rounded-2xl w-full justify-start h-auto gap-2 mb-6">
            <TabsTrigger
              value="route"
              className="rounded-xl px-6 py-3 data-[state=active]:bg-[#CC1F1F] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all text-[11px] font-black uppercase tracking-widest text-slate-500 flex-1 lg:flex-none"
            >
              Plan Journey
            </TabsTrigger>
            <TabsTrigger
              value="passes"
              className="rounded-xl px-6 py-3 data-[state=active]:bg-[#CC1F1F] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all text-[11px] font-black uppercase tracking-widest text-slate-500 flex-1 lg:flex-none"
            >
              Bus Passes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="route" className="space-y-6 outline-none">
            <Card className="border-0 shadow-2xl shadow-red-900/10 bg-white overflow-hidden rounded-[2.5rem] relative">
              <CardContent className="p-6 lg:p-8 space-y-6">
                <div className="relative space-y-1 z-10">
                  <div className="absolute left-[1.35rem] top-10 bottom-10 w-0.5 bg-slate-100 rounded-full z-0"></div>

                  <div className="relative z-10 group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-slate-300 bg-white group-focus-within:border-[#FFD600] transition-colors shadow-sm"></div>
                    <Input
                      placeholder="From: e.g. Megenagna"
                      className="pl-12 h-14 bg-slate-50/80 border border-slate-100 focus-visible:ring-2 focus-visible:border-transparent focus-visible:ring-[#FFD600]/30 rounded-2xl text-sm font-bold placeholder:text-slate-400 transition-all focus-visible:bg-white"
                    />
                  </div>

                  <div className="relative z-10 group pt-2">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-sm group-focus-within:bg-[#CC1F1F] bg-slate-800 transition-colors shadow-sm"></div>
                    <Input
                      placeholder="To: e.g. Piassa"
                      className="pl-12 h-14 bg-slate-50/80 border border-slate-100 focus-visible:ring-2 focus-visible:border-transparent focus-visible:ring-[#CC1F1F]/20 rounded-2xl text-sm font-bold placeholder:text-slate-400 transition-all focus-visible:bg-white"
                    />
                  </div>
                </div>

                <Link href="/results" className="block pt-2">
                  <Button
                    className="w-full text-white shadow-xl text-xs font-black uppercase tracking-widest h-14 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 hover:opacity-90"
                    style={{ backgroundColor: "#CC1F1F" }}
                  >
                    Find Best Route <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Searches */}
            <div className="pt-2">
              <h3 className="text-[10px] font-black text-slate-400 uppercase px-2 mb-3 tracking-[0.2em]">Recent Journeys</h3>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {["Stadium ↔ Bole", "Piassa ↔ Ayat"].map((route) => (
                  <button key={route} className="flex-shrink-0 flex items-center gap-2 bg-white border border-slate-100 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:border-slate-300 hover:shadow-sm transition-all shadow-sm shadow-slate-100/50">
                    <Clock className="w-3.5 h-3.5 text-slate-300" /> {route}
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="passes" className="space-y-6 outline-none">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Daily Pass", icon: Bus, desc: "Unlimited rides today", price: "15 ETB" },
                { label: "Weekly Pass", icon: Bus, desc: "7 days unlimited", price: "80 ETB" },
                { label: "Monthly Pass", icon: Bus, desc: "30 days unlimited", price: "280 ETB", className: "col-span-2 lg:col-span-1" },
              ].map((item) => (
                <motion.button
                  key={item.label}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-start gap-4 p-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm transition-all hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-200 text-left ${item.className || ""}`}
                >
                  <div
                    className="w-14 h-14 rounded-[1.25rem] flex items-center justify-center shadow-inner"
                    style={{ backgroundColor: "#CC1F1F15", color: "#CC1F1F" }}
                  >
                    <item.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-black text-slate-800 uppercase tracking-widest leading-tight">{item.label}</span>
                    <span className="block text-[10px] font-bold text-slate-400 mt-1">{item.desc}</span>
                    <span className="block text-sm font-black mt-2" style={{ color: "#CC1F1F" }}>{item.price}</span>
                  </div>
                </motion.button>
              ))}
            </div>
            <div className="rounded-3xl p-6 flex items-start gap-4" style={{ backgroundColor: "#CC1F1F0D", border: "1px solid #CC1F1F20" }}>
              <div className="p-2 rounded-full shrink-0" style={{ backgroundColor: "#CC1F1F20", color: "#CC1F1F" }}>
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-tight" style={{ color: "#CC1F1F" }}>NFC Tap &amp; Go</h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">
                  Established in 1945, Anbessa Bus is Addis Ababa's premier transport provider. Tapping your phone on the validator gets you moving instantly.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* History Quick Link */}
        <Link href="/routes" className="group">
          <Card className="border-0 bg-white/50 backdrop-blur-sm border border-white hover:border-[#CC1F1F]/20 transition-all rounded-[2rem] p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: "#CC1F1F" }}>
                  <Info className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-tighter text-slate-800">Route Directory & History</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Explore 115+ Active Routes</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        </Link>
      </div>

      {/* Right Column: Interactive Map (Desktop Only) */}
      <div className="hidden lg:flex flex-col h-full min-h-[600px] w-full rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white relative group">
        <LiveMap />
        <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 backdrop-blur-md rounded-3xl z-20 shadow-xl border border-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0">
          <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Real-Time Fleet
          </h3>
          <p className="text-xs font-medium text-slate-500 mt-2 leading-relaxed">
            Live Anbessa Bus positions across Addis Ababa. Tap a bus for route details.
          </p>
        </div>
      </div>
    </div>
  );
}
