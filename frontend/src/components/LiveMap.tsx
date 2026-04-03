"use client";

import { useTenant } from "@/context/TenantContext";
import { Card } from "@/components/ui/card";
import { Bus, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function LiveMap() {
  const { tenant, theme } = useTenant();

  return (
    <Card className="border shadow-sm border-gray-200 rounded-3xl overflow-hidden bg-gray-50 min-h-[400px] lg:h-[480px] relative w-full group">
      {/* Route Map Background Graphics */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <div style={{ backgroundImage: "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)", backgroundSize: "24px 24px" }} className="w-full h-full absolute inset-0"></div>
        {/* Drawn Roads / Routes */}
        <svg className="w-full h-full absolute inset-0 opacity-80" viewBox="0 0 100 100" preserveAspectRatio="none">
           {/* Route A */}
           <path d="M-10,50 Q25,20 50,50 T110,40" fill="none" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
           <path d="M-10,50 Q25,20 50,50 T110,40" fill="none" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 3" />
           {/* Route B */}
           <path d="M20,-10 Q40,60 80,110" fill="none" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
           <path d="M20,-10 Q40,60 80,110" fill="none" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 3" />
        </svg>
      </div>
      
      {/* Map Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-200"></div>
          <span className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-500" />
            Live Fleet Radar
          </span>
        </div>
        <div className="flex gap-2">
          <div className="px-2 py-1 bg-gray-100 rounded-lg text-[10px] font-bold text-gray-600 uppercase border border-gray-200">
            Hub: Piassa
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {/* Vehicle Markers */}
        <AnimatePresence>
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                x: [Math.random() * 160 - 80, Math.random() * 160 - 80],
                y: [Math.random() * 160 - 80, Math.random() * 160 - 80],
              }}
              transition={{ 
                duration: 20 + Math.random() * 20, 
                repeat: Infinity, 
                repeatType: "reverse",
                ease: "linear"
              }}
              className="absolute z-20"
            >
              <div className="relative group/marker">
                <div 
                  className="w-16 h-16 rounded-full blur-2xl absolute -inset-2 opacity-40 transition-opacity group-hover/marker:opacity-60"
                  style={{ backgroundColor: theme.primary }}
                ></div>
                <div 
                  className="w-11 h-11 rounded-full flex items-center justify-center relative border-[3px] border-white shadow-xl transition-transform group-hover/marker:scale-110"
                  style={{ backgroundColor: theme.primary }}
                >
                  <Bus className="w-6 h-6 text-white drop-shadow-sm" strokeWidth={2.5} />
                  {/* Real-time Indicator Dot */}
                  <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Map Actions */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex gap-2">
        <button className="flex-1 py-3 bg-white/95 hover:bg-white backdrop-blur-md rounded-xl text-xs font-bold text-gray-700 uppercase tracking-widest transition-all border border-gray-200 shadow-sm active:scale-95">
          Recenter Maps
        </button>
        <button className="flex-1 py-3 bg-white/95 hover:bg-white backdrop-blur-md rounded-xl text-xs font-bold text-gray-700 uppercase tracking-widest transition-all border border-gray-200 shadow-sm active:scale-95">
          Filters
        </button>
      </div>
    </Card>
  );
}
