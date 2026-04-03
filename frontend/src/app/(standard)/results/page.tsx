"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingConfirm } from "@/components/BookingConfirm";
import { LiveMap } from "@/components/LiveMap";
import Link from "next/link";
import { Bus, Clock, ArrowLeft, Loader2, ListFilter, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { anbessaRoutes, BusRoute } from "@/lib/routes";

const computeDuration = (distanceStr: string) => {
  const dist = parseFloat(distanceStr.split(" ")[0]);
  if (isNaN(dist)) return "45 min";
  const mins = Math.round(dist * 4 + 10); // ~4 mins per km + 10 mins buffer
  return `${mins} min`;
};

const computePrice = (distanceStr: string) => {
  const dist = parseFloat(distanceStr.split(" ")[0]);
  if (isNaN(dist)) return 10.00;
  return Math.round(dist * 1.5); // 1.5 ETB per km
};

export default function Results() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Fastest");

  // Simulate finding routes based on the search "Megenagna" or "Piassa"
  const searchResults = anbessaRoutes.filter(r => 
    r.start.toLowerCase().includes("megenagna") || 
    r.destination.toLowerCase().includes("piassa") ||
    r.destination.toLowerCase().includes("piazza")
  ).slice(0, 4).map((r, i) => ({
    id: r.id,
    name: `${r.start} – ${r.destination}`,
    type: "Bus",
    price: computePrice(r.distance),
    duration: computeDuration(r.distance),
    tag: i === 0 ? "Fastest" : i === 1 ? "Cheapest" : "Balanced",
    steps: `🚌 Route ${r.id} · ${r.passBy === "-" ? "Direct" : "via " + r.passBy}`,
  }));

  const [selectedRoute, setSelectedRoute] = useState<typeof searchResults[0] | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full pb-20 lg:pb-0 h-full flex flex-col">
      <div className="flex items-center gap-4 mb-6 px-1 lg:px-0">
        <Link
          href="/"
          className="p-2 bg-white shadow-sm border border-slate-100 rounded-xl transition-all hover:border-[#CC1F1F]/30"
          style={{ color: "#CC1F1F" }}
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-xl lg:text-3xl font-black uppercase tracking-tight" style={{ color: "#CC1F1F" }}>
            Available Routes
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] lg:text-xs text-slate-500 font-bold uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-md">Megenagna</span>
            <ArrowLeft className="w-3 h-3 text-slate-300 rotate-180" />
            <span className="text-[10px] lg:text-xs text-slate-500 font-bold uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-md">Piassa</span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center py-32 space-y-8">
            <div className="relative w-24 h-24 mx-auto">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 rounded-full"
                style={{ borderColor: "#CC1F1F1A", borderTopColor: "#CC1F1F" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Bus className="w-10 h-10 animate-pulse" style={{ color: "#CC1F1F" }} />
              </div>
            </div>
            <div className="text-center">
              <p className="font-black uppercase text-lg lg:text-xl tracking-tight" style={{ color: "#CC1F1F" }}>
                Checking Schedules...
              </p>
              <p className="text-xs lg:text-sm text-slate-400 font-medium mt-2">
                Finding the best Anbessa Bus routes for you
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">

            {/* Left Column: Route List */}
            <div className="lg:col-span-5 space-y-6">
              {/* Filters */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {["Fastest", "Cheapest", "Balanced"].map((f) => (
                  <Button
                    key={f}
                    variant={filter === f ? "default" : "outline"}
                    onClick={() => setFilter(f)}
                    className={`rounded-xl px-5 h-10 text-[11px] font-black uppercase tracking-wider transition-all border ${
                      filter === f
                        ? "text-white shadow-lg pointer-events-none border-transparent"
                        : "bg-white text-slate-500 hover:bg-slate-50 border-slate-200"
                    }`}
                    style={filter === f ? { backgroundColor: "#CC1F1F" } : {}}
                  >
                    {f}
                  </Button>
                ))}
                <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 rounded-xl bg-white border-slate-200 text-slate-400">
                  <ListFilter className="w-5 h-5" />
                </Button>
              </div>

              {/* Results Cards */}
              <div className="space-y-4">
                {searchResults.map((route: any, i: number) => (
                  <motion.div key={route.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                    <Card
                      className={`border-2 shadow-sm overflow-hidden relative cursor-pointer group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 rounded-[1.5rem] bg-white ${
                        route.tag === filter
                          ? "border-[#FFD600] ring-4 ring-[#FFD600]/20"
                          : "border-slate-100 hover:border-slate-300"
                      }`}
                    >
                      {route.tag === filter && (
                        <div
                          className="absolute top-0 right-0 text-white text-[10px] font-black px-4 py-1.5 rounded-bl-xl uppercase tracking-widest z-10 shadow-sm"
                          style={{ backgroundColor: "#FFD600", color: "#CC1F1F" }}
                        >
                          Best Option
                        </div>
                      )}
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h3 className="font-black flex items-center gap-2 text-xl tracking-tight" style={{ color: "#CC1F1F" }}>
                              {route.name}
                            </h3>
                            <div
                              className="flex items-center gap-2 mt-2 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md inline-block"
                              style={{ backgroundColor: "#CC1F1F0D", color: "#CC1F1F" }}
                            >
                              {route.steps}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="block font-black text-2xl text-slate-800 leading-none">{route.price}</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ETB</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-6 border-t border-slate-100 pt-5">
                          <div className="flex items-center gap-4 text-slate-500 text-[11px] font-black uppercase tracking-wider">
                            <span className="flex items-center bg-red-50 px-3 py-1.5 rounded-lg" style={{ color: "#CC1F1F" }}>
                              <Clock className="w-4 h-4 mr-2" /> {route.duration}
                            </span>
                          </div>
                          <Button
                            onClick={() => setSelectedRoute(route)}
                            className="text-white rounded-xl shadow-lg px-8 h-10 font-black uppercase tracking-widest text-[10px] hover:opacity-90"
                            style={{ backgroundColor: "#CC1F1F" }}
                          >
                            Book Pass
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Column: Route Map (Desktop Only) */}
            <div className="hidden lg:block lg:col-span-7 sticky top-24">
              <div className="w-full h-[600px] bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl relative border-4 border-white group">
                <LiveMap />
                <div className="absolute top-6 left-6 right-6 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="bg-white/95 backdrop-blur shadow-lg border border-white p-4 rounded-2xl flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Departure</p>
                    <p className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      <MapPin className="w-4 h-4" style={{ color: "#CC1F1F" }} /> Megenagna Terminal
                    </p>
                  </div>
                  <div className="bg-white/95 backdrop-blur shadow-lg border border-white p-4 rounded-2xl flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Arrival</p>
                    <p className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-rose-500" /> Piassa Hub
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BookingConfirm
        isOpen={!!selectedRoute}
        onClose={() => setSelectedRoute(null)}
        routeData={selectedRoute || { name: "", type: "", price: 0, duration: "" }}
      />
    </div>
  );
}
