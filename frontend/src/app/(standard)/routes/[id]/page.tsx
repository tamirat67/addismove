"use client";

import { useTenant } from "@/context/TenantContext";
import { anbessaRoutes } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
    ArrowLeft, 
    Bus, 
    MapPin, 
    Clock, 
    Navigation, 
    ShieldCheck, 
    ChevronRight,
    Users
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { LiveMap } from "@/components/LiveMap";

export default function RouteDetail() {
  const params = useParams();
  const routeId = params.id as string;
  const { theme } = useTenant();

  const route = anbessaRoutes.find(r => r.id === routeId);

  if (!route) {
    return (
      <div className="py-32 text-center space-y-4">
        <h2 className="text-2xl font-black uppercase tracking-widest text-slate-300">Route Not Found</h2>
        <Link href="/routes">
            <Button variant="outline" className="rounded-xl">Return to Directory</Button>
        </Link>
      </div>
    );
  }

  // Simulated stops based on the route info
  const stops = [
      { name: route.start, time: "Scheduled" },
      { name: route.passBy !== "-" ? route.passBy : "Intermediary Hub", time: "+12 min" },
      { name: "Terminal Gate A", time: "+24 min" },
      { name: route.destination, time: "+35 min" },
  ];

  return (
    <div className="max-w-6xl mx-auto w-full px-4 pt-10 lg:pt-16 pb-32 lg:pb-20 flex-1 animate-in fade-in duration-1000">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
        <div className="space-y-4">
            <Link href="/routes" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#CC1F1F] transition-colors">
                <ArrowLeft className="w-3 h-3" /> Back to Network
            </Link>
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-[2rem] bg-[#CC1F1F] flex items-center justify-center shadow-xl shadow-red-500/20">
                    <span className="text-2xl font-black text-white">{route.id}</span>
                </div>
                <div>
                    <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-slate-900 uppercase leading-none">
                        {route.start} <span className="text-slate-300">→</span><br />
                        <span style={{ color: "#CC1F1F" }}>{route.destination}</span>
                    </h1>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-4">
            <div className="p-4 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-emerald-500/10">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="pr-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Safety</p>
                    <p className="text-sm font-black text-slate-900">Level 4 Verified</p>
                </div>
            </div>
            <Link href="/results" className="block">
                <Button className="h-16 px-10 bg-[#CC1F1F] hover:bg-[#b01a1a] text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-red-500/40 active:scale-95 transition-all text-xs">
                    Book This Route
                </Button>
            </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
          
          {/* LEFT: ROUTE TIMELINE */}
          <div className="lg:col-span-4 space-y-8">
              <Card className="border-0 shadow-2xl shadow-black/5 rounded-[2.5rem] bg-white overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#FFD600]"></div>
                  <CardContent className="p-10 space-y-10">
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Stop Timeline</h3>
                      
                      <div className="space-y-12 relative">
                         {/* Connecting Line */}
                         <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-100"></div>

                         {stops.map((stop, i) => (
                             <motion.div 
                                key={i} 
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-6 relative z-10"
                             >
                                <div className={`w-6 h-6 rounded-full border-4 ${i === 0 ? "bg-[#CC1F1F] border-red-100" : "bg-white border-slate-100 shadow-sm"}`}></div>
                                <div className="flex-1">
                                    <p className={`text-sm font-black uppercase tracking-tight ${i === 0 ? "text-slate-900" : "text-slate-500"}`}>
                                        {stop.name}
                                    </p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{stop.time}</p>
                                </div>
                                {i === 0 && (
                                    <div className="px-2 py-0.5 bg-emerald-500 rounded text-[8px] font-black text-white uppercase tracking-tighter">Current</div>
                                )}
                             </motion.div>
                         ))}
                      </div>
                  </CardContent>
              </Card>

              {/* QUICK STATS */}
              <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-slate-950 rounded-3xl text-white">
                        <Users className="w-5 h-5 text-[#FFD600] mb-3" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Load Factor</p>
                        <p className="text-xl font-black">68%</p>
                  </div>
                  <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                        <Clock className="w-5 h-5 text-[#CC1F1F] mb-3" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Frequency</p>
                        <p className="text-xl font-black text-slate-900">12 Mins</p>
                  </div>
              </div>
          </div>

          {/* RIGHT: MAP & RADAR */}
          <div className="lg:col-span-8 space-y-8">
              <div className="w-full h-[500px] lg:h-[600px] bg-slate-900 rounded-[3.5rem] overflow-hidden relative border-4 border-white shadow-2xl group">
                    <LiveMap />
                    <div className="absolute top-8 left-8">
                        <div className="bg-white/90 backdrop-blur px-6 py-4 rounded-[2rem] shadow-2xl border border-white/50 flex items-center gap-4">
                             <Navigation className="w-5 h-5 text-[#CC1F1F]" />
                             <div>
                                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Telemetry</p>
                                 <p className="text-sm font-black text-slate-900 uppercase">Route {route.id} Operational</p>
                             </div>
                        </div>
                    </div>
                    {/* Floating HUD Elements */}
                    <div className="absolute bottom-10 right-10">
                        <div className="flex flex-col gap-3">
                             {[1, 2, 3].map(i => (
                                 <motion.div 
                                    key={i}
                                    animate={{ x: [0, -5, 0] }}
                                    transition={{ duration: 4, delay: i * 0.5, repeat: Infinity }}
                                    className="w-12 h-1.5 bg-white/20 rounded-full blur-sm"
                                 />
                             ))}
                        </div>
                    </div>
              </div>

              <div className="bg-slate-50 p-8 lg:p-12 rounded-[3.5rem] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                      <div className="p-5 rounded-[2rem] bg-white shadow-lg">
                          <Bus className="w-8 h-8 text-[#CC1F1F]" />
                      </div>
                      <div>
                          <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase">Express Capability</h4>
                          <p className="text-xs text-slate-500 font-medium max-w-xs mt-1">This route supports Anbessa Pro Express boarding with dedicated lane access.</p>
                      </div>
                  </div>
                  <div className="text-center md:text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Standard Fare</p>
                      <p className="text-4xl font-black text-slate-900 tracking-tighter">12.00 <span className="text-sm text-slate-400 tracking-normal">ETB</span></p>
                  </div>
              </div>
          </div>

      </div>
    </div>
  );
}
