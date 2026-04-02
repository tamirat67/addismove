"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingConfirm } from "@/components/BookingConfirm";
import { LiveMap } from "@/components/LiveMap";
import Link from "next/link";
import { Bus, Train, Clock, ArrowLeft, Shuffle, Loader2, ListFilter, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const mockResults = [
  { 
    id: "r1", 
    name: "Bus + Train Route", 
    type: "Combined", 
    price: 12.00, 
    duration: "35 min", 
    tag: "Fastest",
    steps: "🚌 Anbessa → 🚆 LRT"
  },
  { 
    id: "r2", 
    name: "Bus Only", 
    type: "Bus", 
    price: 8.00, 
    duration: "55 min", 
    tag: "Cheapest",
    steps: "🚌 Anbessa (Direct)"
  },
  { 
    id: "r3", 
    name: "Train Only", 
    type: "Train", 
    price: 10.00, 
    duration: "40 min", 
    tag: "Balanced",
    steps: "🚆 LRT + 10m Walk"
  },
];

export default function Results() {
  const [loading, setLoading] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState<typeof mockResults[0] | null>(null);
  const [filter, setFilter] = useState("Fastest");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full pb-20 lg:pb-0 h-full flex flex-col">
      <div className="flex items-center gap-4 mb-6 px-1 lg:px-0">
        <Link href="/" className="p-2 bg-white shadow-sm border border-slate-100 rounded-xl text-slate-500 hover:text-[#060267] transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-xl lg:text-3xl font-black text-[#060267] uppercase tracking-tight">Available Routes</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] lg:text-xs text-slate-500 font-bold uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-md">Megenagna</span>
            <ArrowLeft className="w-3 h-3 text-slate-300 rotate-180" />
            <span className="text-[10px] lg:text-xs text-slate-500 font-bold uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-md">Piassa</span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center py-32 space-y-8"
          >
            <div className="relative w-24 h-24 mx-auto">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-[#060267]/10 border-t-[#060267] rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Shuffle className="w-10 h-10 text-[#060267] animate-pulse" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-[#060267] font-black uppercase text-lg lg:text-xl tracking-tight">Analyzing Network...</p>
              <p className="text-xs lg:text-sm text-slate-400 font-medium mt-2">Checking real-time Anbessa & LRT schedules</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start"
          >
            {/* Left Column: Route List (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Filters */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {["Fastest", "Cheapest", "Balanced"].map((f) => (
                  <Button
                    key={f}
                    variant={filter === f ? "default" : "outline"}
                    onClick={() => setFilter(f)}
                    className={`rounded-xl px-5 h-10 text-[11px] font-black uppercase tracking-wider transition-all border border-slate-200 ${
                      filter === f ? "bg-[#060267] text-white shadow-lg pointer-events-none" : "bg-white text-slate-500 hover:bg-slate-50"
                    }`}
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
                {mockResults.map((route, i) => (
                  <motion.div
                    key={route.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card 
                      className={`border-2 shadow-sm overflow-hidden relative cursor-pointer group transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/10 hover:-translate-y-1 rounded-[1.5rem] bg-white ${
                        route.tag === filter ? "border-[#92c01f] ring-4 ring-[#92c01f]/10" : "border-slate-100 hover:border-slate-300"
                      }`}
                    >
                      {route.tag === filter && (
                        <div className="absolute top-0 right-0 bg-[#92c01f] text-white text-[10px] font-black px-4 py-1.5 rounded-bl-xl uppercase tracking-widest z-10 shadow-sm">
                          Best Option
                        </div>
                      )}
                      
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h3 className="font-black text-[#060267] flex items-center gap-2 text-xl tracking-tight">
                              {route.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md inline-block">
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
                            <span className="flex items-center bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg">
                              <Clock className="w-4 h-4 mr-2" /> {route.duration}
                            </span>
                          </div>
                          <Button 
                            onClick={() => setSelectedRoute(route)}
                            className="bg-[#060267] hover:bg-black text-white rounded-xl shadow-lg shadow-blue-900/20 px-8 h-10 font-black uppercase tracking-widest text-[10px]"
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

            {/* Right Column: Route Map (Desktop Only - 7 Cols) */}
            <div className="hidden lg:block lg:col-span-7 sticky top-24">
              <div className="w-full h-[600px] bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl relative border-4 border-white group">
                <LiveMap />
                
                {/* Overlay Context Info */}
                <div className="absolute top-6 left-6 right-6 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="bg-white/95 backdrop-blur shadow-lg border border-white p-4 rounded-2xl flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Departure</p>
                    <p className="font-bold text-slate-800 text-sm flex items-center gap-2">
                       <MapPin className="w-4 h-4 text-[#060267]" /> Megenagna Station
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
