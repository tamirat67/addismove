"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingConfirm } from "@/components/BookingConfirm";
import Link from "next/link";
import { Bus, Train, Clock, ArrowLeft, MoveRight, Shuffle, Loader2, ListFilter } from "lucide-react";
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
    <div className="max-w-md mx-auto w-full px-4 pt-4 space-y-4 pb-10">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="text-gray-500 hover:text-black transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-lg font-bold text-[#060267] uppercase tracking-tight">Routes Found</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Megenagna to Piassa</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-20 text-center space-y-6"
          >
            <div className="relative w-20 h-20 mx-auto">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-[#060267]/10 border-t-[#060267] rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Shuffle className="w-8 h-8 text-[#060267] animate-pulse" />
              </div>
            </div>
            <div>
              <p className="text-[#060267] font-black uppercase text-sm tracking-widest">Finding Best Routes</p>
              <p className="text-xs text-gray-400 font-medium mt-1">Checking Anbessa & LRT Schedules...</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
              {["Fastest", "Cheapest", "Balanced"].map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? "default" : "outline"}
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-4 h-8 text-[10px] font-bold uppercase tracking-wider transition-all border-gray-200 ${
                    filter === f ? "bg-[#060267] text-white shadow-md" : "bg-white text-gray-500"
                  }`}
                >
                  {f}
                </Button>
              ))}
              <Button variant="ghost" size="sm" className="h-8 rounded-full text-gray-400"><ListFilter className="w-4 h-4" /></Button>
            </div>

            {/* Results Cards */}
            {mockResults.map((route, i) => (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card 
                  className={`border-0 shadow-sm overflow-hidden relative group transition-all hover:shadow-lg hover:-translate-y-0.5 ${
                    route.tag === "Fastest" ? "ring-2 ring-[#92c01f]" : ""
                  }`}
                >
                  {route.tag === "Fastest" && (
                    <div className="absolute top-0 right-0 bg-[#92c01f] text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest z-10">
                      Fastest
                    </div>
                  )}
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-[#060267] flex items-center gap-2 text-lg">
                          {route.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs font-bold uppercase tracking-tight text-gray-500">
                          {route.steps}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block font-black text-xl text-gray-900 leading-none">{route.price}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ETB</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm mt-6 border-t pt-4 border-gray-50">
                      <div className="flex items-center gap-4 text-gray-500 text-xs font-bold uppercase tracking-wider">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1.5 text-gray-400" /> {route.duration}
                        </span>
                        <span className="flex items-center">
                           10 min walk
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => setSelectedRoute(route)}
                        className="bg-[#060267] hover:bg-[#060267]/90 text-white rounded-xl shadow-lg px-6 font-bold"
                      >
                        Book
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
